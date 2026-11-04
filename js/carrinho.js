import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let carrinhoLocal = [];
let uidUsuario = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    uidUsuario = user.uid;
    await carregarCarrinho(uidUsuario);
  } else {
    window.location.href = "../index01.html";
  }
});

async function carregarCarrinho(uid) {
  try {
    const userRef = doc(db, "usuarios", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      carrinhoLocal = userSnap.data().carrinho || [];
      renderizarCarrinho();
    } else {
      renderizarCarrinho();
    }
  } catch (error) {
    console.error("Erro ao carregar carrinho:", error);
    renderizarCarrinho();
  }
}

function formatarTamanhoItem(item) {
  if (item.tamanho) return item.tamanho;
  
  const idStr = String(item.id || '');
  if (idStr.startsWith('sap_i')) return '28';
  if (idStr.startsWith('sap_') || item.categoria === 'calcados') return '40';
  if (idStr.startsWith('inf_') || item.categoria === 'infantil') return '10';
  return 'M';
}

function renderizarCarrinho() {
  const container = document.getElementById("lista-carrinho");
  if (!container) return;
  
  container.innerHTML = "";

  if (carrinhoLocal.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 40px 0; color: #666;">
      <i class="fa-solid fa-cart-flatbed" style="font-size: 48px; color: #ccc; margin-bottom: 12px;"></i>
      <p style="font-size: 16px; font-weight: 500;">Seu carrinho está vazio.</p>
    </div>`;
    atualizarResumo();
    return;
  }

  carrinhoLocal.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item-carrinho";
    
    const tamanhoExibicao = formatarTamanhoItem(item);
    const qtdItem = item.quantidade || 1;
    const precoUnitario = Number(item.preco) || 0;
    const subtotal = (precoUnitario * qtdItem).toFixed(2);

    div.innerHTML = `
      <input type="checkbox" class="chk-item" data-index="${index}" />
      <img src="${item.img}" alt="${item.nome}" />
      <div class="item-detalhes">
        <h4>${item.nome}</h4>
        <div class="item-meta">
          Tamanho: <strong>${tamanhoExibicao}</strong>
        </div>
        <div class="qtd-controle" style="display: flex; align-items: center; gap: 8px; margin: 6px 0;">
          <button type="button" class="btn-qtd-cart btn-menos-cart" data-index="${index}" style="padding: 2px 8px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">-</button>
          <span style="font-weight: bold; font-size: 14px;">${qtdItem}</span>
          <button type="button" class="btn-qtd-cart btn-mais-cart" data-index="${index}" style="padding: 2px 8px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">+</button>
        </div>
        <div class="item-preco">R$ ${subtotal}</div>
      </div>
      <button type="button" class="btn-remover" data-index="${index}" title="Remover produto">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    container.appendChild(div);
  });

  vincularEventosItens();
  atualizarResumo();
}

function vincularEventosItens() {

  document.querySelectorAll(".chk-item").forEach(chk => {
    chk.addEventListener("change", () => atualizarResumo());
  });

  document.querySelectorAll(".btn-remover").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const idx = e.currentTarget.getAttribute("data-index");
      await removerItem(Number(idx));
    });
  });

  document.querySelectorAll(".btn-menos-cart").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const idx = Number(e.currentTarget.getAttribute("data-index"));
      if ((carrinhoLocal[idx].quantidade || 1) > 1) {
        carrinhoLocal[idx].quantidade = (carrinhoLocal[idx].quantidade || 1) - 1;
        await salvarCarrinhoNoBanco();
        renderizarCarrinho();
      }
    });
  });

  document.querySelectorAll(".btn-mais-cart").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const idx = Number(e.currentTarget.getAttribute("data-index"));
      carrinhoLocal[idx].quantidade = (carrinhoLocal[idx].quantidade || 1) + 1;
      await salvarCarrinhoNoBanco();
      renderizarCarrinho();
    });
  });
}

function atualizarResumo() {
  const checkboxes = document.querySelectorAll(".chk-item");
  let total = 0;
  let selecionadosCount = 0;

  checkboxes.forEach((chk) => {
    if (chk.checked) {
      const idx = chk.getAttribute("data-index");
      const item = carrinhoLocal[idx];
      if (item) {
        const qtd = item.quantidade || 1;
        total += (Number(item.preco) || 0) * qtd;
        selecionadosCount++;
      }
    }
  });

  const totalEl = document.getElementById("valor-total-carrinho");
  if (totalEl) {
    totalEl.textContent = `R$ ${total.toFixed(2)}`;
  }

  const btnComprar = document.getElementById("btn-finalizar-compra");
  if (btnComprar) {
    btnComprar.textContent = `Comprar Selecionados (${selecionadosCount})`;
    btnComprar.disabled = selecionadosCount === 0;
  }
}

async function removerItem(index) {
  carrinhoLocal.splice(index, 1);
  await salvarCarrinhoNoBanco();
  renderizarCarrinho();
}

async function salvarCarrinhoNoBanco() {
  if (!uidUsuario) return;
  try {
    const userRef = doc(db, "usuarios", uidUsuario);
    await setDoc(userRef, { carrinho: carrinhoLocal }, { merge: true });
  } catch (error) {
    console.error("Erro ao salvar carrinho no Firestore:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const chkSelectAll = document.getElementById("select-all");
  if (chkSelectAll) {
    chkSelectAll.addEventListener("change", (e) => {
      const checked = e.target.checked;
      document.querySelectorAll(".chk-item").forEach(chk => {
        chk.checked = checked;
      });
      atualizarResumo();
    });
  }
});