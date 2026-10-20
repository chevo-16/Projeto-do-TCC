import { auth, googleProvider } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "index02.html";
  }
});

function iniciarTela() {
  const splashScreen = document.getElementById("splash-screen");
  const loginScreen = document.getElementById("login-screen");

  if (splashScreen && loginScreen) {
    setTimeout(() => {
      splashScreen.classList.add("hidden");
      loginScreen.classList.remove("hidden");
    }, 3000);
  }

  const formLogin = document.querySelector(".login-form");
  if (formLogin && !document.getElementById("form-cadastro")) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const emailInput = formLogin.querySelector('input[type="email"]');
      const senhaInput = formLogin.querySelector('input[type="password"]');

      if (!emailInput || !senhaInput) return;

      try {
        await signInWithEmailAndPassword(auth, emailInput.value, senhaInput.value);
        window.location.href = "index02.html";
      } catch (error) {
        console.error("Erro no login:", error);
        alert("E-mail ou senha incorretos!");
      }
    });
  }

  const btnGoogle = document.querySelector(".btn-social.google");
  if (btnGoogle) {
    btnGoogle.addEventListener("click", async () => {
      try {
        await signInWithPopup(auth, googleProvider);
        window.location.href = "index02.html";
      } catch (error) {
        console.error("Erro no login com Google:", error);
        alert("Falha ao entrar com Google.");
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarTela);
} else {
  iniciarTela();
}

function irParaCadastro() {
  window.location.href = "Cadastro.html";
}

function voltarParaLogin() {
  window.location.href = "index01.html";
}

window.irParaCadastro = irParaCadastro;
window.voltarParaLogin = voltarParaLogin;