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
  
    { id: 'inf_b1', tipo: 'blusa', nome: 'Casaco Moletom', preco: '95', img: '../images/infantil/blusas/27e56737-8546-4097-a07f-a3e996cec30e.png', categoria: 'infantil' },
    { id: 'inf_b2', tipo: 'blusa', nome: 'Jaqueta Jeans Inf', preco: '120', img: '../images/infantil/blusas/323d5876-24cd-4907-8e63-c8bbb0f83b46.png', categoria: 'infantil' },
    { id: 'inf_b3', tipo: 'blusa', nome: 'Blusa Capuz', preco: '85', img: '../images/infantil/blusas/3688edce-eafe-4ed3-8f2d-994ee77f89cf.png', categoria: 'infantil' },
    { id: 'inf_b4', tipo: 'blusa', nome: 'Suéter Tricô Inf', preco: '90', img: '../images/infantil/blusas/4721d82f-710a-4de0-bd38-e336bfd978b0.png', categoria: 'infantil' },
    { id: 'inf_b5', tipo: 'blusa', nome: 'Jaqueta Corta-Vento', preco: '110', img: '../images/infantil/blusas/61714b26-e7f6-4fe1-89fe-eb9f8dae5cd1.png', categoria: 'infantil' },
    { id: 'inf_b6', tipo: 'blusa', nome: 'Blusa Manga Longa', preco: '65', img: '../images/infantil/blusas/a7b301d5-14bf-48e8-b178-bed279de305e.png', categoria: 'infantil' },
    { id: 'inf_b7', tipo: 'blusa', nome: 'Casaco Fleece', preco: '100', img: '../images/infantil/blusas/dc3466ed-adaa-4417-9413-f95edc5a1bee.png', categoria: 'infantil' },
    { id: 'inf_b8', tipo: 'blusa', nome: 'Blusa Estampada', preco: '70', img: '../images/infantil/blusas/f16d6ab2-817d-4c68-925e-39b5aa3d5a1a.png', categoria: 'infantil' },

    { id: 'inf_c1', tipo: 'calca', nome: 'Calça Jeans Inf', preco: '85', img: '../images/infantil/calças/0bd36ec5-7d79-4056-b1eb-3c4bf8b2e3da.png', categoria: 'infantil' },
    { id: 'inf_c2', tipo: 'calca', nome: 'Calça Moletom', preco: '65', img: '../images/infantil/calças/2cdaf7d8-7cdd-4121-b924-d5170a881ea6.png', categoria: 'infantil' },
    { id: 'inf_c3', tipo: 'calca', nome: 'Calça Jogger Inf', preco: '75', img: '../images/infantil/calças/8a1f4629-5e22-4dd6-85e2-c286fbc64020.png', categoria: 'infantil' },
    { id: 'inf_c4', tipo: 'calca', nome: 'Calça Legging Inf', preco: '50', img: '../images/infantil/calças/39a8ead9-64bb-469b-b4b4-47870133f938.png', categoria: 'infantil' },
    { id: 'inf_c5', tipo: 'calca', nome: 'Calça Cargo Inf', preco: '90', img: '../images/infantil/calças/9494fd78-aad0-47b8-9a01-bb8c033c9ec0.png', categoria: 'infantil' },
    { id: 'inf_c6', tipo: 'calca', nome: 'Calça Sarja Inf', preco: '80', img: '../images/infantil/calças/9494fd78-aad0-47b8-9a01-bb8c033c9ec0.png', categoria: 'infantil' },
    { id: 'inf_c7', tipo: 'calca', nome: 'Calça Esportiva', preco: '60', img: '../images/infantil/calças/b3020a43-23d6-4d8f-b1af-24afb47035e3.png', categoria: 'infantil' },
    { id: 'inf_c8', tipo: 'calca', nome: 'Calça Colorida', preco: '70', img: '../images/infantil/calças/bfc093bc-3ce7-4241-8d94-b1aff2b84631.png', categoria: 'infantil' },

    { id: 'inf_s1', tipo: 'shorts', nome: 'Shorts Jeans Inf', preco: '65', img: '../images/infantil/shorts/0a673f8a-916d-447a-bdc2-6397ea6c7067.png', categoria: 'infantil' },
    { id: 'inf_s2', tipo: 'shorts', nome: 'Shorts Moletom', preco: '45', img: '../images/infantil/shorts/02f9a3af-b6b0-4b7b-9ceb-60571203830d.png', categoria: 'infantil' },
    { id: 'inf_s3', tipo: 'shorts', nome: 'Bermuda Tactel', preco: '50', img: '../images/infantil/shorts/6abab86f-445d-48ce-8749-8f9cf91ad352.png', categoria: 'infantil' },
    { id: 'inf_s4', tipo: 'shorts', nome: 'Shorts Esportivo', preco: '40', img: '../images/infantil/shorts/8e9c94d3-105d-4d80-a445-9c26381e8763.png', categoria: 'infantil' },
    { id: 'inf_s5', tipo: 'shorts', nome: 'Bermuda Sarja', preco: '70', img: '../images/infantil/shorts/8585d67b-2310-4c76-92bd-a49ee007a2a8.png', categoria: 'infantil' },
    { id: 'inf_s6', tipo: 'shorts', nome: 'Shorts Saia Inf', preco: '60', img: '../images/infantil/shorts/b15d0aa5-e85a-469a-aec7-7864a7754459.png', categoria: 'infantil' },
    { id: 'inf_s7', tipo: 'shorts', nome: 'Bermuda Cargo Inf', preco: '75', img: '../images/infantil/shorts/b363b0c7-9ac9-4ebd-bba3-8c045369abe4.png', categoria: 'infantil' },
    { id: 'inf_s8', tipo: 'shorts', nome: 'Shorts Praia Inf', preco: '55', img: '../images/infantil/shorts/b836a3c9-dd76-4246-bcf5-7cd528045f11.png', categoria: 'infantil' },

    { id: 'inf_t1', tipo: 'camiseta', nome: 'Camiseta ', preco: '45', img: '../images/infantil/camisetas/7d7c74cf-294b-4f1d-9302-8dfb8d9dbb33.png', categoria: 'infantil' },
    { id: 'inf_t2', tipo: 'camiseta', nome: 'Camiseta ', preco: '35', img: '../images/infantil/camisetas/8a6d35df-e919-4832-87aa-8aa9ab851b79.png', categoria: 'infantil' },
    { id: 'inf_t3', tipo: 'camiseta', nome: 'Camisa ', preco: '65', img: '../images/infantil/camisetas/9bda485d-698e-4ac1-ae67-9ebed01df95a.png', categoria: 'infantil' },
    { id: 'inf_t4', tipo: 'camiseta', nome: 'Camiseta ', preco: '50', img: '../images/infantil/camisetas/73084b95-2679-419c-aa75-d597d3772f51.png', categoria: 'infantil' },
    { id: 'inf_t5', tipo: 'camiseta', nome: 'Camiseta ', preco: '30', img: '../images/infantil/camisetas/2239092e-aff2-4c1a-96d1-c3e554a685c3.png', categoria: 'infantil' },
    { id: 'inf_t6', tipo: 'camiseta', nome: 'Camisa ', preco: '80', img: '../images/infantil/camisetas/b0af18f4-8727-4d06-a5be-f6b2e86f2bf5.png', categoria: 'infantil' },
    { id: 'inf_t7', tipo: 'camiseta', nome: 'Camiseta', preco: '60', img: '../images/infantil/camisetas/b392d8bf-a53c-4fd5-9dae-3b43bae39425.png', categoria: 'infantil' },
    { id: 'inf_t8', tipo: 'camiseta', nome: 'Camisa', preco: '75', img: '../images/infantil/camisetas/bdc433d7-af38-4e2c-bfac-60f08b1f2a32.png', categoria: 'infantil' },

    { id: 'inf_v1', tipo: 'vestido', nome: 'Vestido Floral Inf', preco: '85', img: '../', categoria: 'infantil' },
    { id: 'inf_v2', tipo: 'vestido', nome: 'Vestido Rodado', preco: '95', img: '../', categoria: 'infantil' },
    { id: 'inf_v3', tipo: 'vestido', nome: 'Vestido Festa Inf', preco: '130', img: '../', categoria: 'infantil' },
    { id: 'inf_v4', tipo: 'vestido', nome: 'Vestido Jeans Inf', preco: '100', img: '../', categoria: 'infantil' },
    { id: 'inf_v5', tipo: 'vestido', nome: 'Vestido Regata', preco: '70', img: '../', categoria: 'infantil' },
    { id: 'inf_v6', tipo: 'vestido', nome: 'Vestido Manga Longa', preco: '90', img: '../', categoria: 'infantil' },
    { id: 'inf_v7', tipo: 'vestido', nome: 'Vestido Tule', preco: '115', img: '../', categoria: 'infantil' },
    { id: 'inf_v8', tipo: 'vestido', nome: 'Vestido Algodão', preco: '65', img: '../', categoria: 'infantil' }
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