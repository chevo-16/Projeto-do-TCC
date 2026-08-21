window.addEventListener("DOMContentLoaded", () => {
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
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "index02.html";
    });
  }

  const formCadastro = document.getElementById("form-cadastro");
  if (formCadastro) {
    formCadastro.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "index02.html";
    });
  }
});

function irParaCadastro() {
  window.location.href = "Cadastro.html";
}

function voltarParaLogin() {
  window.location.href = "index01.html";
}
