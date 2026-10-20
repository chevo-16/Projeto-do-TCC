import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Usuário logado:", user.displayName || user.email);
    carregarFavoritosDoUsuario(user.uid);
  } else {

    window.location.href = "index01.html";
  }
});

async function carregarFavoritosDoUsuario(uid) {
  try {
    const userRef = doc(db, "usuarios", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const curtidas = userSnap.data().curtidas || [];
      const idsFavoritados = curtidas.map(p => p.id);

      document.querySelectorAll(".product-card").forEach(card => {
        const id = card.getAttribute("data-id");
        const btnHeart = card.querySelector(".btn-favorito i");

        if (idsFavoritados.includes(id) && btnHeart) {
          btnHeart.classList.remove("fa-regular");
          btnHeart.classList.add("fa-solid");
          btnHeart.style.color = "#ff4d4d";
        }
      });
    }
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
  }
}

window.adicionarAoCarrinho = async function(id, nome, preco, img) {
  const user = auth.currentUser;
  if (!user) {
    alert("Você precisa estar logado para adicionar produtos ao carrinho!");
    return;
  }

  const userRef = doc(db, "usuarios", user.uid);
  const produto = { id, nome, preco, img, dataAdicionado: new Date().toISOString() };

  try {
    await updateDoc(userRef, {
      carrinho: arrayUnion(produto)
    });
    alert(`"${nome}" foi adicionado ao seu carrinho!`);
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    alert("Erro ao adicionar ao carrinho. Tente novamente.");
  }
};

window.alternarFavorito = async function(id, nome, preco, img) {
  const user = auth.currentUser;
  if (!user) {
    alert("Você precisa estar logado para favoritar produtos!");
    return;
  }

  const userRef = doc(db, "usuarios", user.uid);
  const produto = { id, nome, preco, img };

  const card = document.querySelector(`.product-card[data-id="${id}"]`);
  const btnHeart = card ? card.querySelector(".btn-favorito i") : null;
  const isFavorited = btnHeart ? btnHeart.classList.contains("fa-solid") : false;

  try {
    if (isFavorited) {
      await updateDoc(userRef, {
        curtidas: arrayRemove(produto)
      });
      if (btnHeart) {
        btnHeart.classList.remove("fa-solid");
        btnHeart.classList.add("fa-regular");
        btnHeart.style.color = "";
      }
    } else {
      await updateDoc(userRef, {
        curtidas: arrayUnion(produto)
      });
      if (btnHeart) {
        btnHeart.classList.remove("fa-regular");
        btnHeart.classList.add("fa-solid");
        btnHeart.style.color = "#ff4d4d";
      }
    }
  } catch (error) {
    console.error("Erro ao alternar favorito:", error);
  }
};

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