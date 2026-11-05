import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userAvatarElement = document.getElementById('user-avatar');

    userNameElement.textContent = user.displayName || 'Usuário';
    userEmailElement.textContent = user.email || '';

    if (user.photoURL) {
      userAvatarElement.src = user.photoURL;
    }
  } else {

    window.location.href = "index01.html";
  }
});

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('btn-editar')?.addEventListener('click', () => {
    const novoNome = prompt("Digite o novo nome de usuário:");
    if (novoNome && novoNome.trim() !== "") {
      document.getElementById('user-name').textContent = novoNome;
      alert("Perfil atualizado localmente!");
    }
  });

  document.getElementById('btn-pedidos')?.addEventListener('click', () => {
    window.location.href = "pedidos.html";
  });

  document.getElementById('btn-enderecos')?.addEventListener('click', () => {
    window.location.href = "enderecos.html";
  });

  document.getElementById('btn-favoritos')?.addEventListener('click', () => {
    window.location.href = "favoritos.html";
  });

  document.getElementById('btn-pagamentos')?.addEventListener('click', () => {
    window.location.href = "pagamentos.html";
  });

  document.getElementById('btn-suporte')?.addEventListener('click', () => {
    window.location.href = "suporte.html";
  });

  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    try {
      await signOut(auth);
      window.location.href = "index01.html";
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
      alert("Não foi possível sair no momento.");
    }
  });

});