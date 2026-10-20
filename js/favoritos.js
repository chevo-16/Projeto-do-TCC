import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("favoritos-grid");
  const emptyState = document.getElementById("empty-state");

  // Escuta autenticação do usuário
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      carregarFavoritos(user.uid);
    } else {
      window.location.href = "index01.html";
    }
  });

  // Carrega os dados salvos no Firestore
  async function carregarFavoritos(uid) {
    try {
      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const curtidas = data.curtidas || [];
        const carrinho = data.carrinho || [];
        const idsCarrinho = carrinho.map(p => p.id);

        renderizarProdutos(curtidas, idsCarrinho);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  }

  // Renderiza os cards dinamicamente
  function renderizarProdutos(curtidas, idsCarrinho) {
    grid.innerHTML = "";

    if (curtidas.length === 0) {
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    curtidas.forEach(produto => {
      const noCarrinho = idsCarrinho.includes(produto.id);

      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-id", produto.id);

      card.innerHTML = `
        <div class="img-container">
          <img src="${produto.img}" alt="${produto.nome}" />
        </div>
        <div class="product-info">
          <span class="p-title">${produto.nome}</span>
          <span class="p-price">R$${produto.preco}</span>
        </div>
        <div class="card-actions">
          <button type="button" class="btn-fav favoritado" title="Remover dos favoritos">
            <i class="fa-solid fa-heart"></i>
          </button>
          <button type="button" class="btn-cart ${noCarrinho ? 'no-carrinho' : ''}" title="Adicionar ao carrinho">
            <i class="fa-solid ${noCarrinho ? 'fa-check' : 'fa-cart-shopping'}"></i>
          </button>
        </div>
      `;

      // Evento para desfavoritar e remover da tela na hora
      const btnFav = card.querySelector(".btn-fav");
      btnFav.addEventListener("click", () => removerFavorito(produto, card));

      // Evento para adicionar/remover do carrinho
      const btnCart = card.querySelector(".btn-cart");
      btnCart.addEventListener("click", () => alternarCarrinho(produto, btnCart));

      grid.appendChild(card);
    });
  }

  // Remove dos favoritos e atualiza o banco
  async function removerFavorito(produto, cardElement) {
    const user = auth.currentUser;
    if (!user) return;

    cardElement.remove(); // Remove o card da tela na hora

    if (grid.children.length === 0) {
      emptyState.classList.remove("hidden");
    }

    try {
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, {
        curtidas: arrayRemove(produto)
      });
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  }

  // Função toggle do carrinho
  async function alternarCarrinho(produto, btnCart) {
    const user = auth.currentUser;
    if (!user) return;

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
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const carrinhoAtual = userSnap.data().carrinho || [];

        if (jaNoCarrinho) {
          const novoCarrinho = carrinhoAtual.filter(p => p.id !== produto.id);
          await updateDoc(userRef, { carrinho: novoCarrinho });
        } else {
          await updateDoc(userRef, {
            carrinho: arrayUnion({ ...produto, dataAdicionado: new Date().toISOString() })
          });
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar carrinho:", error);
    }
  }
});