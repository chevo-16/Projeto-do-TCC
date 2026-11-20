import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { todosProdutos as produtosFeminino } from './feminino.js';
import { todosProdutos as produtosMasculino } from './masculino.js';
import { todosProdutos as produtosCalcados } from './calcados.js';
import { todosProdutos as produtosInfantil } from './infantil.js';

const produtosMaisVendidosBase = [
  ...produtosFeminino,
  ...produtosMasculino,
  ...produtosCalcados,
  ...produtosInfantil
];

let produtosExibidos = [...produtosMaisVendidosBase];
let identificadorUsuario = null;
let curtidasUsuario = [];
let carrinhoUsuario = [];

onAuthStateChanged(auth, async (usuario) => {
  if (usuario) {
    identificadorUsuario = usuario.uid;
    await carregarEstadoUsuario(identificadorUsuario);
  } else {
    await carregarProdutosFirebase();
  }
});

async function carregarProdutosFirebase() {
  try {
    const consultaProdutos = await getDocs(collection(db, "produtos"));
    const produtosFirebase = [];

    consultaProdutos.forEach((documento) => {
      produtosFirebase.push({
        id: documento.id,
        ...documento.data()
      });
    });

    produtosExibidos = [...produtosFirebase, ...produtosMaisVendidosBase];
    renderizarProdutos();
  } catch (erro) {
    console.error("Erro ao carregar produtos do Firebase:", erro);
    produtosExibidos = [...produtosMaisVendidosBase];
    renderizarProdutos();
  }
}

async function carregarEstadoUsuario(identificador) {
  try {
    const referenciaUsuario = doc(db, "usuarios", identificador);
    const documentoUsuario = await getDoc(referenciaUsuario);

    if (documentoUsuario.exists()) {
      const dadosUsuario = documentoUsuario.data();
      curtidasUsuario = dadosUsuario.curtidas || [];
      carrinhoUsuario = dadosUsuario.carrinho || [];
    }
    await carregarProdutosFirebase();
  } catch (erro) {
    console.error("Erro ao carregar dados do usuário:", erro);
    await carregarProdutosFirebase();
  }
}

function obterOpcoesTamanho(produto) {
  const codigoProduto = String(produto.id || '').toLowerCase();
  const categoriaProduto = String(produto.categoria || '').toLowerCase();

  if (codigoProduto.startsWith('sap_i') || categoriaProduto === 'calcados_infantil') {
    return ['22', '24', '26', '28', '30', '32', '34', '36'];
  } else if (codigoProduto.startsWith('sap_') || categoriaProduto === 'calcados') {
    return ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
  } else if (codigoProduto.startsWith('inf_') || categoriaProduto === 'infantil') {
    return ['2', '4', '6', '8', '10', '12', '14', '16'];
  } else {
    return ['P', 'M', 'G', 'GG'];
  }
}

function renderizarProdutos() {
  const gradeProdutos = document.getElementById("main-product-grid");
  if (!gradeProdutos) return;
  gradeProdutos.innerHTML = "";

  const codigosCurtidas = curtidasUsuario.map(item => typeof item === 'object' ? item.id : item);
  const codigosCarrinho = carrinhoUsuario.map(item => typeof item === 'object' ? item.id : item);

  produtosExibidos.forEach(produto => {
    const estaCurtido = codigosCurtidas.includes(produto.id);
    const estaNoCarrinho = codigosCarrinho.includes(produto.id);
    const estaEsgotado = produto.esgotado === true;

    const cartaoProduto = document.createElement("div");
    cartaoProduto.className = `product-card ${estaEsgotado ? 'produto-esgotado' : ''}`;
    cartaoProduto.setAttribute("data-id", produto.id);

    cartaoProduto.innerHTML = `
      <div class="img-container" style="cursor: ${estaEsgotado ? 'not-allowed' : 'pointer'}; position: relative;">
        <img src="${produto.img}" alt="${produto.nome}" style="${estaEsgotado ? 'filter: grayscale(80%); opacity: 0.6;' : ''}" />
        ${estaEsgotado ? '<span style="position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: bold;">Esgotado</span>' : ''}
      </div>
      <div class="card-content-bottom">
        <div class="product-info">
          <span class="p-title">${produto.nome}</span>
          <span class="p-price">R$ ${Number(produto.preco).toFixed(2)}</span>
        </div>
        <div class="card-actions">
          <button type="button" class="btn-fav ${estaCurtido ? 'favoritado' : ''}" title="Favoritar">
            <i class="${estaCurtido ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}" ${estaCurtido ? 'style="color: #38a11e;"' : ''}></i>
          </button>
          <button type="button" class="btn-cart ${estaNoCarrinho ? 'no-carrinho' : ''}" ${estaEsgotado ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} title="${estaEsgotado ? 'Produto Esgotado' : 'Carrinho'}">
            <i class="fa-solid ${estaNoCarrinho ? 'fa-check' : 'fa-cart-shopping'}" ${estaNoCarrinho ? 'style="color: #38a11e;"' : ''}></i>
          </button>
        </div>
      </div>
    `;

    const caixaImagem = cartaoProduto.querySelector(".img-container");
    caixaImagem.addEventListener("click", () => {
      if (estaEsgotado) {
        alert("Este produto está esgotado no momento.");
        return;
      }
      abrirModalSelecao(produto);
    });

    const botaoFavoritar = cartaoProduto.querySelector(".btn-fav");
    botaoFavoritar.addEventListener("click", (evento) => {
      evento.stopPropagation();
      alternarFavorito(produto, botaoFavoritar);
    });

    const botaoCarrinho = cartaoProduto.querySelector(".btn-cart");
    botaoCarrinho.addEventListener("click", (evento) => {
      evento.stopPropagation();
      if (estaEsgotado) return;
      abrirModalSelecao(produto);
    });

    gradeProdutos.appendChild(cartaoProduto);
  });
}

function abrirModalSelecao(produto) {
  const janelaModal = document.getElementById("modal-produto");
  if (!janelaModal) return;

  const listaTamanhos = obterOpcoesTamanho(produto);
  let tamanhoSelecionado = listaTamanhos[0];
  let quantidade = 1;

  document.getElementById("modal-p-img").src = produto.img;
  document.getElementById("modal-p-nome").textContent = produto.nome;
  document.getElementById("modal-p-preco").textContent = `R$ ${Number(produto.preco).toFixed(2)}`;
  document.getElementById("modal-p-qtd").textContent = quantidade;

  const gradeTamanhos = document.getElementById("modal-p-tamanhos");
  gradeTamanhos.innerHTML = "";

  listaTamanhos.forEach(tamanho => {
    const botaoTamanho = document.createElement("button");
    botaoTamanho.type = "button";
    botaoTamanho.className = `btn-tamanho ${tamanho === tamanhoSelecionado ? 'active' : ''}`;
    botaoTamanho.textContent = tamanho;
    botaoTamanho.onclick = () => {
      document.querySelectorAll(".btn-tamanho").forEach(botao => botao.classList.remove("active"));
      botaoTamanho.classList.add("active");
      tamanhoSelecionado = tamanho;
    };
    gradeTamanhos.appendChild(botaoTamanho);
  });

  document.getElementById("btn-qtd-menos").onclick = () => {
    if (quantidade > 1) {
      quantidade--;
      document.getElementById("modal-p-qtd").textContent = quantidade;
    }
  };

  document.getElementById("btn-qtd-mais").onclick = () => {
    quantidade++;
    document.getElementById("modal-p-qtd").textContent = quantidade;
  };

  document.getElementById("btn-confirmar-carrinho").onclick = async () => {
    if (!identificadorUsuario) {
      alert("Por favor, faça login para adicionar ao carrinho.");
      return;
    }

    const itemCarrinho = {
      ...produto,
      tamanho: tamanhoSelecionado,
      quantidade: quantidade,
      dataAdicionado: new Date().toISOString()
    };

    carrinhoUsuario = carrinhoUsuario.filter(item => (typeof item === 'object' ? item.id : item) !== produto.id);
    carrinhoUsuario.push(itemCarrinho);

    try {
      const referenciaUsuario = doc(db, "usuarios", identificadorUsuario);
      await setDoc(referenciaUsuario, { carrinho: carrinhoUsuario }, { merge: true });
      renderizarProdutos();
      janelaModal.classList.add("hidden");
    } catch (erro) {
      console.error("Erro ao adicionar produto ao carrinho:", erro);
    }
  };

  const botaoFecharModal = document.getElementById("btn-close-produto");
  if (botaoFecharModal) {
    botaoFecharModal.onclick = () => janelaModal.classList.add("hidden");
  }

  janelaModal.classList.remove("hidden");
}

async function alternarFavorito(produto, botaoFavoritar) {
  if (!identificadorUsuario) return;

  const iconeCoracao = botaoFavoritar.querySelector("i");
  const estaCurtido = botaoFavoritar.classList.contains("favoritado");

  if (estaCurtido) {
    botaoFavoritar.classList.remove("favoritado");
    iconeCoracao.className = "fa-regular fa-heart";
    iconeCoracao.style.color = "";
    curtidasUsuario = curtidasUsuario.filter(item => (typeof item === 'object' ? item.id : item) !== produto.id);
  } else {
    botaoFavoritar.classList.add("favoritado");
    iconeCoracao.className = "fa-solid fa-heart";
    iconeCoracao.style.color = "#38a11e";
    curtidasUsuario.push(produto);
  }

  try {
    const referenciaUsuario = doc(db, "usuarios", identificadorUsuario);
    await setDoc(referenciaUsuario, { curtidas: curtidasUsuario }, { merge: true });
  } catch (erro) {
    console.error("Erro ao sincronizar favoritos no banco:", erro);
  }
}

function iniciarInterface() {
  const botaoAbrirCategorias = document.getElementById("btn-open-cat");
  const botaoFecharCategorias = document.getElementById("btn-close-cat");
  const modalCategorias = document.getElementById("modal-categorias");

  if (botaoAbrirCategorias && modalCategorias) {
    botaoAbrirCategorias.addEventListener("click", (evento) => {
      evento.preventDefault();
      modalCategorias.classList.remove("hidden");
    });
  }

  if (botaoFecharCategorias && modalCategorias) {
    botaoFecharCategorias.addEventListener("click", () => {
      modalCategorias.classList.add("hidden");
    });
  }

  if (modalCategorias) {
    modalCategorias.addEventListener("click", (evento) => {
      if (evento.target === modalCategorias) modalCategorias.classList.add("hidden");
    });
  }

  const cartaoSuperior = document.querySelector(".side-card:nth-child(1)");
  const cartaoInferior = document.querySelector(".side-card:nth-child(2)");
  const imagemSuperior = document.getElementById("side-img-1");
  const imagemInferior = document.getElementById("side-img-2");

  let bannerFirebaseAtivo = false;

  onSnapshot(doc(db, "configuracoes", "carrossel"), (documentoCarrossel) => {
    if (documentoCarrossel.exists()) {
      const dadosCarrossel = documentoCarrossel.data();
      if (dadosCarrossel.banners && dadosCarrossel.banners.length >= 2) {
        bannerFirebaseAtivo = true;
        if (imagemSuperior && dadosCarrossel.banners[0]) imagemSuperior.src = dadosCarrossel.banners[0];
        if (imagemInferior && dadosCarrossel.banners[1]) imagemInferior.src = dadosCarrossel.banners[1];
      }
    }
  });

  const bannersSuperiores = [
    { img: "../images/feminino/vestido/b53252b2-93bd-4e1b-89c4-03adaee337f5.png", bg: "linear-gradient(90deg, #369374 0%, #FC78E1 100%)" },
    { img: "../images/masculino/blusas/46c25090-f284-455d-8ee3-703f8c7c8b7e.png", bg: "linear-gradient(90deg, #369374 0%, #0866FF 100%)" }
  ];

  const bannersInferiores = [
    { img: "../images/calçados/masculino/9bd99f3e-9a69-423c-aad5-b27f43e21404.png", bg: "linear-gradient(90deg, #369374 0%, #4ade80 100%)" },
    { img: "../images/calçados/infantil/7054fa50-ea1e-4438-9b96-c00ec0af27cd.png", bg: "linear-gradient(90deg, #369374 0%, #FC78E1 50%, #38bdf8 100%)" }
  ];

  let indiceAtual = 0;

  if (cartaoSuperior && cartaoInferior) {
    setInterval(() => {
      if (imagemSuperior) imagemSuperior.classList.add("fade-out");
      if (imagemInferior) imagemInferior.classList.add("fade-out");

      setTimeout(() => {
        indiceAtual = (indiceAtual + 1) % bannersSuperiores.length;

        cartaoSuperior.style.background = bannersSuperiores[indiceAtual].bg;
        cartaoInferior.style.background = bannersInferiores[indiceAtual].bg;

        if (!bannerFirebaseAtivo) {
          if (imagemSuperior) imagemSuperior.src = bannersSuperiores[indiceAtual].img;
          if (imagemInferior) imagemInferior.src = bannersInferiores[indiceAtual].img;
        }

        if (imagemSuperior) imagemSuperior.classList.remove("fade-out");
        if (imagemInferior) imagemInferior.classList.remove("fade-out");
      }, 400);
    }, 3000);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarInterface);
} else {
  iniciarInterface();
}
