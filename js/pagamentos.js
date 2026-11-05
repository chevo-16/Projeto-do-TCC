import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, getDocs, doc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let usuarioAtual = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    usuarioAtual = user;
    carregarCartoes();
  } else {
    window.location.href = "index01.html";
  }
});

const btnAbrir = document.getElementById('btn-abrir-cartao');
const btnFechar = document.getElementById('btn-fechar-cartao');
const containerForm = document.getElementById('container-form-cartao');
const formCartao = document.getElementById('form-cartao');

btnAbrir?.addEventListener('click', () => containerForm.classList.remove('hidden'));
btnFechar?.addEventListener('click', () => containerForm.classList.add('hidden'));

document.getElementById('numero-cartao')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  v = v.replace(/(\d{4})/g, '$1 ').trim();
  e.target.value = v;
});

document.getElementById('validade-cartao')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2,4);
  e.target.value = v;
});

formCartao?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!usuarioAtual) return;

  const numCompleto = document.getElementById('numero-cartao').value.replace(/\s/g, '');
  const ultimosDigitos = numCompleto.slice(-4);

  const novoCartao = {
    userId: usuarioAtual.uid,
    finalNumero: ultimosDigitos,
    nomeTitular: document.getElementById('nome-cartao').value.trim().toUpperCase(),
    validade: document.getElementById('validade-cartao').value.trim()
  };

  try {
    await addDoc(collection(db, "cartoes"), novoCartao);
    formCartao.reset();
    containerForm.classList.add('hidden');
    carregarCartoes();
  } catch (error) {
    console.error("Erro ao salvar cartão:", error);
    alert("Erro ao cadastrar o cartão.");
  }
});

async function carregarCartoes() {
  const container = document.getElementById('lista-cartoes');

  try {
    const q = query(collection(db, "cartoes"), where("userId", "==", usuarioAtual.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = `<p style="text-align:center; color:#777; font-size:0.85rem;">Nenhum cartão cadastrado.</p>`;
      return;
    }

    container.innerHTML = '';

    snapshot.forEach((documento) => {
      const c = documento.data();
      const id = documento.id;

      const card = document.createElement('div');
      card.className = 'card-cartao-salvo';

      card.innerHTML = `
        <div class="cartao-topo">
          <i class="fa-solid fa-credit-card"></i>
          <button class="btn-deletar-cartao" onclick="deletarCartao('${id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <div class="cartao-numero">•••• •••• •••• ${c.finalNumero}</div>
        <div class="cartao-rodape">
          <span>${c.nomeTitular}</span>
          <span>Val: ${c.validade}</span>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar cartões:", error);
  }
}

window.deletarCartao = async (id) => {
  if (confirm("Deseja remover este cartão de crédito?")) {
    try {
      await deleteDoc(doc(db, "cartoes", id));
      carregarCartoes();
    } catch (error) {
      console.error("Erro ao deletar cartão:", error);
    }
  }
};