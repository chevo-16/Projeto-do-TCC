import { auth, fazerLoginGoogle } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

window.entrarComGoogle = fazerLoginGoogle;

window.irParaCadastro = function() {
  window.location.href = "Cadastro.html";
};

window.voltarParaLogin = function() {
  window.location.href = "index01.html";
};

const formLogin = document.getElementById("form-login") || document.querySelector(".login-form");
const msgErro = document.getElementById("msg-erro-login");

if (formLogin && !document.getElementById("form-cadastro")) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("login-email");
    const senhaInput = document.getElementById("login-senha");

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
      window.location.href = "index02.html";
    }
  });
}