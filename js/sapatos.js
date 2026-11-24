import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("sapatos-grid") || document.getElementById("product-grid");
  const modalCategorias = document.getElementById("modal-categorias");
  const btnOpenCat = document.getElementById("btn-open-cat");
  const btnCloseCat = document.getElementById("btn-close-cat");

  if (btnOpenCat && modalCategorias) {
    btnOpenCat.addEventListener("click", () => {
      modalCategorias.classList.remove("hidden");
    });
  }

  if (btnCloseCat && modalCategorias) {
    btnCloseCat.addEventListener("click", () => {
      modalCategorias.classList.add("hidden");
    });
  }

  const todosProdutos = [

    { id: 'sap_m1', tipo: 'masculino', nome: 'Bota ', preco: '210', img: '../images/calçados/masculino/0b199006-713f-4b58-a87c-1b1d1850d1d0.png', categoria: 'calcados' },
    { id: 'sap_m2', tipo: 'masculino', nome: 'Sapato ', preco: '190', img: '../images/calçados/masculino/9bd99f3e-9a69-423c-aad5-b27f43e21404.png', categoria: 'calcados' },
    { id: 'sap_m3', tipo: 'masculino', nome: 'Sandália ', preco: '120', img: '../images/calçados/masculino/86b76daf-22bb-4cdb-9ed4-42fa06c43e76.png', categoria: 'calcados' },
    { id: 'sap_m4', tipo: 'masculino', nome: 'Sapatênis ', preco: '160', img: '../images/calçados/masculino/2706a8a0-062b-416b-b4fc-77b426568dfc.png', categoria: 'calcados' },
    { id: 'sap_m5', tipo: 'masculino', nome: 'Bota ', preco: '230', img: '../images/calçados/masculino/b1f60fc9-bf54-45b6-9d09-be7db792cc35.png', categoria: 'calcados' },
    { id: 'sap_m6', tipo: 'masculino', nome: 'Mocassim', preco: '175', img: '../images/calçados/masculino/ab57e186-4077-4b5c-a994-e317513e4e3d.png', categoria: 'calcados' },
    { id: 'sap_m7', tipo: 'masculino', nome: 'Sandália ', preco: '95', img: '../images/calçados/masculino/bfb3ee86-4fd5-4448-a5fb-70f7572be08c.png', categoria: 'calcados' },
    { id: 'sap_m8', tipo: 'masculino', nome: 'Sapato ', preco: '185', img: '../images/calçados/masculino/c8eb80b0-ff51-4c89-9299-c2fcad3356c2.png', categoria: 'calcados' },
    { id: 'sap_m9', tipo: 'masculino', nome: 'Bota ', preco: '250', img: '../images/calçados/masculino/edb4d680-8b9a-4aa8-aaeb-accf207711a2.png', categoria: 'calcados' },
    { id: 'sap_m10', tipo: 'masculino', nome: 'Chinelo ', preco: '85', img: '../images/calçados/masculino/f0f298dc-b2ac-48b0-883f-1d766b3086d2.png', categoria: 'calcados' },

    { id: 'sap_f1', tipo: 'feminino', nome: 'Bota ', preco: '220', img: '/images/calçados/feminino/6cd0ffa8-7f59-4fed-8a59-f0a3501421d7.png', categoria: 'calcados' },
    { id: 'sap_f2', tipo: 'feminino', nome: 'Sapato ', preco: '180', img: '../images/calçados/feminino/9fbd0299-5580-4d3f-8a9b-838e7002539b.png', categoria: 'calcados' },
    { id: 'sap_f3', tipo: 'feminino', nome: 'Sandália ', preco: '110', img: '../images/calçados/feminino/18a26908-fcb9-4d96-bc99-29db3436e7bd.png', categoria: 'calcados' },
    { id: 'sap_f4', tipo: 'feminino', nome: 'Scarpin ', preco: '195', img: '../images/calçados/feminino/46f861c0-c54e-49be-9b69-06812229c534.png', categoria: 'calcados' },
    { id: 'sap_f5', tipo: 'feminino', nome: 'Bota ', preco: '280', img: '../images/calçados/feminino/4932ef04-9411-49e5-ab75-0a08cea598c9.png', categoria: 'calcados' },
    { id: 'sap_f6', tipo: 'feminino', nome: '', preco: '125', img: '../images/calçados/feminino/8753b7b0-d814-466a-97b6-f9df304d17c6.png', categoria: 'calcados' },
    { id: 'sap_f7', tipo: 'feminino', nome: 'Sandália ', preco: '165', img: '../images/calçados/feminino/d62b8498-7e34-4a8f-bfaf-112823398f87.png', categoria: 'calcados' },
    { id: 'sap_f8', tipo: 'feminino', nome: 'Mule ', preco: '140', img: '../images/calçados/feminino/d7509bf2-9513-4303-8498-b58e01898722.png', categoria: 'calcados' },
    { id: 'sap_f9', tipo: 'feminino', nome: 'Bota ', preco: '210', img: '../images/calçados/feminino/e2e84f30-f6da-4a45-a75d-df93dc82ef87.png', categoria: 'calcados' },
    { id: 'sap_f10', tipo: 'feminino', nome: 'Sandália ', preco: '170', img: '../images/calçados/feminino/f473df8c-a89b-4bac-a2d8-f60bd9e50c3f.png', categoria: 'calcados' },

    { id: 'sap_i1', tipo: 'infantil', nome: 'Bota ', preco: '140', img: '../images/calçados/infantil/1c088951-cd1b-4f95-b576-51870753b1aa.png', categoria: 'calcados_infantil' },
    { id: 'sap_i2', tipo: 'infantil', nome: 'Sapato ', preco: '120', img: '../images/calçados/infantil/4f7f298d-a973-449f-b637-c1dc54c73216.png', categoria: 'calcados_infantil' },
    { id: 'sap_i3', tipo: 'infantil', nome: 'Sandália ', preco: '90', img: '../images/calçados/infantil/706ca687-3392-473c-b76f-d4d1c5e12b44.png', categoria: 'calcados_infantil' },
    { id: 'sap_i4', tipo: 'infantil', nome: 'Tênis ', preco: '130', img: '../images/calçados/infantil/908e8f62-4d1f-4dfd-b502-4a12005c4aef.png', categoria: 'calcados_infantil' },
    { id: 'sap_i5', tipo: 'infantil', nome: 'Botinha ', preco: '150', img: '../images/calçados/infantil/5641cbd5-9ab6-486b-9f0e-69606eebeea2.png', categoria: 'calcados_infantil' },
    { id: 'sap_i6', tipo: 'infantil', nome: 'Sapatilha ', preco: '105', img: '../images/calçados/infantil/7054fa50-ea1e-4438-9b96-c00ec0af27cd.png', categoria: 'calcados_infantil' },
    { id: 'sap_i7', tipo: 'infantil', nome: 'Sandália ', preco: '85', img: '../images/calçados/infantil/b7b9836d-d4bc-43b5-b0eb-c41d0a8dcb69.png', categoria: 'calcados_infantil' },
    { id: 'sap_i8', tipo: 'infantil', nome: 'Sapato ', preco: '135', img: '../images/calçados/infantil/ba5435c0-e8a9-4190-91c4-7b221e1e1f75.png', categoria: 'calcados_infantil' },
    { id: 'sap_i9', tipo: 'infantil', nome: 'Bota ', preco: '115', img: '../images/calçados/infantil/c07a8c53-05d1-4d76-8dec-3d595639f38a.png', categoria: 'calcados_infantil' },
    { id: 'sap_i10', tipo: 'infantil', nome: 'Chinelo ', preco: '65', img: '../images/calçados/infantil/f7f0a9fe-0507-4092-9e31-433fb11ea14e.png', categoria: 'calcados_infantil' }
  ];

  let filtroAtual = 'todos';
  let uidUsuario = null;
  let curtidasUsuario = [];
  let carrinhoUsuario = [];

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      uidUsuario = user.uid;
      await carregarDadosUsuario(uidUsuario);
    } else {
      renderizarProdutos();
    }
  });

  async function carregarDadosUsuario(uid) {
    try {
      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        curtidasUsuario = data.curtidas || [];
        carrinhoUsuario = data.carrinho || [];
      }
      renderizarProdutos();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      renderizarProdutos();
    }
  }

  function renderizarProdutos() {
    if (!grid) return;
    grid.innerHTML = "";

    let produtosExibir = todosProdutos;
    if (filtroAtual !== 'todos') {
      produtosExibir = todosProdutos.filter(p => p.tipo === filtroAtual);
    }

    const idsCurtidas = curtidasUsuario.map(p => typeof p === 'object' ? p.id : p);
    const idsCarrinho = carrinhoUsuario.map(p => typeof p === 'object' ? p.id : p);

    produtosExibir.forEach(produto => {
      const eCurtido = idsCurtidas.includes(produto.id);
      const noCarrinho = idsCarrinho.includes(produto.id);

      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-id", produto.id);

      card.innerHTML = `
        <div class="img-container" style="cursor: pointer;">
          <img src="${produto.img}" alt="${produto.nome}" />
        </div>
        <div class="card-content-bottom">
          <div class="product-info">
            <span class="p-title">${produto.nome}</span>
            <span class="p-price">R$${produto.preco}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn-fav ${eCurtido ? 'favoritado' : ''}" title="Favoritar">
              <i class="${eCurtido ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}" ${eCurtido ? 'style="color: #38a11e;"' : ''}></i>
            </button>
            <button type="button" class="btn-cart ${noCarrinho ? 'no-carrinho' : ''}" title="Carrinho">
              <i class="fa-solid ${noCarrinho ? 'fa-check' : 'fa-cart-shopping'}" ${noCarrinho ? 'style="color: #38a11e;"' : ''}></i>
            </button>
          </div>
        </div>
      `;

      const imgEl = card.querySelector(".img-container");
      imgEl.addEventListener("click", () => abrirModalSelecao(produto));

      const btnFav = card.querySelector(".btn-fav");
      btnFav.addEventListener("click", (e) => {
        e.stopPropagation();
        alternarFavorito(produto, btnFav);
      });

      const btnCart = card.querySelector(".btn-cart");
      btnCart.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModalSelecao(produto);
      });

      grid.appendChild(card);
    });
  }

  function abrirModalSelecao(produto) {
    const modal = document.getElementById("modal-produto");
    if (!modal) return;

    const eInfantil = produto.tipo === 'infantil' || produto.id.startsWith('sap_i');
    const tamanhos = eInfantil 
      ? ['22', '24', '26', '28', '30', '32', '34', '36']
      : ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

    let tamanhoSelecionado = tamanhos[0];
    let quantidade = 1;

    document.getElementById("modal-p-img").src = produto.img;
    document.getElementById("modal-p-nome").textContent = produto.nome;
    document.getElementById("modal-p-preco").textContent = `R$${produto.preco}`;
    document.getElementById("modal-p-qtd").textContent = quantidade;

    const gridTamanhos = document.getElementById("modal-p-tamanhos");
    gridTamanhos.innerHTML = "";

    tamanhos.forEach(tam => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `btn-tamanho ${tam === tamanhoSelecionado ? 'active' : ''}`;
      btn.textContent = tam;
      btn.onclick = () => {
        document.querySelectorAll(".btn-tamanho").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        tamanhoSelecionado = tam;
      };
      gridTamanhos.appendChild(btn);
    });

    document.getElementById("btn-qtd-menos").onclick = () => {
      if (quantidade > 1) {
        quantidade--;
        document.getElementById("modal-p-qtd").textContent = quantidade;
      }
    };

    document.getElementById("btn-qtd-mais").onclick = () => {
      quantidade++;
      document.getElementById("modal-p-qtd").textContent = quantidade;
    };

    document.getElementById("btn-confirmar-carrinho").onclick = async () => {
      if (!uidUsuario) {
        alert("Por favor, faça login para adicionar ao carrinho.");
        return;
      }

      const itemCarrinho = {
        ...produto,
        tamanho: tamanhoSelecionado,
        quantidade: quantidade,
        dataAdicionado: new Date().toISOString()
      };

      carrinhoUsuario = carrinhoUsuario.filter(item => (typeof item === 'object' ? item.id : item) !== produto.id);
      carrinhoUsuario.push(itemCarrinho);

      try {
        const userRef = doc(db, "usuarios", uidUsuario);
        await setDoc(userRef, { carrinho: carrinhoUsuario }, { merge: true });
        renderizarProdutos();
        modal.classList.add("hidden");
      } catch (error) {
        console.error("Erro ao adicionar produto ao carrinho:", error);
      }
    };

    const btnCloseModal = document.getElementById("btn-close-produto");
    if (btnCloseModal) {
      btnCloseModal.onclick = () => modal.classList.add("hidden");
    }

    modal.classList.remove("hidden");
  }

  async function alternarFavorito(produto, btnFav) {
    if (!uidUsuario) return;

    const icone = btnFav.querySelector("i");
    const eCurtido = btnFav.classList.contains("favoritado");

    if (eCurtido) {
      btnFav.classList.remove("favoritado");
      icone.className = "fa-regular fa-heart";
      icone.style.color = "";
      curtidasUsuario = curtidasUsuario.filter(p => (typeof p === 'object' ? p.id : p) !== produto.id);
    } else {
      btnFav.classList.add("favoritado");
      icone.className = "fa-solid fa-heart";
      icone.style.color = "#38a11e";
      curtidasUsuario.push(produto);
    }

    try {
      const userRef = doc(db, "usuarios", uidUsuario);
      await setDoc(userRef, { curtidas: curtidasUsuario }, { merge: true });
    } catch (error) {
      console.error("Erro ao atualizar curtidas:", error);
    }
  }

  const botoesFiltro = document.querySelectorAll(".filter-pills .pill");
  botoesFiltro.forEach(btn => {
    btn.addEventListener("click", (e) => {
      botoesFiltro.forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");

      filtroAtual = e.currentTarget.getAttribute("data-filter") || "todos";
      renderizarProdutos();
    });
  });
});