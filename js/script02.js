import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const produtosMaisVendidosBase = [
  { id: 'fem_v1', nome: 'Vestido Vermelho', preco: 150, img: '../img/produtos/vestido_red.png', categoria: 'feminino' },
  { id: 'fem_c1', nome: 'Calça Alfaiataria', preco: 150, img: '../img/produtos/calca_cinza.png', categoria: 'feminino' },
  { id: 'fem_b1', nome: 'Blusa Seda', preco: 90, img: '../img/produtos/blusa_seda.png', categoria: 'feminino' },
  { id: 'fem_s1', nome: 'Shorts Jeans', preco: 110, img: '../img/produtos/shorts_jeans.png', categoria: 'feminino' },
  { id: 'masc_b1', nome: 'Blusa Moletom', preco: 160, img: '../img/produtos/masc_blusa_moletom.png', categoria: 'masculino' },
  { id: 'masc_c1', nome: 'Calça Jeans Masc', preco: 150, img: '../img/produtos/masc_calca_jeans.png', categoria: 'masculino' },
  { id: 'masc_s1', nome: 'Shorts Jeans Masc', preco: 110, img: '../img/produtos/masc_shorts_jeans.png', categoria: 'masculino' },
  { id: 'masc_t1', nome: 'Camiseta Básica', preco: 70, img: '../img/produtos/masc_camiseta_basica.png', categoria: 'masculino' },
  { id: 'sap_m1', nome: 'Bota Couro Masc', preco: 210, img: '../img/produtos/masc_bota1.png', categoria: 'calcados' },
  { id: 'sap_m2', nome: 'Sapato Social', preco: 190, img: '../img/produtos/masc_sapato1.png', categoria: 'calcados' },
  { id: 'sap_f1', nome: 'Bota Cano Curto', preco: 220, img: '../img/produtos/fem_bota1.png', categoria: 'calcados' },
  { id: 'sap_f2', nome: 'Sapato Salto Alto', preco: 180, img: '../img/produtos/fem_sapato1.png', categoria: 'calcados' },
  { id: 'sap_i1', nome: 'Bota Infantil', preco: 140, img: '../img/produtos/inf_bota1.png', categoria: 'calcados_infantil' },
  { id: 'sap_i4', nome: 'Tênis Velcro Inf', preco: 130, img: '../img/produtos/inf_tenis1.png', categoria: 'calcados_infantil' },
  { id: 'inf_b1', nome: 'Casaco Moletom Inf', preco: 95, img: '../img/produtos/inf_casaco_moletom.png', categoria: 'infantil' },
  { id: 'inf_c1', nome: 'Calça Jeans Inf', preco: 85, img: '../img/produtos/inf_calca_jeans.png', categoria: 'infantil' },
  { id: 'inf_s1', nome: 'Shorts Jeans Inf', preco: 65, img: '../img/produtos/inf_shorts_jeans.png', categoria: 'infantil' },
  { id: 'inf_t1', nome: 'Camiseta Estampada Inf', preco: 45, img: '../img/produtos/inf_camiseta_estampada.png', categoria: 'infantil' },
  { id: 'inf_v1', nome: 'Vestido Floral Inf', preco: 85, img: '../img/produtos/inf_vestido_floral.png', categoria: 'infantil' },
  { id: 'inf_b2', nome: 'Jaqueta Jeans Inf', preco: 120, img: '../img/produtos/inf_jaqueta_jeans.png', categoria: 'infantil' },
  { id: 'inf_v3', nome: 'Vestido Festa Inf', preco: 130, img: '../img/produtos/inf_vestido_festa.png', categoria: 'infantil' },
  { id: 'fem_v2', nome: 'Vestido Estampado', preco: 150, img: '../img/produtos/vestido_blue.png', categoria: 'feminino' },
  { id: 'fem_c3', nome: 'Calça Pantalona', preco: 170, img: '../img/produtos/pantalona.png', categoria: 'feminino' },
  { id: 'masc_b2', nome: 'Jaqueta Couro', preco: 220, img: '../img/produtos/masc_jaqueta_couro.png', categoria: 'masculino' },
  { id: 'masc_t3', nome: 'Camisa Polo Masc', preco: 110, img: '../img/produtos/masc_camisa_polo.png', categoria: 'masculino' },
  { id: 'sap_f3', nome: 'Sandália Rasteira', preco: 110, img: '../img/produtos/fem_sandalia1.png', categoria: 'calcados' },
  { id: 'sap_m4', nome: 'Sapatênis Casual', preco: 160, img: '../img/produtos/masc_sapatenis.png', categoria: 'calcados' },
  { id: 'inf_t3', nome: 'Camisa Polo Inf', preco: 65, img: '../img/produtos/inf_camisa_polo.png', categoria: 'infantil' }
];

let produtosExibidos = [...produtosMaisVendidosBase];
let uidUsuario = null;
let curtidasUsuario = [];
let carrinhoUsuario = [];

onAuthStateChanged(auth, async (user) => {
  if (user) {
    uidUsuario = user.uid;
    await carregarEstadoUsuario(uidUsuario);
  } else {
    await carregarProdutosFirebase();
  }
});

async function carregarProdutosFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    const produtosFirebase = [];

    querySnapshot.forEach((documento) => {
      produtosFirebase.push({
        id: documento.id,
        ...documento.data()
      });
    });

    produtosExibidos = [...produtosFirebase, ...produtosMaisVendidosBase];
    renderizarProdutos();
  } catch (error) {
    console.error("Erro ao carregar produtos do Firebase:", error);
    produtosExibidos = [...produtosMaisVendidosBase];
    renderizarProdutos();
  }
}

async function carregarEstadoUsuario(uid) {
  try {
    const userRef = doc(db, "usuarios", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      curtidasUsuario = data.curtidas || [];
      carrinhoUsuario = data.carrinho || [];
    }
    await carregarProdutosFirebase();
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    await carregarProdutosFirebase();
  }
}

function obterOpcoesTamanho(produto) {
  const pId = String(produto.id || '').toLowerCase();
  const cat = String(produto.categoria || '').toLowerCase();

  if (pId.startsWith('sap_i') || cat === 'calcados_infantil') {
    return ['22', '24', '26', '28', '30', '32', '34', '36'];
  } else if (pId.startsWith('sap_') || cat === 'calcados') {
    return ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
  } else if (pId.startsWith('inf_') || cat === 'infantil') {
    return ['2', '4', '6', '8', '10', '12', '14', '16'];
  } else {
    return ['P', 'M', 'G', 'GG'];
  }
}

function renderizarProdutos() {
  const grid = document.getElementById("main-product-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const idsCurtidas = curtidasUsuario.map(p => typeof p === 'object' ? p.id : p);
  const idsCarrinho = carrinhoUsuario.map(p => typeof p === 'object' ? p.id : p);

  produtosExibidos.forEach(produto => {
    const eCurtido = idsCurtidas.includes(produto.id);
    const noCarrinho = idsCarrinho.includes(produto.id);
    const estaEsgotado = produto.esgotado === true;

    const card = document.createElement("div");
    card.className = `product-card ${estaEsgotado ? 'produto-esgotado' : ''}`;
    card.setAttribute("data-id", produto.id);

    card.innerHTML = `
      <div class="img-container" style="cursor: ${estaEsgotado ? 'not-allowed' : 'pointer'}; position: relative;">
        <img src="${produto.img}" alt="${produto.nome}" style="${estaEsgotado ? 'filter: grayscale(80%); opacity: 0.6;' : ''}" />
        ${estaEsgotado ? '<span style="position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: bold;">Esgotado</span>' : ''}
      </div>
      <div class="card-content-bottom">
        <div class="product-info">
          <span class="p-title">${produto.nome}</span>
          <span class="p-price">R$ ${Number(produto.preco).toFixed(2)}</span>
        </div>
        <div class="card-actions">
          <button type="button" class="btn-fav ${eCurtido ? 'favoritado' : ''}" title="Favoritar">
            <i class="${eCurtido ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}" ${eCurtido ? 'style="color: #38a11e;"' : ''}></i>
          </button>
          <button type="button" class="btn-cart ${noCarrinho ? 'no-carrinho' : ''}" ${estaEsgotado ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} title="${estaEsgotado ? 'Produto Esgotado' : 'Carrinho'}">
            <i class="fa-solid ${noCarrinho ? 'fa-check' : 'fa-cart-shopping'}" ${noCarrinho ? 'style="color: #38a11e;"' : ''}></i>
          </button>
        </div>
      </div>
    `;

    const imgEl = card.querySelector(".img-container");
    imgEl.addEventListener("click", () => {
      if (estaEsgotado) {
        alert("Este produto está esgotado no momento.");
        return;
      }
      abrirModalSelecao(produto);
    });

    const btnFav = card.querySelector(".btn-fav");
    btnFav.addEventListener("click", (e) => {
      e.stopPropagation();
      alternarFavorito(produto, btnFav);
    });

    const btnCart = card.querySelector(".btn-cart");
    btnCart.addEventListener("click", (e) => {
      e.stopPropagation();
      if (estaEsgotado) return;
      abrirModalSelecao(produto);
    });

    grid.appendChild(card);
  });
}

function abrirModalSelecao(produto) {
  const modal = document.getElementById("modal-produto");
  if (!modal) return;

  const tamanhos = obterOpcoesTamanho(produto);
  let tamanhoSelecionado = tamanhos[0];
  let quantidade = 1;

  document.getElementById("modal-p-img").src = produto.img;
  document.getElementById("modal-p-nome").textContent = produto.nome;
  document.getElementById("modal-p-preco").textContent = `R$ ${Number(produto.preco).toFixed(2)}`;
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
    console.error("Erro ao sincronizar favoritos no banco:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const btnOpen = document.getElementById("btn-open-cat");
  const btnClose = document.getElementById("btn-close-cat");
  const modalCat = document.getElementById("modal-categorias");

  if (btnOpen && modalCat) {
    btnOpen.addEventListener("click", (e) => {
      e.preventDefault();
      modalCat.classList.remove("hidden");
    });
  }

  if (btnClose && modalCat) {
    btnClose.addEventListener("click", () => {
      modalCat.classList.add("hidden");
    });
  }

  if (modalCat) {
    modalCat.addEventListener("click", (e) => {
      if (e.target === modalCat) modalCat.classList.add("hidden");
    });
  }

  const cardTop = document.querySelector(".side-card:nth-child(1)");
  const cardBottom = document.querySelector(".side-card:nth-child(2)");
  const imgTop = document.getElementById("side-img-1");
  const imgBottom = document.getElementById("side-img-2");

  onSnapshot(doc(db, "configuracoes", "carrossel"), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.banners && data.banners.length >= 2) {
        if (imgTop && data.banners[0]) imgTop.src = data.banners[0];
        if (imgBottom && data.banners[1]) imgBottom.src = data.banners[1];
      }
    }
  });

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

        if (imgTop && !imgTop.src.startsWith('http')) imgTop.src = topBanners[currentIdx].img;
        if (imgBottom && !imgBottom.src.startsWith('http')) imgBottom.src = bottomBanners[currentIdx].img;

        if (imgTop) imgTop.classList.remove("fade-out");
        if (imgBottom) imgBottom.classList.remove("fade-out");
      }, 400);
    }, 3000);
  }
});