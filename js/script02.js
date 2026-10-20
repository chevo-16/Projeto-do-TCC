import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- VERIFICAÇÃO DE SESSÃO E CARREGAMENTO DE FAVORITOS E CARRINHO DO BANCO ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    carregarEstadoUsuario(user.uid);
  } else {
    window.location.href = "index01.html";
  }
});

async function carregarEstadoUsuario(uid) {
  try {
    const userRef = doc(db, "usuarios", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const curtidas = data.curtidas || [];
      const carrinho = data.carrinho || [];

      const idsFavoritados = curtidas.map(p => p.id);
      const idsCarrinho = carrinho.map(p => p.id);

      document.querySelectorAll(".product-card").forEach(card => {
        const id = card.getAttribute("data-id");
        
        // Aplica o estado salvo dos favoritos ao carregar a página
        const btnFav = card.querySelector(".btn-fav");
        const btnHeart = btnFav ? btnFav.querySelector("i") : null;
        if (idsFavoritados.includes(id) && btnHeart) {
          btnHeart.classList.remove("fa-regular");
          btnHeart.classList.add("fa-solid");
          btnHeart.style.color = "#38a11e"; // Verde musgo
          if (btnFav) btnFav.classList.add("favoritado");
        }

        // Aplica o estado salvo do carrinho ao carregar a página
        const btnCart = card.querySelector(".btn-cart");
        const iconeCart = btnCart ? btnCart.querySelector("i") : null;
        if (idsCarrinho.includes(id) && iconeCart) {
          btnCart.classList.add("no-carrinho");
          iconeCart.className = "fa-solid fa-check";
          iconeCart.style.color = "#38a11e"; // Verde musgo
        }
      });
    }
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
  }
}

// --- ADICIONAR / REMOVER DO CARRINHO (Toggle pelo Card) ---
window.adicionarAoCarrinho = async function(id, nome, preco, img, elemento) {
  const card = elemento ? elemento.closest('.product-card') : document.querySelector(`.product-card[data-id="${id}"]`);
  const btnCart = card ? card.querySelector(".btn-cart") : null;
  const iconeCart = btnCart ? btnCart.querySelector("i") : null;

  if (!btnCart || !iconeCart) return;

  const jaNoCarrinho = btnCart.classList.contains("no-carrinho");

  // 1. ALTERAÇÃO VISUAL INSTANTÂNEA
  if (jaNoCarrinho) {
    // Cancela/Remove do carrinho e volta o ícone original
    btnCart.classList.remove("no-carrinho");
    iconeCart.className = "fa-solid fa-cart-shopping";
    iconeCart.style.color = ""; // Volta pro branco
  } else {
    // Adiciona ao carrinho e coloca o check verde
    btnCart.classList.add("no-carrinho");
    iconeCart.className = "fa-solid fa-check";
    iconeCart.style.color = "#38a11e"; // Verde musgo
  }

  // 2. ATUALIZAÇÃO NO FIRESTORE (Em segundo plano)
  const user = auth.currentUser;
  if (user) {
    try {
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const carrinhoAtual = userSnap.data().carrinho || [];

        if (jaNoCarrinho) {
          // Filtra e remove todas as instâncias desse produto
          const novoCarrinho = carrinhoAtual.filter(p => p.id !== id);
          await updateDoc(userRef, { carrinho: novoCarrinho });
        } else {
          // Adiciona o novo item ao array
          const produto = { id, nome, preco, img, dataAdicionado: new Date().toISOString() };
          await updateDoc(userRef, { carrinho: arrayUnion(produto) });
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar carrinho no banco:", error);
    }
  }
};

// --- ALTERNAR FAVORITO (Troca instantânea para Coração Verde Musgo) ---
window.alternarFavorito = async function(id, nome, preco, img, elemento) {
  const card = elemento ? elemento.closest('.product-card') : document.querySelector(`.product-card[data-id="${id}"]`);
  const btnFav = card ? card.querySelector(".btn-fav") : null;
  const btnHeart = btnFav ? btnFav.querySelector("i") : null;

  if (!btnHeart) return;

  const isFavorited = btnHeart.classList.contains("fa-solid");

  // 1. ALTERAÇÃO VISUAL INSTANTÂNEA
  if (isFavorited) {
    btnHeart.classList.remove("fa-solid");
    btnHeart.classList.add("fa-regular");
    btnHeart.style.color = ""; // Volta para a cor padrão (branco)
    if (btnFav) btnFav.classList.remove("favoritado");
  } else {
    btnHeart.classList.remove("fa-regular");
    btnHeart.classList.add("fa-solid");
    btnHeart.style.color = "#38a11e"; // Verde musgo do projeto
    if (btnFav) btnFav.classList.add("favoritado");
  }

  // 2. ATUALIZAÇÃO NO FIRESTORE (Em segundo plano)
  const user = auth.currentUser;
  if (user) {
    try {
      const userRef = doc(db, "usuarios", user.uid);
      const produto = { id, nome, preco, img };

      if (isFavorited) {
        await updateDoc(userRef, { curtidas: arrayRemove(produto) });
      } else {
        await updateDoc(userRef, { curtidas: arrayUnion(produto) });
      }
    } catch (error) {
      console.error("Erro ao sincronizar favoritos com o banco:", error);
    }
  }
};

// --- CÓDIGO DAS CATEGORIAS E BANNERS ---
document.addEventListener("DOMContentLoaded", () => {
  const btnOpen = document.getElementById("btn-open-cat");
  const btnClose = document.getElementById("btn-close-cat");
  const modal = document.getElementById("modal-categorias");
  const catButtons = document.querySelectorAll(".cat-button");

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

  catButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const categoria = btn.getAttribute("data-categoria");
      if (categoria) {
        window.location.href = `${categoria}.html`;
      }
    });
  });

  const cardTop = document.querySelector(".side-card:nth-child(1)");
  const cardBottom = document.querySelector(".side-card:nth-child(2)");

  const imgTop = document.getElementById("side-img-1");
  const imgBottom = document.getElementById("side-img-2");

  const topBanners = [
    {
      img: "../images/vestido.png",
      bg: "linear-gradient(90deg, #369374 0%, #FC78E1 100%)",
    },
    {
      img: "../images/blusa2.png",
      bg: "linear-gradient(90deg, #369374 0%, #0866FF 100%)",
    },
  ];

  const bottomBanners = [
    {
      img: "../images/tenis2.png",
      bg: "linear-gradient(90deg, #369374 0%, #4ade80 100%)",
    },
    {
      img: "../images/infantil2.png",
      bg: "linear-gradient(90deg, #369374 0%, #FC78E1 50%, #38bdf8 100%)",
    },
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