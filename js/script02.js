import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ARRAY COM OS 28 PRODUTOS (4 LINHAS DE 7 - UTILIZANDO OS IDS E ROTAS PADRONIZADAS)
const produtosMaisVendidos = [
  // --- LINHA 1 (FEMININO & MASCULINO) ---
  { id: 'fem_v1', nome: 'Vestido Vermelho', preco: '150', img: '../img/produtos/vestido_red.png' },
  { id: 'fem_c1', nome: 'Calça Alfaiataria', preco: '150', img: '../img/produtos/calca_cinza.png' },
  { id: 'fem_b1', nome: 'Blusa Seda', preco: '90', img: '../img/produtos/blusa_seda.png' },
  { id: 'fem_s1', nome: 'Shorts Jeans', preco: '110', img: '../img/produtos/shorts_jeans.png' },
  { id: 'masc_b1', nome: 'Blusa Moletom', preco: '160', img: '../img/produtos/masc_blusa_moletom.png' },
  { id: 'masc_c1', nome: 'Calça Jeans Masc', preco: '150', img: '../img/produtos/masc_calca_jeans.png' },
  { id: 'masc_s1', nome: 'Shorts Jeans Masc', preco: '110', img: '../img/produtos/masc_shorts_jeans.png' },

  // --- LINHA 2 (MASCULINO & CALÇADOS) ---
  { id: 'masc_t1', nome: 'Camiseta Básica', preco: '70', img: '../img/produtos/masc_camiseta_basica.png' },
  { id: 'sap_m1', nome: 'Bota Couro Masc', preco: '210', img: '../img/produtos/masc_bota1.png' },
  { id: 'sap_m2', nome: 'Sapato Social', preco: '190', img: '../img/produtos/masc_sapato1.png' },
  { id: 'sap_f1', nome: 'Bota Cano Curto', preco: '220', img: '../img/produtos/fem_bota1.png' },
  { id: 'sap_f2', nome: 'Sapato Salto Alto', preco: '180', img: '../img/produtos/fem_sapato1.png' },
  { id: 'sap_i1', nome: 'Bota Infantil', preco: '140', img: '../img/produtos/inf_bota1.png' },
  { id: 'sap_i4', nome: 'Tênis Velcro Inf', preco: '130', img: '../img/produtos/inf_tenis1.png' },

  // --- LINHA 3 (INFANTIL) ---
  { id: 'inf_b1', nome: 'Casaco Moletom Inf', preco: '95', img: '../img/produtos/inf_casaco_moletom.png' },
  { id: 'inf_c1', nome: 'Calça Jeans Inf', preco: '85', img: '../img/produtos/inf_calca_jeans.png' },
  { id: 'inf_s1', nome: 'Shorts Jeans Inf', preco: '65', img: '../img/produtos/inf_shorts_jeans.png' },
  { id: 'inf_t1', nome: 'Camiseta Estampada Inf', preco: '45', img: '../img/produtos/inf_camiseta_estampada.png' },
  { id: 'inf_v1', nome: 'Vestido Floral Inf', preco: '85', img: '../img/produtos/inf_vestido_floral.png' },
  { id: 'inf_b2', nome: 'Jaqueta Jeans Inf', preco: '120', img: '../img/produtos/inf_jaqueta_jeans.png' },
  { id: 'inf_v3', nome: 'Vestido Festa Inf', preco: '130', img: '../img/produtos/inf_vestido_festa.png' },

  // --- LINHA 4 (MIX DE CATEGORIAS) ---
  { id: 'fem_v2', nome: 'Vestido Estampado', preco: '150', img: '../img/produtos/vestido_blue.png' },
  { id: 'fem_c3', nome: 'Calça Pantalona', preco: '170', img: '../img/produtos/pantalona.png' },
  { id: 'masc_b2', nome: 'Jaqueta Couro', preco: '220', img: '../img/produtos/masc_jaqueta_couro.png' },
  { id: 'masc_t3', nome: 'Camisa Polo Masc', preco: '110', img: '../img/produtos/masc_camisa_polo.png' },
  { id: 'sap_f3', nome: 'Sandália Rasteira', preco: '110', img: '../img/produtos/fem_sandalia1.png' },
  { id: 'sap_m4', nome: 'Sapatênis Casual', preco: '160', img: '../img/produtos/masc_sapatenis.png' },
  { id: 'inf_t3', nome: 'Camisa Polo Inf', preco: '65', img: '../img/produtos/inf_camisa_polo.png' }
];

let uidUsuario = null;
let curtidasUsuario = [];
let carrinhoUsuario = [];

onAuthStateChanged(auth, async (user) => {
  if (user) {
    uidUsuario = user.uid;
    await carregarEstadoUsuario(uidUsuario);
  } else {
    renderizarProdutos();
  }
});

async function carregarEstadoUsuario(uid) {
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
    console.error("Erro ao carregar dados do usuário:", error);
    renderizarProdutos();
  }
}

function renderizarProdutos() {
  const grid = document.getElementById("main-product-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const idsCurtidas = curtidasUsuario.map(p => typeof p === 'object' ? p.id : p);
  const idsCarrinho = carrinhoUsuario.map(p => typeof p === 'object' ? p.id : p);

  produtosMaisVendidos.forEach(produto => {
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
    console.error("Erro ao sincronizar favoritos no banco:", error);
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
    console.error("Erro ao atualizar carrinho no banco:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // LÓGICA DO MODAL DE CATEGORIAS
  const btnOpen = document.getElementById("btn-open-cat");
  const btnClose = document.getElementById("btn-close-cat");
  const modal = document.getElementById("modal-categorias");

  if (btnOpen && modal) {
    btnOpen.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.remove("hidden");
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }

  // LÓGICA DOS BANNERS LATERAIS ROTATIVOS
  const cardTop = document.querySelector(".side-card:nth-child(1)");
  const cardBottom = document.querySelector(".side-card:nth-child(2)");

  const imgTop = document.getElementById("side-img-1");
  const imgBottom = document.getElementById("side-img-2");

  const topBanners = [
    { img: "../images/vestido.png", bg: "linear-gradient(90deg, #369374 0%, #FC78E1 100%)" },
    { img: "../images/blusa2.png", bg: "linear-gradient(90deg, #369374 0%, #0866FF 100%)" }
  ];

  const bottomBanners = [
    { img: "../images/tenis2.png", bg: "linear-gradient(90deg, #369374 0%, #4ade80 100%)" },
    { img: "../images/infantil2.png", bg: "linear-gradient(90deg, #369374 0%, #FC78E1 50%, #38bdf8 100%)" }
  ];

  let currentIdx = 0;

  if (cardTop && cardBottom) {
    setInterval(() => {
      if (imgTop) imgTop.classList.add("fade-out");
      if (imgBottom) imgBottom.classList.add("fade-out");

      setTimeout(() => {
        currentIdx = (currentIdx + 1) % topBanners.length;

        cardTop.style.background = topBanners[currentIdx].bg;
        cardBottom.style.background = bottomBanners[currentIdx].bg;

        if (imgTop) imgTop.src = topBanners[currentIdx].img;
        if (imgBottom) imgBottom.src = bottomBanners[currentIdx].img;

        if (imgTop) imgTop.classList.remove("fade-out");
        if (imgBottom) imgBottom.classList.remove("fade-out");
      }, 400);
    }, 3000);
  }
});