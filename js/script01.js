import { auth, googleProvider } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { eAdmin } from './admin-config.js';

function direcionarUsuario(user) {
  if (!user) return;

  if (eAdmin(user.email)) {

    window.location.href = "admin.html";
  } else {

    window.location.href = "index02.html";
  }
}

if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    direcionarUsuario(user);
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
      
      const emailInput = formLogin.querySelector('input[type="email"]') || document.getElementById('email');
      const senhaInput = formLogin.querySelector('input[type="password"]') || document.getElementById('senha');

      if (!emailInput || !senhaInput) return;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, senhaInput.value);
        direcionarUsuario(userCredential.user);
      } catch (error) {
        console.error("Erro no login:", error);
        alert("E-mail ou senha incorretos! Se você ainda não tem senha cadastrada, clique no botão Cadastrar-se.");
      }
    });
  }

  const btnGoogle = document.querySelector(".btn-social.google");
  if (btnGoogle) {
    btnGoogle.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        direcionarUsuario(result.user);
      } catch (error) {
        console.error("Erro no login com Google:", error);
        alert("Falha ao entrar com Google.");
      }
    });
  }

  const btnFacebook = document.querySelector(".btn-social.facebook");
  if (btnFacebook) {
    btnFacebook.addEventListener("click", () => {
      alert("O login com Facebook está temporariamente em manutenção. Utilize o login por E-mail ou Google!");
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