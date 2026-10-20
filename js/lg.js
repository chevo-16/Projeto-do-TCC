import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  // --- CONTROLE DE AUTENTICAÇÃO / SESSÃO DA LANDING PAGE ---
  const authDeslogado = document.getElementById("auth-deslogado");
  const authLogado = document.getElementById("auth-logado");
  const userPhoto = document.getElementById("user-photo");
  const userName = document.getElementById("user-name");
  const btnLogout = document.getElementById("btn-logout");

  // Escuta o estado do usuário (detecta se a conta está salva)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Se estiver logado
      if (authDeslogado) authDeslogado.classList.add("hidden");
      if (authLogado) authLogado.classList.remove("hidden");

      // Atualiza foto e nome do perfil
      if (userPhoto) {
        userPhoto.src = user.photoURL || "../images/default-avatar.png";
      }

      if (userName) {
        const primeiroNome = user.displayName ? user.displayName.split(" ")[0] : "Conta";
        userName.textContent = primeiroNome;
      }
    } else {
      // Se estiver deslogado
      if (authDeslogado) authDeslogado.classList.remove("hidden");
      if (authLogado) authLogado.classList.add("hidden");
    }
  });

  // Botão de Sair da conta
  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.reload();
      } catch (error) {
        console.error("Erro ao encerrar sessão:", error);
      }
    });
  }

  // --- ACORDION FAQ ---
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const answerId = question.getAttribute("aria-controls");
      const answerElement = document.getElementById(answerId);
      const isExpanded = question.getAttribute("aria-expanded") === "true";

      faqQuestions.forEach((otherQuestion) => {
        if (otherQuestion !== question) {
          otherQuestion.setAttribute("aria-expanded", "false");
          const otherAnswer = document.getElementById(
            otherQuestion.getAttribute("aria-controls")
          );
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
            otherAnswer.setAttribute("hidden", "");
          }
        }
      });

      question.setAttribute("aria-expanded", !isExpanded);

      if (!isExpanded) {
        answerElement.removeAttribute("hidden");
        answerElement.style.maxHeight = answerElement.scrollHeight + "px";
      } else {
        answerElement.style.maxHeight = null;
        setTimeout(() => {
          if (question.getAttribute("aria-expanded") === "false") {
            answerElement.setAttribute("hidden", "");
          }
        }, 350);
      }
    });
  });

  // --- LISTA EXPANSÍVEL DE LOJAS (CASCAVEL) ---
  const btnLojas = document.querySelector(".btn-lojas-cascavel");
  const listaLojas = document.getElementById("lista-lojas-cascavel");

  if (btnLojas && listaLojas) {
    btnLojas.addEventListener("click", () => {
      const isExpanded = btnLojas.getAttribute("aria-expanded") === "true";

      btnLojas.setAttribute("aria-expanded", !isExpanded);

      if (!isExpanded) {
        listaLojas.removeAttribute("hidden");
        listaLojas.style.maxHeight = listaLojas.scrollHeight + "px";
      } else {
        listaLojas.style.maxHeight = null;
        setTimeout(() => {
          if (btnLojas.getAttribute("aria-expanded") === "false") {
            listaLojas.setAttribute("hidden", "");
          }
        }, 350);
      }
    });
  }

  // --- INTERAÇÃO TOUCH NOS CARDS DE FOTO ---
  const cardsFoto = document.querySelectorAll(".card-foto");

  cardsFoto.forEach((card) => {
    card.addEventListener("click", function () {
      if (this.classList.contains("active-touch")) {
        this.classList.remove("active-touch");
      } else {
        cardsFoto.forEach((c) => c.classList.remove("active-touch"));
        this.classList.add("active-touch");
      }
    });
  });

});