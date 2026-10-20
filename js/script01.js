import { auth, googleProvider } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// VERIFICAÇÃO AUTOMÁTICA DE LOGADO
// Se já estiver logado (Google, E-mail, etc.), entra direto no catálogo
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "index02.html";
  }
});

// Função para esconder a splash screen e exibir a tela de login
function iniciarTela() {
  const splashScreen = document.getElementById("splash-screen");
  const loginScreen = document.getElementById("login-screen");

  if (splashScreen && loginScreen) {
    setTimeout(() => {
      splashScreen.classList.add("hidden");
      loginScreen.classList.remove("hidden");
    }, 3000); // 3 segundos na logo
  }

  // Listener do formulário de Login
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

  // Listener para o botão do Google
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

// Executa imediatamente se o DOM já carregou, ou aguarda o evento
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