import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let usuarioAtual = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    usuarioAtual = user;
    carregarEnderecos();
  } else {
    window.location.href = "index01.html";
  }
});

const btnAbrirForm = document.getElementById('btn-abrir-form');
const btnFecharForm = document.getElementById('btn-fechar-form');
const containerForm = document.getElementById('container-form');
const formEndereco = document.getElementById('form-endereco');
const inputCep = document.getElementById('cep');

btnAbrirForm?.addEventListener('click', () => containerForm.classList.remove('hidden'));
btnFecharForm?.addEventListener('click', () => containerForm.classList.add('hidden'));

inputCep?.addEventListener('blur', async () => {
  const cepLimpo = inputCep.value.replace(/\D/g, '');
  if (cepLimpo.length === 8) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (!data.erro) {
        document.getElementById('logradouro').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
        document.getElementById('numero').focus();
      } else {
        alert("CEP não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  }
});

formEndereco?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!usuarioAtual) return;

  const ePadraoChecked = document.getElementById('endereco-padrao').checked;

  if (ePadraoChecked) {
    await removerPadraoDeTodos();
  }

  const novoEndereco = {
    userId: usuarioAtual.uid,
    cep: inputCep.value.trim(),
    logradouro: document.getElementById('logradouro').value.trim(),
    numero: document.getElementById('numero').value.trim(),
    complemento: document.getElementById('complemento').value.trim(),
    bairro: document.getElementById('bairro').value.trim(),
    cidade: document.getElementById('cidade').value.trim(),
    estado: document.getElementById('estado').value.trim(),
    referencia: document.getElementById('referencia').value.trim(),
    ePadrao: ePadraoChecked
  };

  try {
    await addDoc(collection(db, "enderecos"), novoEndereco);
    formEndereco.reset();
    containerForm.classList.add('hidden');
    carregarEnderecos();
  } catch (error) {
    console.error("Erro ao salvar endereço:", error);
    alert("Falha ao salvar o endereço.");
  }
});

async function removerPadraoDeTodos() {
  const q = query(collection(db, "enderecos"), where("userId", "==", usuarioAtual.uid));
  const snapshot = await getDocs(q);
  const promessas = [];

  snapshot.forEach((docSnap) => {
    if (docSnap.data().ePadrao) {
      promessas.push(updateDoc(doc(db, "enderecos", docSnap.id), { ePadrao: false }));
    }
  });

  await Promise.all(promessas);
}

async function carregarEnderecos() {
  const listaContainer = document.getElementById('lista-enderecos');
  
  try {
    const q = query(collection(db, "enderecos"), where("userId", "==", usuarioAtual.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      listaContainer.innerHTML = `<p style="text-align:center; color:#777;">Nenhum endereço cadastrado ainda.</p>`;
      return;
    }

    listaContainer.innerHTML = '';

    if (snapshot.docs.length === 1 && !snapshot.docs[0].data().ePadrao) {
      await updateDoc(doc(db, "enderecos", snapshot.docs[0].id), { ePadrao: true });
      carregarEnderecos();
      return;
    }

    snapshot.forEach((documento) => {
      const end = documento.data();
      const id = documento.id;

      const card = document.createElement('div');
      card.className = `card-endereco ${end.ePadrao ? 'padrao' : ''}`;

      card.innerHTML = `
        ${end.ePadrao ? '<span class="badge-padrao">Padrão</span>' : ''}
        <p class="endereco-texto">
          <strong>${end.logradouro}, ${end.numero}</strong> ${end.complemento ? ' - ' + end.complemento : ''}<br>
          ${end.bairro} - ${end.cidade}/${end.estado}<br>
          CEP: ${end.cep}
          ${end.referencia ? `<br><small style="color:#777;">Ref: ${end.referencia}</small>` : ''}
        </p>
        
        <div style="margin-top: 10px; display: flex; gap: 10px; align-items: center;">
          ${!end.ePadrao ? `<button class="btn-definir-padrao" onclick="definirComoPadrao('${id}')">Definir como padrão</button>` : ''}
        </div>

        <button class="btn-deletar" onclick="deletarEndereco('${id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;

      listaContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar endereços:", error);
  }
}
window.definirComoPadrao = async (id) => {
  try {
    await removerPadraoDeTodos();
    await updateDoc(doc(db, "enderecos", id), { ePadrao: true });
    carregarEnderecos();
  } catch (error) {
    console.error("Erro ao definir padrão:", error);
  }
};

window.deletarEndereco = async (id) => {
  if (confirm("Tem certeza que deseja remover este endereço?")) {
    try {
      await deleteDoc(doc(db, "enderecos", id));
      carregarEnderecos();
    } catch (error) {
      console.error("Erro ao deletar endereço:", error);
    }
  }
};
