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

function abrirHTML2() {
  window.location.href = "index02.html";
}

function irParaCadastro() {
  window.location.href = "index03.html";
}

function finalizarCadastro() {
  window.location.href = "index02.html";
}

function voltarParaLogin() {
  window.location.href = "index01.html";
}
