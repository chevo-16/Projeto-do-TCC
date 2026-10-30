import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("sapatos-grid");
  const modalCategorias = document.getElementById("modal-categorias");
  const btnOpenCat = document.getElementById("btn-open-cat");
  const btnCloseCat = document.getElementById("btn-close-cat");

  // Controle do Modal de Categorias
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

  // CATÁLOGO COMPLETO DE CALÇADOS (30 PRODUTOS: 10 MASCULINOS, 10 FEMININOS, 10 INFANTIS)
  const todosProdutos = [
    // Masculino (10)
    { id: 'sap_m1', tipo: 'masculino', nome: 'Bota Couro', preco: '210', img: '../img/produtos/masc_bota1.png' },
    { id: 'sap_m2', tipo: 'masculino', nome: 'Sapato Social', preco: '190', img: '../img/produtos/masc_sapato1.png' },
    { id: 'sap_m3', tipo: 'masculino', nome: 'Sandália Couro', preco: '120', img: '../img/produtos/masc_sandalia1.png' },
    { id: 'sap_m4', tipo: 'masculino', nome: 'Sapatênis Casual', preco: '160', img: '../img/produtos/masc_sapatenis.png' },
    { id: 'sap_m5', tipo: 'masculino', nome: 'Bota Coturno', preco: '230', img: '../img/produtos/masc_bota2.png' },
    { id: 'sap_m6', tipo: 'masculino', nome: 'Mocassim', preco: '175', img: '../img/produtos/masc_mocassim.png' },
    { id: 'sap_m7', tipo: 'masculino', nome: 'Sandália Slide', preco: '95', img: '../img/produtos/masc_sandalia2.png' },
    { id: 'sap_m8', tipo: 'masculino', nome: 'Sapato Loafer', preco: '185', img: '../img/produtos/masc_loafer.png' },
    { id: 'sap_m9', tipo: 'masculino', nome: 'Bota Trekking', preco: '250', img: '../img/produtos/masc_bota3.png' },
    { id: 'sap_m10', tipo: 'masculino', nome: 'Chinelo Couro', preco: '85', img: '../img/produtos/masc_chinelo.png' },

    // Feminino (10)
    { id: 'sap_f1', tipo: 'feminino', nome: 'Bota Cano Curto', preco: '220', img: '../img/produtos/fem_bota1.png' },
    { id: 'sap_f2', tipo: 'feminino', nome: 'Sapato Salto Alto', preco: '180', img: '../img/produtos/fem_sapato1.png' },
    { id: 'sap_f3', tipo: 'feminino', nome: 'Sandália Rasteira', preco: '110', img: '../img/produtos/fem_sandalia1.png' },
    { id: 'sap_f4', tipo: 'feminino', nome: 'Scarpin Clássico', preco: '195', img: '../img/produtos/fem_scarpin.png' },
    { id: 'sap_f5', tipo: 'feminino', nome: 'Bota Over Knee', preco: '280', img: '../img/produtos/fem_bota2.png' },
    { id: 'sap_f6', tipo: 'feminino', nome: 'Sapatilha', preco: '125', img: '../img/produtos/fem_sapatilha.png' },
    { id: 'sap_f7', tipo: 'feminino', nome: 'Sandália Anabela', preco: '165', img: '../img/produtos/fem_sandalia2.png' },
    { id: 'sap_f8', tipo: 'feminino', nome: 'Mule Feminino', preco: '140', img: '../img/produtos/fem_mule.png' },
    { id: 'sap_f9', tipo: 'feminino', nome: 'Bota Coturno', preco: '210', img: '../img/produtos/fem_bota3.png' },
    { id: 'sap_f10', tipo: 'feminino', nome: 'Sandália Salto Bloco', preco: '170', img: '../img/produtos/fem_sandalia3.png' },

    // Infantil (10)
    { id: 'sap_i1', tipo: 'infantil', nome: 'Bota Infantil', preco: '140', img: '../img/produtos/inf_bota1.png' },
    { id: 'sap_i2', tipo: 'infantil', nome: 'Sapato Infantil', preco: '120', img: '../img/produtos/inf_sapato1.png' },
    { id: 'sap_i3', tipo: 'infantil', nome: 'Sandália Infantil', preco: '90', img: '../img/produtos/inf_sandalia1.png' },
    { id: 'sap_i4', tipo: 'infantil', nome: 'Tênis Velcro', preco: '130', img: '../img/produtos/inf_tenis1.png' },
    { id: 'sap_i5', tipo: 'infantil', nome: 'Botinha Lurex', preco: '150', img: '../img/produtos/inf_bota2.png' },
    { id: 'sap_i6', tipo: 'infantil', nome: 'Sapatilha Infantil', preco: '105', img: '../img/produtos/inf_sapatilha.png' },
    { id: 'sap_i7', tipo: 'infantil', nome: 'Sandália Papete', preco: '85', img: '../img/produtos/inf_sandalia2.png' },
    { id: 'sap_i8', tipo: 'infantil', nome: 'Sapato Social Inf', preco: '135', img: '../img/produtos/inf_sapato2.png' },
    { id: 'sap_i9', tipo: 'infantil', nome: 'Bota Galocha', preco: '115', img: '../img/produtos/inf_bota3.png' },
    { id: 'sap_i10', tipo: 'infantil', nome: 'Chinelo Infantil', preco: '65', img: '../img/produtos/inf_chinelo.png' }
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
        <div class="img-container">
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

      const btnFav = card.querySelector(".btn-fav");
      btnFav.addEventListener("click", () => alternarFavorito(produto, btnFav));

      const btnCart = card.querySelector(".btn-cart");
      btnCart.addEventListener("click", () => alternarCarrinho(produto, btnCart));

      grid.appendChild(card);
    });
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

  async function alternarCarrinho(produto, btnCart) {
    if (!uidUsuario) return;

    const icone = btnCart.querySelector("i");
    const jaNoCarrinho = btnCart.classList.contains("no-carrinho");

    if (jaNoCarrinho) {
      btnCart.classList.remove("no-carrinho");
      icone.className = "fa-solid fa-cart-shopping";
      icone.style.color = "";
      carrinhoUsuario = carrinhoUsuario.filter(p => (typeof p === 'object' ? p.id : p) !== produto.id);
    } else {
      btnCart.classList.add("no-carrinho");
      icone.className = "fa-solid fa-check";
      icone.style.color = "#38a11e";
      carrinhoUsuario.push({ ...produto, dataAdicionado: new Date().toISOString() });
    }

    try {
      const userRef = doc(db, "usuarios", uidUsuario);
      await setDoc(userRef, { carrinho: carrinhoUsuario }, { merge: true });
    } catch (error) {
      console.error("Erro ao atualizar carrinho:", error);
    }
  }

  // EVENTO DE FILTRAGEM (PÍLULAS: TODOS, MASCULINO, FEMININO, INFANTIL)
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