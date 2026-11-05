import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { eAdmin } from './admin-config.js';

const storage = getStorage();

onAuthStateChanged(auth, (user) => {
  if (user && eAdmin(user.email)) {
    carregarProdutosAdmin();
    carregarPedidosAdmin();
  } else {
    alert("Acesso restrito para administradores.");
    window.location.href = "index01.html";
  }
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`aba-${btn.dataset.tab}`).classList.add('active');
  });
});

async function fazerUploadImagem(file, caminhoPasta) {
  const nomeUnico = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${caminhoPasta}/${nomeUnico}`);
  const uploadTask = await uploadBytes(storageRef, file);
  return await getDownloadURL(uploadTask.ref);
}

function carregarPedidosAdmin() {
  const container = document.getElementById('lista-pedidos-admin');

  onSnapshot(collection(db, "pedidos"), (snapshot) => {
    if (snapshot.empty) {
      container.innerHTML = `<p style="text-align:center; color:#777; font-size:0.8rem;">Nenhum pedido recebido ainda.</p>`;
      return;
    }

    container.innerHTML = '';
    let temPedidoPendente = false;

    snapshot.forEach((documento) => {
      const pedido = documento.data();
      const id = documento.id;

      if (pedido.concluido === true || pedido.status === "Entregue") return;

      temPedidoPendente = true;

      const card = document.createElement('div');
      card.className = 'card-pedido-admin';

      let itensHTML = '';
      if (pedido.itens && Array.isArray(pedido.itens)) {
        pedido.itens.forEach(item => {
          itensHTML += `
            <div class="item-pedido-linha">
              <img src="${item.img}" alt="${item.nome}">
              <div class="detalhe-item">
                <strong>${item.nome}</strong>
                <span>Tam: ${item.tamanho || 'N/A'} | Qtd: ${item.quantidade || item.qtd || 1}</span>
                <span>R$ ${Number(item.preco).toFixed(2)}</span>
              </div>
            </div>
          `;
        });
      }

      card.innerHTML = `
        <div class="pedido-header">
          <strong>Cliente: ${pedido.nomeCliente || pedido.userEmail || 'Cliente'}</strong>
          <span class="status-badge status-${(pedido.status || 'Pendente').toLowerCase()}">${pedido.status || 'Pendente'}</span>
        </div>
        
        <div class="pedido-info-extra" style="margin: 8px 0; font-size: 0.85rem; color: #555;">
          <div><strong>Endereço:</strong> ${pedido.endereco || 'Não informado'}</div>
          <div><strong>Pagamento:</strong> ${pedido.formaPagamento || 'Pix'}</div>
          <div><strong>Previsão:</strong> ${pedido.previsaoEntrega || '5 dias'}</div>
        </div>

        <div class="pedido-itens">
          ${itensHTML}
        </div>
        
        <div class="pedido-total">
          <strong>Total: R$ ${Number(pedido.total || 0).toFixed(2)}</strong>
        </div>

        <div class="pedido-acoes">
          <div class="input-group">
            <label>Status do Pedido:</label>
            <select onchange="atualizarStatusPedido('${id}', this.value)">
              <option value="Pendente" ${pedido.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
              <option value="Preparando" ${pedido.status === 'Preparando' ? 'selected' : ''}>Preparando</option>
              <option value="Enviado" ${pedido.status === 'Enviado' ? 'selected' : ''}>Enviado / Saiu p/ Entrega</option>
              <option value="Entregue" ${pedido.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
            </select>
          </div>

          <div class="input-group">
            <label>Entregador:</label>
            <input type="text" placeholder="Nome do entregador" value="${pedido.entregador || ''}" onblur="atualizarEntregador('${id}', this.value)" />
          </div>

          <button type="button" class="btn-salvar-admin" style="background-color: #27ae60; margin-top: 10px;" onclick="concluirPedido('${id}')">
            <i class="fa-solid fa-circle-check"></i> Confirmar Entrega e Finalizar
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    if (!temPedidoPendente) {
      container.innerHTML = `<p style="text-align:center; color:#777; font-size:0.8rem;">Nenhum pedido pendente no momento.</p>`;
    }
  });
}

window.atualizarStatusPedido = async (id, novoStatus) => {
  try {
    await updateDoc(doc(db, "pedidos", id), { status: novoStatus });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
  }
};

window.atualizarEntregador = async (id, nomeEntregador) => {
  try {
    await updateDoc(doc(db, "pedidos", id), { entregador: nomeEntregador });
  } catch (error) {
    console.error("Erro ao atualizar entregador:", error);
  }
};

window.concluirPedido = async (id) => {
  if (confirm("Deseja confirmar a entrega e arquivar este pedido?")) {
    try {
      await updateDoc(doc(db, "pedidos", id), { 
        status: "Entregue",
        concluido: true,
        dataConclusao: serverTimestamp()
      });
      alert("Pedido concluído com sucesso!");
    } catch (error) {
      console.error("Erro ao concluir pedido:", error);
    }
  }
};

const formProduto = document.getElementById('form-add-produto');
formProduto?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById('prod-img-file');
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, escolha uma imagem para o produto.");
    return;
  }

  const btnSubmit = formProduto.querySelector('button[type="submit"]');
  btnSubmit.disabled = true;

  try {
    const urlImagem = await fazerUploadImagem(file, "produtos");

    const novoProduto = {
      nome: document.getElementById('prod-nome').value.trim(),
      preco: parseFloat(document.getElementById('prod-preco').value),
      categoria: document.getElementById('prod-categoria').value,
      tipo: document.getElementById('prod-tipo').value.trim(),
      img: urlImagem,
      esgotado: false,
      criadoEm: serverTimestamp()
    };

    await addDoc(collection(db, "produtos"), novoProduto);
    alert("Produto postado com sucesso!");
    formProduto.reset();
    carregarProdutosAdmin();
  } catch (error) {
    console.error("Erro ao postar produto:", error);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Postar Produto";
  }
});

async function carregarProdutosAdmin() {
  const container = document.getElementById('lista-produtos-admin');
  try {
    const snapshot = await getDocs(collection(db, "produtos"));
    if (snapshot.empty) {
      container.innerHTML = `<p style="text-align:center; color:#777; font-size:0.8rem;">Nenhum produto postado ainda.</p>`;
      return;
    }

    container.innerHTML = '';
    snapshot.forEach((documento) => {
      const p = documento.data();
      const id = documento.id;

      const item = document.createElement('div');
      item.className = 'item-admin-prod';
      item.innerHTML = `
        <img src="${p.img}" alt="${p.nome}">
        <div class="item-admin-info">
          <strong>${p.nome} ${p.esgotado ? '<span class="tag-esgotado">(Esgotado)</span>' : ''}</strong>
          <span>R$ ${Number(p.preco).toFixed(2)} | ${p.categoria}</span>
        </div>
        <div class="item-admin-acoes">
          <button type="button" class="btn-status-prod" onclick="alternarEsgotado('${id}', ${!p.esgotado})">
            ${p.esgotado ? 'Disponibilizar' : 'Esgotar'}
          </button>
          <button type="button" class="btn-deletar-prod" onclick="excluirProduto('${id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
}

window.alternarEsgotado = async (id, statusEsgotado) => {
  try {
    await updateDoc(doc(db, "produtos", id), { esgotado: statusEsgotado });
    carregarProdutosAdmin();
  } catch (error) {
    console.error("Erro ao alterar status:", error);
  }
};

window.excluirProduto = async (id) => {
  if (confirm("Tem certeza que deseja apagar este produto da loja?")) {
    try {
      await deleteDoc(doc(db, "produtos", id));
      carregarProdutosAdmin();
    } catch (error) {
      console.error("Erro ao apagar produto:", error);
    }
  }
};

document.getElementById('form-banners')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file1 = document.getElementById('banner-file-1').files[0];
  const file2 = document.getElementById('banner-file-2').files[0];
  const file3 = document.getElementById('banner-file-3').files[0];
  const file4 = document.getElementById('banner-file-4').files[0];

  if (!file1 || !file2 || !file3 || !file4) {
    return alert("Por favor, selecione as 4 fotos para os banners do carrossel!");
  }

  const btnSubmit = e.target.querySelector('button[type="submit"]');
  btnSubmit.disabled = true;

  try {
    const url1 = await fazerUploadImagem(file1, "banners");
    const url2 = await fazerUploadImagem(file2, "banners");
    const url3 = await fazerUploadImagem(file3, "banners");
    const url4 = await fazerUploadImagem(file4, "banners");

    await setDoc(doc(db, "configuracoes", "carrossel"), { 
      banners: [url1, url2, url3, url4] 
    });

    alert("Os 4 banners do topo foram atualizados com sucesso!");
    e.target.reset();
  } catch (error) {
    console.error("Erro ao salvar banners:", error);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Atualizar os 4 Banners";
  }
});

document.getElementById('form-colecao')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const estacaoSelecionada = document.getElementById('nome-colecao').value;
  const file = document.getElementById('img-colecao-file').files[0];

  if (!file) return alert("Por favor, selecione uma foto para a coleção!");

  const btnSubmit = e.target.querySelector('button[type="submit"]');
  btnSubmit.disabled = true;

  try {
    const url = await fazerUploadImagem(file, "colecoes");

    await setDoc(doc(db, "configuracoes", "colecao"), { 
      nome: estacaoSelecionada, 
      img: url 
    });

    alert(`${estacaoSelecionada} atualizada com sucesso!`);
    e.target.reset();
  } catch (error) {
    console.error("Erro ao atualizar coleção:", error);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Atualizar Coleção";
  }
});

document.getElementById('btn-sair-admin')?.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = "index01.html";
});