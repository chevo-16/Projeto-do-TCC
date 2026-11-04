import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("infantil-grid") || document.getElementById("product-grid");
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
  
    { id: 'inf_b1', tipo: 'blusa', nome: 'Casaco Moletom', preco: '95', img: '../img/produtos/inf_casaco_moletom.png', categoria: 'infantil' },
    { id: 'inf_b2', tipo: 'blusa', nome: 'Jaqueta Jeans Inf', preco: '120', img: '../img/produtos/inf_jaqueta_jeans.png', categoria: 'infantil' },
    { id: 'inf_b3', tipo: 'blusa', nome: 'Blusa Capuz', preco: '85', img: '../img/produtos/inf_blusa_capuz.png', categoria: 'infantil' },
    { id: 'inf_b4', tipo: 'blusa', nome: 'Suéter Tricô Inf', preco: '90', img: '../img/produtos/inf_sueter.png', categoria: 'infantil' },
    { id: 'inf_b5', tipo: 'blusa', nome: 'Jaqueta Corta-Vento', preco: '110', img: '../img/produtos/inf_corta_vento.png', categoria: 'infantil' },
    { id: 'inf_b6', tipo: 'blusa', nome: 'Blusa Manga Longa', preco: '65', img: '../img/produtos/inf_manga_longa.png', categoria: 'infantil' },
    { id: 'inf_b7', tipo: 'blusa', nome: 'Casaco Fleece', preco: '100', img: '../img/produtos/inf_fleece.png', categoria: 'infantil' },
    { id: 'inf_b8', tipo: 'blusa', nome: 'Blusa Estampada', preco: '70', img: '../img/produtos/inf_blusa_estampada.png', categoria: 'infantil' },

    { id: 'inf_c1', tipo: 'calca', nome: 'Calça Jeans Inf', preco: '85', img: '../img/produtos/inf_calca_jeans.png', categoria: 'infantil' },
    { id: 'inf_c2', tipo: 'calca', nome: 'Calça Moletom', preco: '65', img: '../img/produtos/inf_calca_moletom.png', categoria: 'infantil' },
    { id: 'inf_c3', tipo: 'calca', nome: 'Calça Jogger Inf', preco: '75', img: '../img/produtos/inf_calca_jogger.png', categoria: 'infantil' },
    { id: 'inf_c4', tipo: 'calca', nome: 'Calça Legging Inf', preco: '50', img: '../img/produtos/inf_calca_legging.png', categoria: 'infantil' },
    { id: 'inf_c5', tipo: 'calca', nome: 'Calça Cargo Inf', preco: '90', img: '../img/produtos/inf_calca_cargo.png', categoria: 'infantil' },
    { id: 'inf_c6', tipo: 'calca', nome: 'Calça Sarja Inf', preco: '80', img: '../img/produtos/inf_calca_sarja.png', categoria: 'infantil' },
    { id: 'inf_c7', tipo: 'calca', nome: 'Calça Esportiva', preco: '60', img: '../img/produtos/inf_calca_esportiva.png', categoria: 'infantil' },
    { id: 'inf_c8', tipo: 'calca', nome: 'Calça Colorida', preco: '70', img: '../img/produtos/inf_calca_colorida.png', categoria: 'infantil' },

    { id: 'inf_s1', tipo: 'shorts', nome: 'Shorts Jeans Inf', preco: '65', img: '../img/produtos/inf_shorts_jeans.png', categoria: 'infantil' },
    { id: 'inf_s2', tipo: 'shorts', nome: 'Shorts Moletom', preco: '45', img: '../img/produtos/inf_shorts_moletom.png', categoria: 'infantil' },
    { id: 'inf_s3', tipo: 'shorts', nome: 'Bermuda Tactel', preco: '50', img: '../img/produtos/inf_shorts_tactel.png', categoria: 'infantil' },
    { id: 'inf_s4', tipo: 'shorts', nome: 'Shorts Esportivo', preco: '40', img: '../img/produtos/inf_shorts_esportivo.png', categoria: 'infantil' },
    { id: 'inf_s5', tipo: 'shorts', nome: 'Bermuda Sarja', preco: '70', img: '../img/produtos/inf_shorts_sarja.png', categoria: 'infantil' },
    { id: 'inf_s6', tipo: 'shorts', nome: 'Shorts Saia Inf', preco: '60', img: '../img/produtos/inf_shorts_saia.png', categoria: 'infantil' },
    { id: 'inf_s7', tipo: 'shorts', nome: 'Bermuda Cargo Inf', preco: '75', img: '../img/produtos/inf_shorts_cargo.png', categoria: 'infantil' },
    { id: 'inf_s8', tipo: 'shorts', nome: 'Shorts Praia Inf', preco: '55', img: '../img/produtos/inf_shorts_praia.png', categoria: 'infantil' },

    { id: 'inf_t1', tipo: 'camiseta', nome: 'Camiseta Estampada', preco: '45', img: '../img/produtos/inf_camiseta_estampada.png', categoria: 'infantil' },
    { id: 'inf_t2', tipo: 'camiseta', nome: 'Camiseta Básica Inf', preco: '35', img: '../img/produtos/inf_camiseta_basica.png', categoria: 'infantil' },
    { id: 'inf_t3', tipo: 'camiseta', nome: 'Camisa Polo Inf', preco: '65', img: '../img/produtos/inf_camisa_polo.png', categoria: 'infantil' },
    { id: 'inf_t4', tipo: 'camiseta', nome: 'Camiseta Personagem', preco: '50', img: '../img/produtos/inf_camiseta_personagem.png', categoria: 'infantil' },
    { id: 'inf_t5', tipo: 'camiseta', nome: 'Camiseta Regata Inf', preco: '30', img: '../img/produtos/inf_camiseta_regata.png', categoria: 'infantil' },
    { id: 'inf_t6', tipo: 'camiseta', nome: 'Camisa Linho Inf', preco: '80', img: '../img/produtos/inf_camisa_linho.png', categoria: 'infantil' },
    { id: 'inf_t7', tipo: 'camiseta', nome: 'Camiseta UV Praia', preco: '60', img: '../img/produtos/inf_camiseta_uv.png', categoria: 'infantil' },
    { id: 'inf_t8', tipo: 'camiseta', nome: 'Camisa Xadrez Inf', preco: '75', img: '../img/produtos/inf_camisa_xadrez.png', categoria: 'infantil' },

    { id: 'inf_v1', tipo: 'vestido', nome: 'Vestido Floral Inf', preco: '85', img: '../img/produtos/inf_vestido_floral.png', categoria: 'infantil' },
    { id: 'inf_v2', tipo: 'vestido', nome: 'Vestido Rodado', preco: '95', img: '../img/produtos/inf_vestido_rodado.png', categoria: 'infantil' },
    { id: 'inf_v3', tipo: 'vestido', nome: 'Vestido Festa Inf', preco: '130', img: '../img/produtos/inf_vestido_festa.png', categoria: 'infantil' },
    { id: 'inf_v4', tipo: 'vestido', nome: 'Vestido Jeans Inf', preco: '100', img: '../img/produtos/inf_vestido_jeans.png', categoria: 'infantil' },
    { id: 'inf_v5', tipo: 'vestido', nome: 'Vestido Regata', preco: '70', img: '../img/produtos/inf_vestido_regata.png', categoria: 'infantil' },
    { id: 'inf_v6', tipo: 'vestido', nome: 'Vestido Manga Longa', preco: '90', img: '../img/produtos/inf_vestido_manga_longa.png', categoria: 'infantil' },
    { id: 'inf_v7', tipo: 'vestido', nome: 'Vestido Tule', preco: '115', img: '../img/produtos/inf_vestido_tule.png', categoria: 'infantil' },
    { id: 'inf_v8', tipo: 'vestido', nome: 'Vestido Algodão', preco: '65', img: '../img/produtos/inf_vestido_algodao.png', categoria: 'infantil' }
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

    const tamanhos = ['2', '4', '6', '8', '10', '12', '14', '16'];
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