import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("masculino-grid");
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

  // CATÁLOGO MASCULINO COMPLETO (40 PRODUTOS: 10 BLUSAS, 10 CALÇAS, 10 SHORTS, 10 CAMISETAS)
  const todosProdutos = [
    // Blusas (10)
    { id: 'masc_b1', tipo: 'blusa', nome: 'Blusa Moletom', preco: '160', img: '../img/produtos/masc_blusa_moletom.png' },
    { id: 'masc_b2', tipo: 'blusa', nome: 'Jaqueta Couro', preco: '220', img: '../img/produtos/masc_jaqueta_couro.png' },
    { id: 'masc_b3', tipo: 'blusa', nome: 'Casaco Inverno', preco: '200', img: '../img/produtos/masc_casaco.png' },
    { id: 'masc_b4', tipo: 'blusa', nome: 'Jaqueta Jeans', preco: '180', img: '../img/produtos/masc_jaqueta_jeans.png' },
    { id: 'masc_b5', tipo: 'blusa', nome: 'Blusa Capuz', preco: '150', img: '../img/produtos/masc_blusa_capuz.png' },
    { id: 'masc_b6', tipo: 'blusa', nome: 'Suéter Tricô', preco: '140', img: '../img/produtos/masc_sueter.png' },
    { id: 'masc_b7', tipo: 'blusa', nome: 'Jaqueta Corta-Vento', preco: '170', img: '../img/produtos/masc_corta_vento.png' },
    { id: 'masc_b8', tipo: 'blusa', nome: 'Blusa Gola Alta', preco: '130', img: '../img/produtos/masc_gola_alta.png' },
    { id: 'masc_b9', tipo: 'blusa', nome: 'Jaqueta Bomber', preco: '190', img: '../img/produtos/masc_bomber.png' },
    { id: 'masc_b10', tipo: 'blusa', nome: 'Blusa Fleece', preco: '145', img: '../img/produtos/masc_fleece.png' },

    // Calças (10)
    { id: 'masc_c1', tipo: 'calca', nome: 'Calça Jeans', preco: '150', img: '../img/produtos/masc_calca_jeans.png' },
    { id: 'masc_c2', tipo: 'calca', nome: 'Calça Cargo', preco: '165', img: '../img/produtos/masc_calca_cargo.png' },
    { id: 'masc_c3', tipo: 'calca', nome: 'Calça Jogger', preco: '135', img: '../img/produtos/masc_calca_jogger.png' },
    { id: 'masc_c4', tipo: 'calca', nome: 'Calça Alfaiataria', preco: '180', img: '../img/produtos/masc_calca_alfaiataria.png' },
    { id: 'masc_c5', tipo: 'calca', nome: 'Calça Moletom', preco: '120', img: '../img/produtos/masc_calca_moletom.png' },
    { id: 'masc_c6', tipo: 'calca', nome: 'Calça Chino', preco: '155', img: '../img/produtos/masc_calca_chino.png' },
    { id: 'masc_c7', tipo: 'calca', nome: 'Calça Slim Fit', preco: '160', img: '../img/produtos/masc_calca_slim.png' },
    { id: 'masc_c8', tipo: 'calca', nome: 'Calça Skinny', preco: '140', img: '../img/produtos/masc_calca_skinny.png' },
    { id: 'masc_c9', tipo: 'calca', nome: 'Calça Esportiva', preco: '110', img: '../img/produtos/masc_calca_esportiva.png' },
    { id: 'masc_c10', tipo: 'calca', nome: 'Calça Sarja', preco: '145', img: '../img/produtos/masc_calca_sarja.png' },

    // Shorts (10)
    { id: 'masc_s1', tipo: 'shorts', nome: 'Shorts Jeans', preco: '110', img: '../img/produtos/masc_shorts_jeans.png' },
    { id: 'masc_s2', tipo: 'shorts', nome: 'Bermuda Cargo', preco: '125', img: '../img/produtos/masc_shorts_cargo.png' },
    { id: 'masc_s3', tipo: 'shorts', nome: 'Shorts Esportivo', preco: '85', img: '../img/produtos/masc_shorts_esportivo.png' },
    { id: 'masc_s4', tipo: 'shorts', nome: 'Bermuda Sarja', preco: '115', img: '../img/produtos/masc_shorts_sarja.png' },
    { id: 'masc_s5', tipo: 'shorts', nome: 'Shorts Moletom', preco: '90', img: '../img/produtos/masc_shorts_moletom.png' },
    { id: 'masc_s6', tipo: 'shorts', nome: 'Shorts Praia', preco: '95', img: '../img/produtos/masc_shorts_praia.png' },
    { id: 'masc_s7', tipo: 'shorts', nome: 'Bermuda Tactical', preco: '130', img: '../img/produtos/masc_shorts_tactical.png' },
    { id: 'masc_s8', tipo: 'shorts', nome: 'Shorts Treino', preco: '80', img: '../img/produtos/masc_shorts_treino.png' },
    { id: 'masc_s9', tipo: 'shorts', nome: 'Bermuda Linho', preco: '135', img: '../img/produtos/masc_shorts_linho.png' },
    { id: 'masc_s10', tipo: 'shorts', nome: 'Shorts Casual', preco: '100', img: '../img/produtos/masc_shorts_casual.png' },

    // Camisetas (10)
    { id: 'masc_t1', tipo: 'camiseta', nome: 'Camiseta Básica', preco: '70', img: '../img/produtos/masc_camiseta_basica.png' },
    { id: 'masc_t2', tipo: 'camiseta', nome: 'Camiseta Estampada', preco: '85', img: '../img/produtos/masc_camiseta_estampada.png' },
    { id: 'masc_t3', tipo: 'camiseta', nome: 'Camisa Polo', preco: '110', img: '../img/produtos/masc_camisa_polo.png' },
    { id: 'masc_t4', tipo: 'camiseta', nome: 'Camisa Manga Longa', preco: '120', img: '../img/produtos/masc_camisa_manga_longa.png' },
    { id: 'masc_t5', tipo: 'camiseta', nome: 'Camiseta Regata', preco: '60', img: '../img/produtos/masc_camiseta_regata.png' },
    { id: 'masc_t6', tipo: 'camiseta', nome: 'Camisa Linho', preco: '140', img: '../img/produtos/masc_camisa_linho.png' },
    { id: 'masc_t7', tipo: 'camiseta', nome: 'Camiseta Oversized', preco: '95', img: '../img/produtos/masc_camiseta_oversized.png' },
    { id: 'masc_t8', tipo: 'camiseta', nome: 'Camisa Jeans', preco: '130', img: '../img/produtos/masc_camisa_jeans.png' },
    { id: 'masc_t9', tipo: 'camiseta', nome: 'Camiseta Gola V', preco: '75', img: '../img/produtos/masc_camiseta_golav.png' },
    { id: 'masc_t10', tipo: 'camiseta', nome: 'Camisa Xadrez', preco: '125', img: '../img/produtos/masc_camisa_xadrez.png' }
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
      console.error("Erro ao carregar dados do Firebase:", error);
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
      console.error("Erro ao atualizar curtidas no Firestore:", error);
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
      console.error("Erro ao atualizar carrinho no Firestore:", error);
    }
  }

  // EVENTO DE FILTRAGEM (PÍLULAS)
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