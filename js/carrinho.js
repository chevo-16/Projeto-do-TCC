import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let carrinhoLocal = [];
let uidUsuario = null;
let usuarioEmail = null;
let enderecoPadraoTexto = "Nenhum endereço padrão cadastrado";
let valorDescontoAplicado = 0;
let cupomAplicadoNome = "";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    uidUsuario = user.uid;
    usuarioEmail = user.email;
    await carregarEnderecoPadrao(uidUsuario);
    await carregarCuponsUsuario(uidUsuario);
    await carregarCarrinho(uidUsuario);
  } else {
    window.location.href = "index01.html";
  }
});

// Busca todos os endereços do usuário no Firestore e escolhe o padrão ou o primeiro disponível
async function carregarEnderecoPadrao(uid) {
  const elEndereco = document.getElementById("texto-endereco-padrao");
  try {
    const qTodos = query(collection(db, "enderecos"), where("userId", "==", uid));
    const snapTodos = await getDocs(qTodos);

    if (!snapTodos.empty) {
      let enderecoSelecionado = null;

      snapTodos.forEach(docSnap => {
        const d = docSnap.data();
        if (d.ePadrao === true || d.ePadrao === "true") {
          enderecoSelecionado = d;
        }
      });

      if (!enderecoSelecionado) {
        enderecoSelecionado = snapTodos.docs[0].data();
      }

      const logradouro = enderecoSelecionado.logradouro || '';
      const numero = enderecoSelecionado.numero || 'S/N';
      const complemento = enderecoSelecionado.complemento ? `- ${enderecoSelecionado.complemento}` : '';
      const bairro = enderecoSelecionado.bairro || '';
      const cidade = enderecoSelecionado.cidade || '';
      const estado = enderecoSelecionado.estado || '';

      enderecoPadraoTexto = `${logradouro}, ${numero} ${complemento} - ${bairro}, ${cidade}/${estado}`;
    } else {
      enderecoPadraoTexto = "Nenhum endereço padrão cadastrado";
    }

    if (elEndereco) elEndereco.textContent = enderecoPadraoTexto;
  } catch (error) {
    console.error("Erro ao carregar endereço padrão:", error);
    if (elEndereco) elEndereco.textContent = "Erro ao carregar endereço";
  }
}

async function carregarCuponsUsuario(uid) {
  try {
    const userSnap = await getDoc(doc(db, "usuarios", uid));
    if (userSnap.exists()) {
      const data = userSnap.data();
      const selectCupons = document.getElementById("select-cupons-usuario");
      if (selectCupons && data.cupons && Array.isArray(data.cupons)) {
        selectCupons.innerHTML = `<option value="">Nenhum cupom selecionado</option>`;
        data.cupons.forEach(c => {
          selectCupons.innerHTML += `<option value="${c.desconto}">${c.nome} (${c.desconto}% OFF)</option>`;
        });
      }
    }
  } catch (error) {
    console.error("Erro ao carregar cupons do usuário:", error);
  }
}

async function carregarCarrinho(uid) {
  try {
    const userRef = doc(db, "usuarios", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      carrinhoLocal = userSnap.data().carrinho || [];
      renderizarCarrinho();
    } else {
      renderizarCarrinho();
    }
  } catch (error) {
    console.error("Erro ao carregar carrinho:", error);
    renderizarCarrinho();
  }
}

function formatarTamanhoItem(item) {
  if (item.tamanho) return item.tamanho;
  const idStr = String(item.id || '');
  if (idStr.startsWith('sap_i')) return '28';
  if (idStr.startsWith('sap_') || item.categoria === 'calcados') return '40';
  if (idStr.startsWith('inf_') || item.categoria === 'infantil') return '10';
  return 'M';
}

function renderizarCarrinho() {
  const container = document.getElementById("lista-carrinho");
  if (!container) return;
  
  container.innerHTML = "";

  if (carrinhoLocal.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 40px 0; color: #666;">
      <i class="fa-solid fa-cart-flatbed" style="font-size: 48px; color: #ccc; margin-bottom: 12px;"></i>
      <p style="font-size: 16px; font-weight: 500;">Seu carrinho está vazio.</p>
    </div>`;
    atualizarResumo();
    return;
  }

  carrinhoLocal.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item-carrinho";
    
    const tamanhoExibicao = formatarTamanhoItem(item);
    const qtdItem = item.quantidade || item.qtd || 1;
    const precoUnitario = Number(item.preco) || 0;
    const subtotal = (precoUnitario * qtdItem).toFixed(2);

    div.innerHTML = `
      <input type="checkbox" class="chk-item" data-index="${index}" />
      <img src="${item.img}" alt="${item.nome}" />
      <div class="item-detalhes">
        <h4>${item.nome}</h4>
        <div class="item-meta">Tamanho: <strong>${tamanhoExibicao}</strong></div>
        <div class="qtd-controle" style="display: flex; align-items: center; gap: 8px; margin: 6px 0;">
          <button type="button" class="btn-menos-cart" data-index="${index}">-</button>
          <span style="font-weight: bold; font-size: 14px;">${qtdItem}</span>
          <button type="button" class="btn-mais-cart" data-index="${index}">+</button>
        </div>
        <div class="item-preco">R$ ${subtotal}</div>
      </div>
      <button type="button" class="btn-remover" data-index="${index}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    container.appendChild(div);
  });

  vincularEventosItens();
  atualizarResumo();
}

function vincularEventosItens() {
  document.querySelectorAll(".chk-item").forEach(chk => {
    chk.addEventListener("change", () => {
      const todos = document.querySelectorAll(".chk-item");
      const todosMarcados = Array.from(todos).length > 0 && Array.from(todos).every(c => c.checked);
      const chkSelectAll = document.getElementById("select-all");
      if (chkSelectAll) chkSelectAll.checked = todosMarcados;

      atualizarResumo();
    });
  });

  document.querySelectorAll(".btn-remover").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const idx = Number(e.currentTarget.getAttribute("data-index"));
      carrinhoLocal.splice(idx, 1);
      await salvarCarrinhoNoBanco();
      renderizarCarrinho();
    });
  });

  document.querySelectorAll(".btn-menos-cart").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const idx = Number(e.currentTarget.getAttribute("data-index"));
      const qtdAtual = carrinhoLocal[idx].quantidade || carrinhoLocal[idx].qtd || 1;
      if (qtdAtual > 1) {
        carrinhoLocal[idx].quantidade = qtdAtual - 1;
        await salvarCarrinhoNoBanco();
        renderizarCarrinho();
      }
    });
  });

  document.querySelectorAll(".btn-mais-cart").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const idx = Number(e.currentTarget.getAttribute("data-index"));
      const qtdAtual = carrinhoLocal[idx].quantidade || carrinhoLocal[idx].qtd || 1;
      carrinhoLocal[idx].quantidade = qtdAtual + 1;
      await salvarCarrinhoNoBanco();
      renderizarCarrinho();
    });
  });
}

function obterItensSelecionados() {
  const checkboxes = document.querySelectorAll(".chk-item");
  const itensComprados = [];
  const indicesParaRemover = [];
  let subtotal = 0;

  checkboxes.forEach((chk) => {
    if (chk.checked) {
      const idx = Number(chk.getAttribute("data-index"));
      const item = carrinhoLocal[idx];
      if (item) {
        const qtd = item.quantidade || item.qtd || 1;
        subtotal += (Number(item.preco) || 0) * qtd;
        
        itensComprados.push({
          nome: item.nome,
          preco: Number(item.preco) || 0,
          quantidade: qtd,
          tamanho: formatarTamanhoItem(item),
          img: item.img || ''
        });

        indicesParaRemover.push(idx);
      }
    }
  });

  const totalComDesconto = Math.max(0, subtotal - valorDescontoAplicado);

  return { itensComprados, indicesParaRemover, subtotal, totalComDesconto };
}

function atualizarResumo() {
  const { itensComprados, totalComDesconto } = obterItensSelecionados();

  const totalEl = document.getElementById("valor-total-carrinho");
  if (totalEl) totalEl.textContent = `R$ ${totalComDesconto.toFixed(2)}`;

  const btnComprar = document.getElementById("btn-finalizar-compra");
  if (btnComprar) {
    btnComprar.textContent = `Comprar Selecionados (${itensComprados.length})`;
    btnComprar.disabled = itensComprados.length === 0;
  }
}

async function salvarCarrinhoNoBanco() {
  if (!uidUsuario) return;
  try {
    await setDoc(doc(db, "usuarios", uidUsuario), { carrinho: carrinhoLocal }, { merge: true });
  } catch (error) {
    console.error("Erro ao salvar carrinho:", error);
  }
}

function abrirModalCheckout() {
  const { itensComprados, subtotal, totalComDesconto } = obterItensSelecionados();

  if (itensComprados.length === 0) {
    alert("Selecione pelo menos um item para comprar!");
    return;
  }

  const modal = document.getElementById("modal-checkout");
  const resumoBox = document.getElementById("resumo-pedido");

  if (resumoBox) {
    resumoBox.innerHTML = `
      <p>Itens selecionados: <strong>${itensComprados.length}</strong></p>
      <p>Subtotal: <strong>R$ ${subtotal.toFixed(2)}</strong></p>
      ${valorDescontoAplicado > 0 ? `<p style="color:#e74c3c">Desconto: <strong>- R$ ${valorDescontoAplicado.toFixed(2)} (${cupomAplicadoNome})</strong></p>` : ''}
      <p class="valor-total">Total a pagar: <strong>R$ ${totalComDesconto.toFixed(2)}</strong></p>
    `;
  }

  carregarCartoesSalvos();
  if (modal) modal.classList.remove("hidden");
}

document.getElementById("select-cupons-usuario")?.addEventListener("change", (e) => {
  const perc = Number(e.target.value) || 0;
  if (perc > 0) {
    const { subtotal } = obterItensSelecionados();
    valorDescontoAplicado = subtotal * (perc / 100);
    cupomAplicadoNome = `${perc}% OFF (Joguinho)`;
  } else {
    valorDescontoAplicado = 0;
    cupomAplicadoNome = "";
  }
  atualizarResumo();
  abrirModalCheckout();
});

document.getElementById("btn-aplicar-cupom")?.addEventListener("click", () => {
  const cupom = document.getElementById("input-cupom").value.trim().toUpperCase();
  const msg = document.getElementById("msg-cupom");

  if (cupom === "BUENAO10") {
    const { subtotal } = obterItensSelecionados();
    valorDescontoAplicado = subtotal * 0.10;
    cupomAplicadoNome = "BUENAO10";
    if (msg) {
      msg.style.color = "#27ae60";
      msg.textContent = "Cupom de 10% aplicado!";
    }
  } else if (cupom === "") {
    valorDescontoAplicado = 0;
    cupomAplicadoNome = "";
    if (msg) msg.textContent = "";
  } else {
    valorDescontoAplicado = 0;
    cupomAplicadoNome = "";
    if (msg) {
      msg.style.color = "#e74c3c";
      msg.textContent = "Cupom não encontrado.";
    }
  }
  atualizarResumo();
  abrirModalCheckout();
});

document.getElementById("btn-toggle-endereco")?.addEventListener("click", () => {
  const boxNovo = document.getElementById("box-novo-endereco");
  const btn = document.getElementById("btn-toggle-endereco");
  
  if (boxNovo.classList.contains("hidden")) {
    boxNovo.classList.remove("hidden");
    btn.innerHTML = `<i class="fa-solid fa-rotate-left"></i> Usar endereço padrão`;
  } else {
    boxNovo.classList.add("hidden");
    document.getElementById("checkout-novo-endereco").value = "";
    btn.innerHTML = `<i class="fa-solid fa-plus"></i> Usar outro endereço`;
  }
});

async function carregarCartoesSalvos() {
  const selectCartao = document.getElementById("select-cartao-usuario");
  if (!selectCartao || !uidUsuario) return;

  selectCartao.innerHTML = "";

  try {
    const userSnap = await getDoc(doc(db, "usuarios", uidUsuario));
    if (userSnap.exists() && userSnap.data().cartoes && userSnap.data().cartoes.length > 0) {
      userSnap.data().cartoes.forEach(cartao => {
        const option = document.createElement("option");
        option.value = cartao.final;
        option.textContent = `${cartao.bandeira || 'Cartão'} terminado em ${cartao.final}`;
        selectCartao.appendChild(option);
      });
    } else {
      selectCartao.innerHTML = `<option value="">Nenhum cartão cadastrado</option>`;
    }
  } catch (error) {
    console.error("Erro ao carregar cartões:", error);
  }
}

async function processarCompra(e) {
  e.preventDefault();

  const { itensComprados, indicesParaRemover, totalComDesconto } = obterItensSelecionados();
  
  const boxNovoEscondido = document.getElementById("box-novo-endereco")?.classList.contains("hidden");
  const novoEnderecoVal = document.getElementById("checkout-novo-endereco")?.value.trim();

  let enderecoFinal = enderecoPadraoTexto;
  if (!boxNovoEscondido && novoEnderecoVal) {
    enderecoFinal = novoEnderecoVal;
  }

  const radioPagamento = document.querySelector('input[name="formaPagamento"]:checked');
  const formaPagamento = radioPagamento ? radioPagamento.value : 'Pix';

  let detalhePagamento = formaPagamento;
  if (formaPagamento === "Cartao") {
    const cartaoSelecionado = document.getElementById("select-cartao-usuario")?.value;
    if (!cartaoSelecionado) {
      alert("Selecione ou cadastre um cartão de crédito.");
      return;
    }
    detalhePagamento = `Cartão (Final ${cartaoSelecionado})`;
  }

  try {
    const userSnap = await getDoc(doc(db, "usuarios", uidUsuario));
    const nomeCliente = userSnap.exists() ? (userSnap.data().nome || usuarioEmail) : usuarioEmail;

    const dataEntrega = new Date();
    dataEntrega.setDate(dataEntrega.getDate() + 5);

    await addDoc(collection(db, "pedidos"), {
      uidCliente: uidUsuario,
      nomeCliente: nomeCliente || 'Cliente',
      userEmail: usuarioEmail || '',
      endereco: enderecoFinal,
      itens: itensComprados,
      total: totalComDesconto,
      formaPagamento: detalhePagamento,
      status: "Pendente",
      concluido: false,
      previsaoEntrega: dataEntrega.toLocaleDateString('pt-BR'),
      criadoEm: serverTimestamp()
    });

    carrinhoLocal = carrinhoLocal.filter((_, index) => !indicesParaRemover.includes(index));
    await salvarCarrinhoNoBanco();

    alert("🎉 Compra realizada com sucesso!");
    document.getElementById("modal-checkout")?.classList.add("hidden");
    window.location.href = "index02.html";

  } catch (error) {
    console.error("Erro ao processar compra:", error);
    alert("Erro ao processar o pedido. Tente novamente.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("select-all")?.addEventListener("change", (e) => {
    const checked = e.target.checked;
    document.querySelectorAll(".chk-item").forEach(chk => chk.checked = checked);
    atualizarResumo();
  });

  document.getElementById("btn-finalizar-compra")?.addEventListener("click", abrirModalCheckout);

  document.querySelectorAll('input[name="formaPagamento"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const area = document.getElementById("area-cartoes");
      if (area) {
        if (e.target.value === "Cartao") area.classList.remove("hidden");
        else area.classList.add("hidden");
      }
    });
  });

  document.getElementById("form-checkout")?.addEventListener("submit", processarCompra);
  document.getElementById("btn-close-checkout")?.addEventListener("click", () => {
    document.getElementById("modal-checkout")?.classList.add("hidden");
  });
});

window.irParaPagamentos = () => {
  window.location.href = "pagamentos.html";
};