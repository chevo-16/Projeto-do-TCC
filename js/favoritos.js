import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("favoritos-grid");
  const emptyState = document.getElementById("empty-state");

  let uidUsuario = null;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      uidUsuario = user.uid;
      carregarFavoritos(uidUsuario);
    } else {
      window.location.href = "index01.html";
    }
  });

  async function carregarFavoritos(uid) {
    try {
      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const curtidas = data.curtidas || [];
        const carrinho = data.carrinho || [];
        const idsCarrinho = carrinho.map(p => typeof p === 'object' ? p.id : p);

        renderizarProdutos(curtidas, idsCarrinho, uid);
      } else {
        emptyState.classList.remove("hidden");
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos do Firestore:", error);
    }
  }

  function obterOpcoesTamanho(produto) {
    const idStr = String(produto.id || '');
    if (idStr.startsWith('sap_i')) {
      return ['22', '24', '26', '28', '30', '32', '34', '36'];
    } else if (idStr.startsWith('sap_') || produto.categoria === 'calcados') {
      return ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
    } else if (idStr.startsWith('inf_') || produto.categoria === 'infantil') {
      return ['2', '4', '6', '8', '10', '12', '14', '16'];
    } else {
      return ['P', 'M', 'G', 'GG'];
    }
  }

  function renderizarProdutos(curtidas, idsCarrinho, uid) {
    grid.innerHTML = "";

    if (!curtidas || curtidas.length === 0) {
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    curtidas.forEach(produto => {
      const id = typeof produto === 'object' ? produto.id : produto;
      const nome = produto.nome || "Produto";
      const preco = produto.preco || "0";
      const img = produto.img || "";

      const noCarrinho = idsCarrinho.includes(id);

      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-id", id);

      card.innerHTML = `
        <div class="img-container" style="cursor: pointer;">
          <img src="${img}" alt="${nome}" />
        </div>
        <div class="card-content-bottom">
          <div class="product-info">
            <span class="p-title">${nome}</span>
            <span class="p-price">R$${preco}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn-fav favoritado" title="Remover dos favoritos">
              <i class="fa-solid fa-heart" style="color: #38a11e;"></i>
            </button>
            <button type="button" class="btn-cart ${noCarrinho ? 'no-carrinho' : ''}" title="Adicionar ao carrinho">
              <i class="fa-solid ${noCarrinho ? 'fa-check' : 'fa-cart-shopping'}" ${noCarrinho ? 'style="color: #38a11e;"' : ''}></i>
            </button>
          </div>
        </div>
      `;

      const imgEl = card.querySelector(".img-container");
      imgEl.addEventListener("click", () => abrirModalSelecao(produto, card));

      const btnFav = card.querySelector(".btn-fav");
      btnFav.addEventListener("click", (e) => {
        e.stopPropagation();
        removerFavorito(id, uid, card);
      });

      const btnCart = card.querySelector(".btn-cart");
      btnCart.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModalSelecao(produto, card);
      });

      grid.appendChild(card);
    });
  }

  function abrirModalSelecao(produto, cardElement) {
    const modal = document.getElementById("modal-produto");
    if (!modal) {
      adicionarDiretoCarrinho(produto, cardElement);
      return;
    }

    const tamanhos = obterOpcoesTamanho(produto);
    let tamanhoSelecionado = tamanhos[0];
    let quantidade = 1;

    document.getElementById("modal-p-img").src = produto.img || "";
    document.getElementById("modal-p-nome").textContent = produto.nome || "Produto";
    document.getElementById("modal-p-preco").textContent = `R$${produto.preco || "0"}`;
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
      if (!uidUsuario) return;

      const itemCarrinho = {
        ...produto,
        tamanho: tamanhoSelecionado,
        quantidade: quantidade,
        dataAdicionado: new Date().toISOString()
      };

      try {
        const userRef = doc(db, "usuarios", uidUsuario);
        const userSnap = await getDoc(userRef);

        let carrinhoAtual = [];
        if (userSnap.exists()) {
          carrinhoAtual = userSnap.data().carrinho || [];
        }

        const novoCarrinho = [...carrinhoAtual.filter(p => (typeof p === 'object' ? p.id : p) !== produto.id), itemCarrinho];

        await setDoc(userRef, { carrinho: novoCarrinho }, { merge: true });

        const btnCart = cardElement.querySelector(".btn-cart");
        if (btnCart) {
          btnCart.classList.add("no-carrinho");
          const icone = btnCart.querySelector("i");
          icone.className = "fa-solid fa-check";
          icone.style.color = "#38a11e";
        }

        modal.classList.add("hidden");
      } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
      }
    };

    const btnCloseModal = document.getElementById("btn-close-produto");
    if (btnCloseModal) {
      btnCloseModal.onclick = () => modal.classList.add("hidden");
    }

    modal.classList.remove("hidden");
  }

  async function adicionarDiretoCarrinho(produto, cardElement) {
    try {
      const userRef = doc(db, "usuarios", uidUsuario);
      const userSnap = await getDoc(userRef);

      let carrinhoAtual = [];
      if (userSnap.exists()) {
        carrinhoAtual = userSnap.data().carrinho || [];
      }

      const itemCarrinho = {
        ...produto,
        tamanho: obterOpcoesTamanho(produto)[0],
        quantidade: 1,
        dataAdicionado: new Date().toISOString()
      };

      const novoCarrinho = [...carrinhoAtual.filter(p => (typeof p === 'object' ? p.id : p) !== produto.id), itemCarrinho];

      await setDoc(userRef, { carrinho: novoCarrinho }, { merge: true });

      const btnCart = cardElement.querySelector(".btn-cart");
      if (btnCart) {
        btnCart.classList.add("no-carrinho");
        const icone = btnCart.querySelector("i");
        icone.className = "fa-solid fa-check";
        icone.style.color = "#38a11e";
      }
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  }

  async function removerFavorito(id, uid, cardElement) {
    cardElement.remove();

    if (grid.children.length === 0) {
      emptyState.classList.remove("hidden");
    }

    try {
      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const curtidasAtuais = userSnap.data().curtidas || [];
        const novasCurtidas = curtidasAtuais.filter(p => (typeof p === 'object' ? p.id : p) !== id);
        
        await setDoc(userRef, { curtidas: novasCurtidas }, { merge: true });
      }
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  }
});