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
let cuponsUsuarioLocal = [];
let identificadorUsuario = null;
let emailUsuario = null;
let enderecoPadraoTexto = "Nenhum endereço padrão cadastrado";
let valorDescontoAplicado = 0;
let percentualDescontoAtivo = 0;
let cupomAplicadoNome = "";

onAuthStateChanged(auth, async (usuario) => {
  if (usuario) {
    identificadorUsuario = usuario.uid;
    emailUsuario = usuario.email;
    await carregarEnderecoPadrao(identificadorUsuario);
    await carregarCuponsUsuario(identificadorUsuario);
    await carregarCarrinho(identificadorUsuario);
  } else {
    window.location.href = "index01.html";
  }
});

async function carregarEnderecoPadrao(identificador) {
  const elementoEndereco = document.getElementById("texto-endereco-padrao");
  try {
    const consultaEnderecos = query(collection(db, "enderecos"), where("userId", "==", identificador));
    const documentosEnderecos = await getDocs(consultaEnderecos);

    if (!documentosEnderecos.empty) {
      let enderecoSelecionado = null;

      documentosEnderecos.forEach(documento => {
        const dados = documento.data();
        if (dados.ePadrao === true || dados.ePadrao === "true") {
          enderecoSelecionado = dados;
        }
      });

      if (!enderecoSelecionado) {
        enderecoSelecionado = documentosEnderecos.docs[0].data();
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

    if (elementoEndereco) elementoEndereco.textContent = enderecoPadraoTexto;
  } catch (erro) {
    console.error("Erro ao carregar endereço padrão:", erro);
    if (elementoEndereco) elementoEndereco.textContent = "Erro ao carregar endereço";
  }
}

async function carregarCuponsUsuario(identificador) {
  try {
    const documentoUsuario = await getDoc(doc(db, "usuarios", identificador));
    if (documentoUsuario.exists()) {
      const dados = documentoUsuario.data();
      cuponsUsuarioLocal = Array.isArray(dados.cupons) ? dados.cupons : [];
      const selecaoCupons = document.getElementById("select-cupons-usuario");
      if (selecaoCupons) {
        selecaoCupons.innerHTML = `<option value="">Nenhum cupom selecionado</option>`;
        cuponsUsuarioLocal.forEach(cupom => {
          selecaoCupons.innerHTML += `<option value="${cupom.desconto}" data-nome="${cupom.nome}">${cupom.nome} (${cupom.desconto}% OFF)</option>`;
        });
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar cupons do usuário:", erro);
  }
}

async function carregarCarrinho(identificador) {
  try {
    const referenciaUsuario = doc(db, "usuarios", identificador);
    const documentoUsuario = await getDoc(referenciaUsuario);

    if (documentoUsuario.exists()) {
      carrinhoLocal = documentoUsuario.data().carrinho || [];
      renderizarCarrinho();
    } else {
      renderizarCarrinho();
    }
  } catch (erro) {
    console.error("Erro ao carregar carrinho:", erro);
    renderizarCarrinho();
  }
}

function formatarTamanhoItem(item) {
  if (item.tamanho) return item.tamanho;
  const codigoTexto = String(item.id || '');
  if (codigoTexto.startsWith('sap_i')) return '28';
  if (codigoTexto.startsWith('sap_') || item.categoria === 'calcados') return '40';
  if (codigoTexto.startsWith('inf_') || item.categoria === 'infantil') return '10';
  return 'M';
}

function renderizarCarrinho() {
  const listaContainer = document.getElementById("lista-carrinho");
  if (!listaContainer) return;
  
  listaContainer.innerHTML = "";

  if (carrinhoLocal.length === 0) {
    listaContainer.innerHTML = `<div style="text-align: center; padding: 40px 0; color: #666;">
      <i class="fa-solid fa-cart-flatbed" style="font-size: 48px; color: #ccc; margin-bottom: 12px;"></i>
      <p style="font-size: 16px; font-weight: 500;">Seu carrinho está vazio.</p>
    </div>`;
    atualizarResumo();
    return;
  }

  carrinhoLocal.forEach((item, indice) => {
    const cartaoItem = document.createElement("div");
    cartaoItem.className = "item-carrinho";
    
    const tamanhoExibicao = formatarTamanhoItem(item);
    const quantidadeItem = item.quantidade || item.qtd || 1;
    const precoUnitario = Number(item.preco) || 0;
    const subtotal = (precoUnitario * quantidadeItem).toFixed(2);

    cartaoItem.innerHTML = `
      <input type="checkbox" class="chk-item" data-index="${indice}" />
      <img src="${item.img}" alt="${item.nome}" />
      <div class="item-detalhes">
        <h4>${item.nome}</h4>
        <div class="item-meta">Tamanho: <strong>${tamanhoExibicao}</strong></div>
        <div class="qtd-controle" style="display: flex; align-items: center; gap: 8px; margin: 6px 0;">
          <button type="button" class="btn-menos-cart" data-index="${indice}">-</button>
          <span style="font-weight: bold; font-size: 14px;">${quantidadeItem}</span>
          <button type="button" class="btn-mais-cart" data-index="${indice}">+</button>
        </div>
        <div class="item-preco">R$ ${subtotal}</div>
      </div>
      <button type="button" class="btn-remover" data-index="${indice}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    listaContainer.appendChild(cartaoItem);
  });

  vincularEventosItens();
  atualizarResumo();
}

function vincularEventosItens() {
  document.querySelectorAll(".chk-item").forEach(caixaSelecao => {
    caixaSelecao.addEventListener("change", () => {
      const todasCaixas = document.querySelectorAll(".chk-item");
      const todasMarcadas = Array.from(todasCaixas).length > 0 && Array.from(todasCaixas).every(caixa => caixa.checked);
      const selecionarTodos = document.getElementById("select-all");
      if (selecionarTodos) selecionarTodos.checked = todasMarcadas;

      atualizarResumo();
    });
  });

  document.querySelectorAll(".btn-remover").forEach(botao => {
    botao.addEventListener("click", async (evento) => {
      const indice = Number(evento.currentTarget.getAttribute("data-index"));
      carrinhoLocal.splice(indice, 1);
      await salvarCarrinhoNoBanco();
      renderizarCarrinho();
    });
  });

  document.querySelectorAll(".btn-menos-cart").forEach(botao => {
    botao.addEventListener("click", async (evento) => {
      const indice = Number(evento.currentTarget.getAttribute("data-index"));
      const quantidadeAtual = carrinhoLocal[indice].quantidade || carrinhoLocal[indice].qtd || 1;
      if (quantidadeAtual > 1) {
        carrinhoLocal[indice].quantidade = quantidadeAtual - 1;
        await salvarCarrinhoNoBanco();
        renderizarCarrinho();
      }
    });
  });

  document.querySelectorAll(".btn-mais-cart").forEach(botao => {
    botao.addEventListener("click", async (evento) => {
      const indice = Number(evento.currentTarget.getAttribute("data-index"));
      const quantidadeAtual = carrinhoLocal[indice].quantidade || carrinhoLocal[indice].qtd || 1;
      carrinhoLocal[indice].quantidade = quantidadeAtual + 1;
      await salvarCarrinhoNoBanco();
      renderizarCarrinho();
    });
  });
}

function obterItensSelecionados() {
  const caixasSelecao = document.querySelectorAll(".chk-item");
  const itensComprados = [];
  const indicesParaRemover = [];
  let subtotal = 0;

  caixasSelecao.forEach((caixa) => {
    if (caixa.checked) {
      const indice = Number(caixa.getAttribute("data-index"));
      const item = carrinhoLocal[indice];
      if (item) {
        const quantidade = item.quantidade || item.qtd || 1;
        subtotal += (Number(item.preco) || 0) * quantidade;
        
        itensComprados.push({
          nome: item.nome,
          preco: Number(item.preco) || 0,
          quantidade: quantidade,
          tamanho: formatarTamanhoItem(item),
          img: item.img || ''
        });

        indicesParaRemover.push(indice);
      }
    }
  });

  valorDescontoAplicado = percentualDescontoAtivo > 0 ? subtotal * (percentualDescontoAtivo / 100) : 0;
  const totalComDesconto = Math.max(0, subtotal - valorDescontoAplicado);

  return { itensComprados, indicesParaRemover, subtotal, totalComDesconto };
}

function atualizarResumo() {
  const { itensComprados, totalComDesconto } = obterItensSelecionados();

  const elementoTotal = document.getElementById("valor-total-carrinho");
  if (elementoTotal) elementoTotal.textContent = `R$ ${totalComDesconto.toFixed(2)}`;

  const botaoComprar = document.getElementById("btn-finalizar-compra");
  if (botaoComprar) {
    botaoComprar.textContent = `Comprar Selecionados (${itensComprados.length})`;
    botaoComprar.disabled = itensComprados.length === 0;
  }
}

async function salvarCarrinhoNoBanco() {
  if (!identificadorUsuario) return;
  try {
    await setDoc(doc(db, "usuarios", identificadorUsuario), { carrinho: carrinhoLocal }, { merge: true });
  } catch (erro) {
    console.error("Erro ao salvar carrinho:", erro);
  }
}

function abrirModalCheckout() {
  const { itensComprados, subtotal, totalComDesconto } = obterItensSelecionados();

  if (itensComprados.length === 0) {
    alert("Selecione pelo menos um item para comprar!");
    return;
  }

  const janelaModal = document.getElementById("modal-checkout");
  const caixaResumo = document.getElementById("resumo-pedido");

  if (caixaResumo) {
    caixaResumo.innerHTML = `
      <p>Itens selecionados: <strong>${itensComprados.length}</strong></p>
      <p>Subtotal: <strong>R$ ${subtotal.toFixed(2)}</strong></p>
      ${valorDescontoAplicado > 0 ? `<p style="color:#e74c3c">Desconto: <strong>- R$ ${valorDescontoAplicado.toFixed(2)} (${cupomAplicadoNome})</strong></p>` : ''}
      <p class="valor-total">Total a pagar: <strong>R$ ${totalComDesconto.toFixed(2)}</strong></p>
    `;
  }

  carregarCartoesSalvos();
  if (janelaModal) janelaModal.classList.remove("hidden");
}

document.getElementById("select-cupons-usuario")?.addEventListener("change", (evento) => {
  const percentual = Number(evento.target.value) || 0;
  const opcaoSelecionada = evento.target.options[evento.target.selectedIndex];
  const nomeCupom = opcaoSelecionada ? opcaoSelecionada.getAttribute("data-nome") : "";

  if (percentual > 0) {
    percentualDescontoAtivo = percentual;
    cupomAplicadoNome = nomeCupom || `${percentual}% OFF`;
  } else {
    percentualDescontoAtivo = 0;
    cupomAplicadoNome = "";
  }
  atualizarResumo();
  abrirModalCheckout();
});

document.getElementById("btn-aplicar-cupom")?.addEventListener("click", () => {
  const codigoDigitado = document.getElementById("input-cupom").value.trim().toUpperCase();
  const mensagemCupom = document.getElementById("msg-cupom");

  const cupomGanho = cuponsUsuarioLocal.find(item => item.nome.toUpperCase() === codigoDigitado);

  if (cupomGanho) {
    percentualDescontoAtivo = Number(cupomGanho.desconto) || 0;
    cupomAplicadoNome = cupomGanho.nome;
    if (mensagemCupom) {
      mensagemCupom.style.color = "#27ae60";
      mensagemCupom.textContent = `Cupom de ${percentualDescontoAtivo}% aplicado!`;
    }
  } else if (codigoDigitado === "BUENAO10") {
    percentualDescontoAtivo = 10;
    cupomAplicadoNome = "BUENAO10";
    if (mensagemCupom) {
      mensagemCupom.style.color = "#27ae60";
      mensagemCupom.textContent = "Cupom de 10% aplicado!";
    }
  } else if (codigoDigitado === "") {
    percentualDescontoAtivo = 0;
    cupomAplicadoNome = "";
    if (mensagemCupom) mensagemCupom.textContent = "";
  } else {
    percentualDescontoAtivo = 0;
    cupomAplicadoNome = "";
    if (mensagemCupom) {
      mensagemCupom.style.color = "#e74c3c";
      mensagemCupom.textContent = "Cupom não encontrado.";
    }
  }
  atualizarResumo();
  abrirModalCheckout();
});

document.getElementById("btn-toggle-endereco")?.addEventListener("click", () => {
  const caixaNovoEndereco = document.getElementById("box-novo-endereco");
  const botaoAlternar = document.getElementById("btn-toggle-endereco");
  
  if (caixaNovoEndereco.classList.contains("hidden")) {
    caixaNovoEndereco.classList.remove("hidden");
    botaoAlternar.innerHTML = `<i class="fa-solid fa-rotate-left"></i> Usar endereço padrão`;
  } else {
    caixaNovoEndereco.classList.add("hidden");
    document.getElementById("checkout-novo-endereco").value = "";
    botaoAlternar.innerHTML = `<i class="fa-solid fa-plus"></i> Usar outro endereço`;
  }
});

async function carregarCartoesSalvos() {
  const selecaoCartao = document.getElementById("select-cartao-usuario");
  if (!selecaoCartao || !identificadorUsuario) return;

  selecaoCartao.innerHTML = "";

  try {
    const documentoUsuario = await getDoc(doc(db, "usuarios", identificadorUsuario));
    if (documentoUsuario.exists() && documentoUsuario.data().cartoes && documentoUsuario.data().cartoes.length > 0) {
      documentoUsuario.data().cartoes.forEach(cartao => {
        const opcao = document.createElement("option");
        opcao.value = cartao.final;
        opcao.textContent = `${cartao.bandeira || 'Cartão'} terminado em ${cartao.final}`;
        selecaoCartao.appendChild(opcao);
      });
    } else {
      selecaoCartao.innerHTML = `<option value="">Nenhum cartão cadastrado</option>`;
    }
  } catch (erro) {
    console.error("Erro ao carregar cartões:", erro);
  }
}

async function processarCompra(evento) {
  evento.preventDefault();

  const { itensComprados, indicesParaRemover, totalComDesconto } = obterItensSelecionados();
  
  const novoEnderecoEscondido = document.getElementById("box-novo-endereco")?.classList.contains("hidden");
  const novoEnderecoValor = document.getElementById("checkout-novo-endereco")?.value.trim();

  let enderecoFinal = enderecoPadraoTexto;
  if (!novoEnderecoEscondido && novoEnderecoValor) {
    enderecoFinal = novoEnderecoValor;
  }

  const opcaoPagamento = document.querySelector('input[name="formaPagamento"]:checked');
  const formaPagamento = opcaoPagamento ? opcaoPagamento.value : 'Pix';

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
    const documentoUsuario = await getDoc(doc(db, "usuarios", identificadorUsuario));
    const nomeCliente = documentoUsuario.exists() ? (documentoUsuario.data().nome || emailUsuario) : emailUsuario;

    const dataEntrega = new Date();
    dataEntrega.setDate(dataEntrega.getDate() + 5);

    await addDoc(collection(db, "pedidos"), {
      uidCliente: identificadorUsuario,
      nomeCliente: nomeCliente || 'Cliente',
      userEmail: emailUsuario || '',
      endereco: enderecoFinal,
      itens: itensComprados,
      total: totalComDesconto,
      formaPagamento: detalhePagamento,
      status: "Pendente",
      concluido: false,
      previsaoEntrega: dataEntrega.toLocaleDateString('pt-BR'),
      criadoEm: serverTimestamp()
    });

    carrinhoLocal = carrinhoLocal.filter((_, indice) => !indicesParaRemover.includes(indice));

    if (cupomAplicadoNome) {
      cuponsUsuarioLocal = cuponsUsuarioLocal.filter(item => item.nome !== cupomAplicadoNome);
    }

    await setDoc(doc(db, "usuarios", identificadorUsuario), {
      carrinho: carrinhoLocal,
      cupons: cuponsUsuarioLocal
    }, { merge: true });

    alert("🎉 Compra realizada com sucesso!");
    document.getElementById("modal-checkout")?.classList.add("hidden");
    window.location.href = "index02.html";

  } catch (erro) {
    console.error("Erro ao processar compra:", erro);
    alert("Erro ao processar o pedido. Tente novamente.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("select-all")?.addEventListener("change", (evento) => {
    const marcado = evento.target.checked;
    document.querySelectorAll(".chk-item").forEach(caixa => caixa.checked = marcado);
    atualizarResumo();
  });

  document.getElementById("btn-finalizar-compra")?.addEventListener("click", abrirModalCheckout);

  document.querySelectorAll('input[name="formaPagamento"]').forEach(opcao => {
    opcao.addEventListener('change', (evento) => {
      const areaCartoes = document.getElementById("area-cartoes");
      if (areaCartoes) {
        if (evento.target.value === "Cartao") areaCartoes.classList.remove("hidden");
        else areaCartoes.classList.add("hidden");
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
    
