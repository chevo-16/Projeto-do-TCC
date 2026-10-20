import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const formCadastro = document.getElementById('form-cadastro');
const msgErro = document.getElementById('msg-erro');

formCadastro.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('cad-nome').value.trim();
  const email = document.getElementById('cad-email').value.trim();
  const senha = document.getElementById('cad-senha').value;
  const confirmarSenha = document.getElementById('cad-confirmar-senha').value;

  // Sua validação de senhas iguais
  if (senha !== confirmarSenha) {
    msgErro.textContent = 'As senhas não coincidem! Verifique e tente novamente.';
    msgErro.style.display = 'block';
    return;
  }

  // Validação mínima de segurança do Firebase (mínimo 6 caracteres)
  if (senha.length < 6) {
    msgErro.textContent = 'A senha precisa ter pelo menos 6 caracteres.';
    msgErro.style.display = 'block';
    return;
  }

  msgErro.style.display = 'none';

  try {
    // 1. Cria a conta no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // 2. Salva o nome do usuário
    await updateProfile(user, { displayName: nome });

    // 3. Salva no banco Firestore com carrinho e curtidas vazios
    await setDoc(doc(db, "usuarios", user.uid), {
      nome: nome,
      email: email,
      carrinho: [],
      curtidas: [],
      compras: []
    });

    // 4. Redireciona para o catálogo
    window.location.href = 'index02.html';

  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    if (error.code === 'auth/email-already-in-use') {
      msgErro.textContent = 'Este e-mail já está cadastrado.';
    } else {
      msgErro.textContent = 'Erro ao realizar o cadastro. Tente novamente.';
    }
    msgErro.style.display = 'block';
  }
});