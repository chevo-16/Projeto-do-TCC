import { auth, fazerLoginGoogle } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Animação da Splash Screen (3 segundos)
window.addEventListener("DOMContentLoaded", () => {
  const splashScreen = document.getElementById("splash-screen");
  const loginScreen = document.getElementById("login-screen");

  if (splashScreen && loginScreen) {
    setTimeout(() => {
      splashScreen.classList.add("hidden");
      loginScreen.classList.remove("hidden");
    }, 3000);
  }
});

// Tornando as funções de navegação e Google disponíveis para os botões do HTML
window.entrarComGoogle = fazerLoginGoogle;

window.irParaCadastro = function() {
  window.location.href = "Cadastro.html";
};

window.voltarParaLogin = function() {
  window.location.href = "index01.html";
};

// Autenticação de Login com Firebase
const formLogin = document.getElementById("form-login") || document.querySelector(".login-form");
const msgErro = document.getElementById("msg-erro-login");

if (formLogin && !document.getElementById("form-cadastro")) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("login-email");
    const senhaInput = document.getElementById("login-senha");

    // Se os inputs existirem, realiza a validação no Firebase
    if (emailInput && senhaInput) {
      const email = emailInput.value.trim();
      const senha = senhaInput.value;

      try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "index02.html";
      } catch (error) {
        console.error("Erro no login:", error);
        if (msgErro) {
          msgErro.textContent = "E-mail ou senha incorretos.";
          msgErro.style.display = "block";
        } else {
          alert("E-mail ou senha incorretos.");
        }
      }
    } else {
      // Fallback para caso os inputs não estejam com os IDs configurados
      window.location.href = "index02.html";
    }
  });
}