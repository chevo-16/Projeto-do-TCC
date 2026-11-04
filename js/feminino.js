import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("feminino-grid") || document.getElementById("product-grid");
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
  
    { id: 'fem_v1', tipo: 'vestido', nome: 'Vestido Vermelho', preco: '150', img: '../img/produtos/vestido_red.png', categoria: 'feminino' },
    { id: 'fem_v2', tipo: 'vestido', nome: 'Vestido Estampado', preco: '150', img: '../img/produtos/vestido_blue.png', categoria: 'feminino' },
    { id: 'fem_v3', tipo: 'vestido', nome: 'Vestido Mid', preco: '160', img: '../img/produtos/vestido_mid.png', categoria: 'feminino' },
    { id: 'fem_v4', tipo: 'vestido', nome: 'Vestido Curto', preco: '135', img: '../img/produtos/vestido_curto.png', categoria: 'feminino' },
    { id: 'fem_v5', tipo: 'vestido', nome: 'Vestido Longo', preco: '180', img: '../img/produtos/vestido_longo.png', categoria: 'feminino' },
    { id: 'fem_v6', tipo: 'vestido', nome: 'Vestido Festa', preco: '210', img: '../img/produtos/vestido_festa.png', categoria: 'feminino' },
    { id: 'fem_v7', tipo: 'vestido', nome: 'Vestido Regata', preco: '115', img: '../img/produtos/vestido_regata.png', categoria: 'feminino' },
    { id: 'fem_v8', tipo: 'vestido', nome: 'Vestido Tubinho', preco: '140', img: '../img/produtos/vestido_tubinho.png', categoria: 'feminino' },
    { id: 'fem_v9', tipo: 'vestido', nome: 'Vestido Floral', preco: '145', img: '../img/produtos/vestido_floral.png', categoria: 'feminino' },
    { id: 'fem_v10', tipo: 'vestido', nome: 'Vestido Elegante', preco: '190', img: '../img/produtos/vestido_elegante.png', categoria: 'feminino' },

    { id: 'fem_c1', tipo: 'calca', nome: 'Calça Alfaiataria', preco: '150', img: '../img/produtos/calca_cinza.png', categoria: 'feminino' },
    { id: 'fem_c2', tipo: 'calca', nome: 'Calça Jeans Wide', preco: '140', img: '../img/produtos/calca_jeans.png', categoria: 'feminino' },
    { id: 'fem_c3', tipo: 'calca', nome: 'Calça Pantalona', preco: '170', img: '../img/produtos/pantalona.png', categoria: 'feminino' },
    { id: 'fem_c4', tipo: 'calca', nome: 'Calça Jogger', preco: '125', img: '../img/produtos/jogger.png', categoria: 'feminino' },
    { id: 'fem_c5', tipo: 'calca', nome: 'Calça Legging', preco: '90', img: '../img/produtos/calca_legging.png', categoria: 'feminino' },
    { id: 'fem_c6', tipo: 'calca', nome: 'Calça Cargo', preco: '160', img: '../img/produtos/calca_cargo.png', categoria: 'feminino' },
    { id: 'fem_c7', tipo: 'calca', nome: 'Calça Flare', preco: '155', img: '../img/produtos/calca_flare.png', categoria: 'feminino' },
    { id: 'fem_c8', tipo: 'calca', nome: 'Calça Slouchy', preco: '145', img: '../img/produtos/calca_slouchy.png', categoria: 'feminino' },
    { id: 'fem_c9', tipo: 'calca', nome: 'Calça Skinny', preco: '130', img: '../img/produtos/calca_skinny.png', categoria: 'feminino' },
    { id: 'fem_c10', tipo: 'calca', nome: 'Calça Mom Jeans', preco: '150', img: '../img/produtos/calca_mom.png', categoria: 'feminino' },

    { id: 'fem_b1', tipo: 'blusa', nome: 'Blusa Seda', preco: '90', img: '../img/produtos/blusa_seda.png', categoria: 'feminino' },
    { id: 'fem_b2', tipo: 'blusa', nome: 'Blusa Regata', preco: '70', img: '../img/produtos/blusa_regata.png', categoria: 'feminino' },
    { id: 'fem_b3', tipo: 'blusa', nome: 'Cropped Tricô', preco: '85', img: '../img/produtos/cropped_trico.png', categoria: 'feminino' },
    { id: 'fem_b4', tipo: 'blusa', nome: 'Camisa Social', preco: '130', img: '../img/produtos/camisa_social.png', categoria: 'feminino' },
    { id: 'fem_b5', tipo: 'blusa', nome: 'Blusa T-Shirt', preco: '60', img: '../img/produtos/tshirt.png', categoria: 'feminino' },
    { id: 'fem_b6', tipo: 'blusa', nome: 'Blusa Manga Longa', preco: '95', img: '../img/produtos/blusa_manga_longa.png', categoria: 'feminino' },
    { id: 'fem_b7', tipo: 'blusa', nome: 'Blusa Gola Alta', preco: '100', img: '../img/produtos/blusa_gola_alta.png', categoria: 'feminino' },
    { id: 'fem_b8', tipo: 'blusa', nome: 'Body Renda', preco: '110', img: '../img/produtos/body_renda.png', categoria: 'feminino' },
    { id: 'fem_b9', tipo: 'blusa', nome: 'Blusa Ciganinha', preco: '85', img: '../img/produtos/ciganinha.png', categoria: 'feminino' },
    { id: 'fem_b10', tipo: 'blusa', nome: 'Camisa Linho', preco: '140', img: '../img/produtos/camisa_linho.png', categoria: 'feminino' },

    { id: 'fem_s1', tipo: 'shorts', nome: 'Shorts Jeans', preco: '110', img: '../img/produtos/shorts_jeans.png', categoria: 'feminino' },
    { id: 'fem_s2', tipo: 'shorts', nome: 'Shorts Alfaiataria', preco: '120', img: '../img/produtos/shorts_alfaiataria.png', categoria: 'feminino' },
    { id: 'fem_s3', tipo: 'shorts', nome: 'Shorts Linho', preco: '115', img: '../img/produtos/shorts_linho.png', categoria: 'feminino' },
    { id: 'fem_s4', tipo: 'shorts', nome: 'Shorts Couro', preco: '140', img: '../img/produtos/shorts_couro.png', categoria: 'feminino' },
    { id: 'fem_s5', tipo: 'shorts', nome: 'Shorts Cargo', preco: '125', img: '../img/produtos/shorts_cargo.png', categoria: 'feminino' },
    { id: 'fem_s6', tipo: 'shorts', nome: 'Shorts Esportivo', preco: '85', img: '../img/produtos/shorts_esportivo.png', categoria: 'feminino' },
    { id: 'fem_s7', tipo: 'shorts', nome: 'Shorts Clochard', preco: '110', img: '../img/produtos/shorts_clochard.png', categoria: 'feminino' },
    { id: 'fem_s8', tipo: 'shorts', nome: 'Shorts Saia', preco: '105', img: '../img/produtos/shorts_saia.png', categoria: 'feminino' },
    { id: 'fem_s9', tipo: 'shorts', nome: 'Shorts Moletom', preco: '75', img: '../img/produtos/shorts_moletom.png', categoria: 'feminino' },
    { id: 'fem_s10', tipo: 'shorts', nome: 'Shorts Biker', preco: '70', img: '../img/produtos/shorts_biker.png', categoria: 'feminino' }
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

    const tamanhos = ['P', 'M', 'G', 'GG'];
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
      console.error("Erro ao atualizar curtidas no Firestore:", error);
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