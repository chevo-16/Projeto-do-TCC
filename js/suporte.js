import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let usuarioAtual = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    usuarioAtual = user;
  } else {
    window.location.href = "index01.html";
  }
});

document.querySelectorAll('.faq-pergunta').forEach((botao) => {
  botao.addEventListener('click', () => {
    const item = botao.parentElement;
    item.classList.toggle('ativo');
  });
});

const formSuporte = document.getElementById('form-suporte');

formSuporte?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!usuarioAtual) return;

  const assunto = document.getElementById('assunto-suporte').value.trim();
  const mensagem = document.getElementById('mensagem-suporte').value.trim();

  try {
    await addDoc(collection(db, "chamados_suporte"), {
      userId: usuarioAtual.uid,
      userEmail: usuarioAtual.email,
      assunto: assunto,
      mensagem: mensagem,
      status: "aberto",
      criadoEm: serverTimestamp()
    });

    alert("Sua mensagem foi enviada com sucesso! Responderemos em breve.");
    formSuporte.reset();
  } catch (error) {
    console.error("Erro ao enviar chamado:", error);
    alert("Falha ao enviar mensagem. Tente novamente.");
  }
});