import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("favoritos-grid");
  const emptyState = document.getElementById("empty-state");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      carregarFavoritos(user.uid);
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
        <div class="img-container">
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

      const btnFav = card.querySelector(".btn-fav");
      btnFav.addEventListener("click", () => removerFavorito(id, uid, card));

      const btnCart = card.querySelector(".btn-cart");
      btnCart.addEventListener("click", () => alternarCarrinho(produto, btnCart, uid));

      grid.appendChild(card);
    });
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

  async function alternarCarrinho(produto, btnCart, uid) {
    const icone = btnCart.querySelector("i");
    const jaNoCarrinho = btnCart.classList.contains("no-carrinho");

    if (jaNoCarrinho) {
      btnCart.classList.remove("no-carrinho");
      icone.className = "fa-solid fa-cart-shopping";
      icone.style.color = "";
    } else {
      btnCart.classList.add("no-carrinho");
      icone.className = "fa-solid fa-check";
      icone.style.color = "#38a11e";
    }

    try {
      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);

      let carrinhoAtual = [];
      if (userSnap.exists()) {
        carrinhoAtual = userSnap.data().carrinho || [];
      }

      let novoCarrinho;
      if (jaNoCarrinho) {
        novoCarrinho = carrinhoAtual.filter(p => (typeof p === 'object' ? p.id : p) !== produto.id);
      } else {
        const itemCarrinho = { ...produto, dataAdicionado: new Date().toISOString() };
        novoCarrinho = [...carrinhoAtual.filter(p => (typeof p === 'object' ? p.id : p) !== produto.id), itemCarrinho];
      }

      await setDoc(userRef, { carrinho: novoCarrinho }, { merge: true });
    } catch (error) {
      console.error("Erro ao atualizar carrinho:", error);
    }
  }
});