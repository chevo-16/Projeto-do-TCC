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
  
    { id: 'fem_v1', tipo: 'vestido', nome: 'Vestido ', preco: '150', img: '../images/feminino/vestido/2ab05ce1-a652-49e0-a775-00e7b8e6ca2e.png', categoria: 'feminino' },
    { id: 'fem_v2', tipo: 'vestido', nome: 'Vestido ', preco: '150', img: '../images/feminino/vestido/9eb5d0fa-933a-4493-97de-fddae96171d0.png', categoria: 'feminino' },
    { id: 'fem_v3', tipo: 'vestido', nome: 'Vestido Mid', preco: '160', img: '../images/feminino/vestido/9f443dff-2c2c-48c3-9b36-e7a005ed743b.png', categoria: 'feminino' },
    { id: 'fem_v4', tipo: 'vestido', nome: 'Vestido Curto', preco: '135', img: '../images/feminino/vestido/312eecdb-1172-416d-b227-52cb1433befd.png', categoria: 'feminino' },
    { id: 'fem_v5', tipo: 'vestido', nome: 'Vestido Longo', preco: '180', img: '../images/feminino/vestido/b53252b2-93bd-4e1b-89c4-03adaee337f5.png', categoria: 'feminino' },
    { id: 'fem_v6', tipo: 'vestido', nome: 'Vestido Festa', preco: '210', img: '../images/feminino/vestido/c7ec3f3d-5535-4a8e-8f3d-48361291dc89.png', categoria: 'feminino' },
    { id: 'fem_v7', tipo: 'vestido', nome: 'Vestido Regata', preco: '115', img: '../images/feminino/vestido/e6b3c8b6-d762-4118-8eb1-3d6f72cad316.png', categoria: 'feminino' },
    { id: 'fem_v8', tipo: 'vestido', nome: 'Vestido Tubinho', preco: '140', img: '../images/feminino/vestido/e7c020f1-33f1-47f9-8c1c-f1b3b1ff48ba.png', categoria: 'feminino' },
    { id: 'fem_v9', tipo: 'vestido', nome: 'Vestido Floral', preco: '145', img: '../images/feminino/vestido/vestido.png', categoria: 'feminino' },
    { id: 'fem_v10', tipo: 'vestido', nome: 'Vestido Elegante', preco: '190', img: '../images/feminino/vestido/vestido2.png', categoria: 'feminino' },

    { id: 'fem_c1', tipo: 'calca', nome: 'Calça Alfaiataria', preco: '150', img: '../images/feminino/calças/3d486810-c3e9-42f8-8c95-6d2f0f6579b0.png', categoria: 'feminino' },
    { id: 'fem_c2', tipo: 'calca', nome: 'Calça Jeans Wide', preco: '140', img: '../images/feminino/calças/8b798451-168d-45bc-9f87-21be694b8992.png', categoria: 'feminino' },
    { id: 'fem_c3', tipo: 'calca', nome: 'Calça Pantalona', preco: '170', img: '../images/feminino/calças/76e34b98-e5d3-4a7d-882a-b4e4e5233eb8.png', categoria: 'feminino' },
    { id: 'fem_c4', tipo: 'calca', nome: 'Calça Jogger', preco: '125', img: '../images/feminino/calças/0435d6c4-0e07-429f-a5ea-3250f35b3d15.png', categoria: 'feminino' },
    { id: 'fem_c5', tipo: 'calca', nome: 'Calça Legging', preco: '90', img: '../images/feminino/calças/aeef7f50-3f80-4b73-9d3e-959bc3dfd45b.png', categoria: 'feminino' },
    { id: 'fem_c6', tipo: 'calca', nome: 'Calça Cargo', preco: '160', img: '../images/feminino/calças/b887f3c3-208d-4492-baa3-3a4c0bdde57e.png', categoria: 'feminino' },
    { id: 'fem_c7', tipo: 'calca', nome: 'Calça Flare', preco: '155', img: '../images/feminino/calças/c9dec70e-7bac-4cc8-ba42-c799f79f8fe4.png', categoria: 'feminino' },
    { id: 'fem_c8', tipo: 'calca', nome: 'Calça Slouchy', preco: '145', img: '../images/feminino/calças/cdf5b993-3931-4f43-97f3-93f760c5bbff.png', categoria: 'feminino' },
    { id: 'fem_c9', tipo: 'calca', nome: 'Calça Skinny', preco: '130', img: '../images/feminino/calças/dd4632c8-7af8-4a09-b1e9-34166bf4c262.png', categoria: 'feminino' },
    { id: 'fem_c10', tipo: 'calca', nome: 'Calça Mom Jeans', preco: '150', img: '../images/feminino/calças/e2890da2-b2ef-44bf-b8dd-1e9756555d03.png', categoria: 'feminino' },

    { id: 'fem_b1', tipo: 'blusa', nome: 'Blusa Seda', preco: '90', img: '../images/feminino/blsa/1ecd57b0-92b5-4f6b-9d2e-f3084fa572a7.png', categoria: 'feminino' },
    { id: 'fem_b2', tipo: 'blusa', nome: 'Blusa Regata', preco: '70', img: '../images/feminino/blsa/7fc9d90a-86db-4b9f-acef-2f9cd8f5987d.png', categoria: 'feminino' },
    { id: 'fem_b3', tipo: 'blusa', nome: 'Cropped Tricô', preco: '85', img: '../images/feminino/blsa/8e53ab14-030b-4f92-b2f8-33edcff467eb.png', categoria: 'feminino' },
    { id: 'fem_b4', tipo: 'blusa', nome: 'Camisa Social', preco: '130', img: '../images/feminino/blsa/9e2c7737-0c92-439b-86d2-a1b2c6d02eae.png', categoria: 'feminino' },
    { id: 'fem_b5', tipo: 'blusa', nome: 'Blusa T-Shirt', preco: '60', img: '../images/feminino/blsa/9f803d1f-aff2-4506-bab1-e749d47e0c83.png', categoria: 'feminino' },
    { id: 'fem_b6', tipo: 'blusa', nome: 'Blusa Manga Longa', preco: '95', img: '../images/feminino/blsa/773dfff9-a5e0-4634-8253-77d7e27e0fb9.png', categoria: 'feminino' },
    { id: 'fem_b7', tipo: 'blusa', nome: 'Blusa Gola Alta', preco: '100', img: '../images/feminino/blsa/63055f0c-07ce-4884-8f79-0fca7159ce77.png', categoria: 'feminino' },
    { id: 'fem_b8', tipo: 'blusa', nome: 'Body Renda', preco: '110', img: '../img/images/feminino/blsa/ad01f097-1391-4996-b201-9ebd5a3d9cb2.png', categoria: 'feminino' },
    { id: 'fem_b9', tipo: 'blusa', nome: 'Blusa Ciganinha', preco: '85', img: '../images/feminino/blsa/f9d1e342-a98d-414f-b9b5-53be6c565541.png', categoria: 'feminino' },
    { id: 'fem_b10', tipo: 'blusa', nome: 'Camisa Linho', preco: '140', img: '../images/feminino/blsa/f3471c72-036c-4540-b249-d08ce2bd8c94.png', categoria: 'feminino' },

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