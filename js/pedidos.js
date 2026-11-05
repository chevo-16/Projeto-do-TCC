import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    escutarPedidosEmTempoReal(user.uid);
  } else {
    window.location.href = "index01.html";
  }
});

function escutarPedidosEmTempoReal(userId) {
  const container = document.getElementById('lista-pedidos');

  const q = query(
    collection(db, "pedidos"), 
    where("uidCliente", "==", userId)
  );

  onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      container.innerHTML = `<p style="text-align:center; color:#777; margin-top:20px;">Você ainda não possui nenhum pedido feito.</p>`;
      return;
    }

    container.innerHTML = "";
    let temPedidoAtivo = false;

    querySnapshot.forEach((docSnap) => {
      const pedido = docSnap.data();
      const id = docSnap.id;
      const st = (pedido.status || '').toLowerCase();

      // OCULTA OS PEDIDOS CANCELADOS DA TELA DO CLIENTE
      if (st === 'cancelado') {
        return;
      }

      temPedidoAtivo = true;
      const card = criarCardPedido(id, pedido);
      container.appendChild(card);
    });

    if (!temPedidoAtivo) {
      container.innerHTML = `<p style="text-align:center; color:#777; margin-top:20px;">Você não possui nenhum pedido ativo no momento.</p>`;
    }

  }, (error) => {
    console.error("Erro ao escutar pedidos em tempo real:", error);
    container.innerHTML = `<p style="color:red; text-align:center;">Erro ao carregar pedidos.</p>`;
  });
}

function criarCardPedido(id, pedido) {
  const card = document.createElement('div');
  card.className = 'card-pedido';

  let statusClasse = 'status-analise';
  let statusTexto = 'Aguardando Confirmação';

  const st = (pedido.status || '').toLowerCase();

  if (st === 'preparando') {
    statusClasse = 'status-preparando';
    statusTexto = 'Loja Preparando';
  } else if (st === 'enviado') {
    statusClasse = 'status-enviado';
    statusTexto = 'A Caminho';
  } else if (st === 'entregue') {
    statusClasse = 'status-entregue';
    statusTexto = 'Entregue';
  }

  const itensHTML = (pedido.itens || []).map(item => {
    const quantidade = item.quantidade || item.qtd || 1;
    const preco = Number(item.preco) || 0;
    return `
      <div class="item-linha">
        <span>${quantidade}x ${item.nome}</span>
        <span>R$ ${(preco * quantidade).toFixed(2)}</span>
      </div>
    `;
  }).join('');

  const podeCancelar = st === 'pendente' || st === 'aguardando confirmação' || st === '' || st === 'preparando';

  card.innerHTML = `
    <div class="pedido-topo">
      <span class="pedido-id">Pedido #${id.slice(0, 6)}</span>
      <span class="status-badge ${statusClasse}">${statusTexto}</span>
    </div>

    <div class="pedido-itens">
      ${itensHTML}
    </div>

    <div class="previsao-entrega">
      <i class="fa-solid fa-truck-fast"></i>
      <span>Chega até: ${pedido.previsaoEntrega || 'Calculando...'}</span>
    </div>

    <div class="pedido-total">
      Total: R$ ${Number(pedido.total || 0).toFixed(2)}
    </div>

    ${podeCancelar ? `
      <button type="button" class="btn-cancelar-pedido" style="background-color: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-top: 10px; width: 100%; font-weight: bold;" onclick="cancelarPedido('${id}')">
        Cancelar Pedido
      </button>
    ` : ''}
  `;

  return card;
}

window.cancelarPedido = async (id) => {
  if (confirm("Tem certeza de que deseja cancelar este pedido?")) {
    try {
      await updateDoc(doc(db, "pedidos", id), {
        status: "Cancelado",
        concluido: true
      });
      alert("Pedido cancelado com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      alert("Erro ao tentar cancelar o pedido.");
    }
  }
};

window.voltarParaPerfil = function() {
  window.location.href = "perfil.html";
};