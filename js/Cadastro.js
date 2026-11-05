import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
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

        try {
          await setDoc(doc(db, "usuarios", user.uid), {
            nome: nome,
            email: email,
            carrinho: [],
            curtidas: [],
            compras: []
          });
        } catch (firestoreError) {
          console.warn("Aviso: Falhou ao gravar no Firestore:", firestoreError);
        }

        await signOut(auth);

        alert("Cadastro realizado com sucesso! Faça login com seu e-mail e nova senha.");
        window.location.href = 'index01.html';

      } catch (error) {
        console.error("Erro no cadastro:", error.code, error.message);

        if (error.code === 'auth/email-already-in-use') {
          msgErro.textContent = 'Este e-mail já está cadastrado. Se você entrou pelo Google antes, tente fazer login com a senha antiga ou delete a conta no Console.';
        } else if (error.code === 'auth/invalid-email') {
          msgErro.textContent = 'E-mail inválido. Digite um formato correto.';
        } else if (error.code === 'auth/operation-not-allowed') {
          msgErro.textContent = 'O cadastro por e-mail/senha não está ativado no Firebase Console.';
        } else if (error.code === 'auth/weak-password') {
          msgErro.textContent = 'A senha informada é muito fraca.';
        } else {
          msgErro.textContent = `Erro (${error.code || 'desconhecido'}): ${error.message}`;
        }
        msgErro.style.display = 'block';
      }
    });
  }
});

window.voltarParaLogin = function() {
  window.location.href = "index01.html";
};