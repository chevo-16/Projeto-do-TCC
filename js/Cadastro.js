import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById('form-cadastro');
  const msgErro = document.getElementById('msg-erro');

  if (formCadastro) {
    formCadastro.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nome = document.getElementById('cad-nome').value.trim();
      const email = document.getElementById('cad-email').value.trim();
      const senha = document.getElementById('cad-senha').value;
      const confirmarSenha = document.getElementById('cad-confirmar-senha').value;

      if (senha !== confirmarSenha) {
        msgErro.textContent = 'As senhas não coincidem! Verifique e tente novamente.';
        msgErro.style.display = 'block';
        return;
      }

      if (senha.length < 6) {
        msgErro.textContent = 'A senha precisa ter pelo menos 6 caracteres.';
        msgErro.style.display = 'block';
        return;
      }

      msgErro.style.display = 'none';

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        await updateProfile(user, { displayName: nome });

        await setDoc(doc(db, "usuarios", user.uid), {
          nome: nome,
          email: email,
          carrinho: [],
          curtidas: [],
          compras: []
        });

        window.location.href = 'index02.html';

      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        if (error.code === 'auth/email-already-in-use') {
          msgErro.textContent = 'Este e-mail já está cadastrado.';
        } else if (error.code === 'auth/invalid-email') {
          msgErro.textContent = 'E-mail inválido. Digite um formato correto.';
        } else {
          msgErro.textContent = 'Erro ao realizar o cadastro. Tente novamente.';
        }
        msgErro.style.display = 'block';
      }
    });
  }
});

window.voltarParaLogin = function() {
  window.location.href = "index01.html";
};