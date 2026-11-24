import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const produtosMaisVendidosBase = [
  { id: 'fem_v5', tipo: 'vestido', nome: 'Vestido ', preco: '180', img: '../images/feminino/vestido/b53252b2-93bd-4e1b-89c4-03adaee337f5.png', categoria: 'feminino' },
  { id: 'masc_b2', tipo: 'blusa', nome: 'Jaqueta ', preco: '220', img: '../images/masculino/blusas/46c25090-f284-455d-8ee3-703f8c7c8b7e.png', categoria: 'masculino' },
  { id: 'sap_m2', tipo: 'masculino', nome: 'Sapato ', preco: '190', img: '../images/calçados/masculino/9bd99f3e-9a69-423c-aad5-b27f43e21404.png', categoria: 'calcados' },
  { id: 'inf_b2', tipo: 'blusa', nome: 'Jaqueta ', preco: '120', img: '../images/infantil/blusas/323d5876-24cd-4907-8e63-c8bbb0f83b46.png', categoria: 'infantil' },

  { id: 'fem_c1', tipo: 'calca', nome: 'Calça ', preco: '150', img: '../images/feminino/calças/3d486810-c3e9-42f8-8c95-6d2f0f6579b0.png', categoria: 'feminino' },
  { id: 'masc_c1', tipo: 'calca', nome: 'Calça ', preco: '150', img: '../images/masculino/calça/3e4764a2-519e-41ea-9d25-126dfe9b1d9b.png', categoria: 'masculino' },
  { id: 'sap_f2', tipo: 'feminino', nome: 'Sapato ', preco: '180', img: '../images/calçados/feminino/9fbd0299-5580-4d3f-8a9b-838e7002539b.png', categoria: 'calcados' },
  { id: 'inf_v3', tipo: 'vestido', nome: 'Vestido ', preco: '130', img: '../images/infantil/vestidos/67afdac0-5eb2-4759-966f-69c3339ff9ae.png', categoria: 'infantil' },

  { id: 'fem_b1', tipo: 'blusa', nome: 'Blusa ', preco: '90', img: '../images/feminino/blusa/1ecd57b0-92b5-4f6b-9d2e-f3084fa572a7.png', categoria: 'feminino' },
  { id: 'masc_t3', tipo: 'camiseta', nome: 'Camisa ', preco: '110', img: '../images/masculino/camiseta/64e46cbe-342a-4c05-a97b-d38ecbf6d9c4.png', categoria: 'masculino' },
  { id: 'sap_i4', tipo: 'infantil', nome: 'Tênis ', preco: '130', img: '../images/calçados/infantil/908e8f62-4d1f-4dfd-b502-4a12005c4aef.png', categoria: 'calcados_infantil' },
  { id: 'inf_c1', tipo: 'calca', nome: 'Calça ', preco: '85', img: '../images/infantil/calças/0bd36ec5-7d79-4056-b1eb-3c4bf8b2e3da.png', categoria: 'infantil' },

  { id: 'fem_s1', tipo: 'shorts', nome: 'Shorts ', preco: '110', img: '../images/feminino/shorts/1f50825e-e512-47c4-8d22-33f9a37b1514.png', categoria: 'feminino' },
  { id: 'masc_s2', tipo: 'shorts', nome: 'Bermuda ', preco: '125', img: '../images/masculino/shorts/7a4e6540-5362-4665-ae44-7a71c5a992ce.png', categoria: 'masculino' },
  { id: 'sap_m4', tipo: 'masculino', nome: 'Sapatênis ', preco: '160', img: '../images/calçados/masculino/2706a8a0-062b-416b-b4fc-77b426568dfc.png', categoria: 'calcados' },
  { id: 'inf_s1', tipo: 'shorts', nome: 'Shorts ', preco: '65', img: '../images/infantil/shorts/0a673f8a-916d-447a-bdc2-6397ea6c7067.png', categoria: 'infantil' },

  { id: 'fem_v6', tipo: 'vestido', nome: 'Vestido ', preco: '210', img: '../images/feminino/vestido/c7ec3f3d-5535-4a8e-8f3d-48361291dc89.png', categoria: 'feminino' },
  { id: 'masc_b9', tipo: 'blusa', nome: 'Jaqueta ', preco: '190', img: '../images/masculino/blusas/jaqueta1.png', categoria: 'masculino' },
  { id: 'sap_f4', tipo: 'feminino', nome: 'Scarpin ', preco: '195', img: '../images/calçados/feminino/46f861c0-c54e-49be-9b69-06812229c534.png', categoria: 'calcados' },
  { id: 'inf_b5', tipo: 'blusa', nome: 'Jaqueta ', preco: '110', img: '../images/infantil/blusas/61714b26-e7f6-4fe1-89fe-eb9f8dae5cd1.png', categoria: 'infantil' },

  { id: 'fem_c3', tipo: 'calca', nome: 'Calça ', preco: '170', img: '../images/feminino/calças/76e34b98-e5d3-4a7d-882a-b4e4e5233eb8.png', categoria: 'feminino' },
  { id: 'masc_c4', tipo: 'calca', nome: 'Calça ', preco: '180', img: '../images/masculino/calça/1363e689-9af3-4886-ac2a-79f88d156ed3.png', categoria: 'masculino' },
  { id: 'sap_i6', tipo: 'infantil', nome: 'Sapatilha ', preco: '105', img: '../images/calçados/infantil/7054fa50-ea1e-4438-9b96-c00ec0af27cd.png', categoria: 'calcados_infantil' },
  { id: 'inf_v4', tipo: 'vestido', nome: 'Vestido ', preco: '100', img: '../images/infantil/vestidos/259cf7b6-2631-41ad-9758-5afa5c265328 (1).png', categoria: 'infantil' },

  { id: 'fem_b10', tipo: 'blusa', nome: 'Camisa ', preco: '140', img: '../images/feminino/blusa/f3471c72-036c-4540-b249-d08ce2bd8c94.png', categoria: 'feminino' },
  { id: 'masc_t7', tipo: 'camiseta', nome: 'Camiseta ', preco: '95', img: '../images/masculino/camiseta/c34c1e0c-e6a9-4528-a6b2-cf8f98092c98.png', categoria: 'masculino' },
  { id: 'sap_m5', tipo: 'masculino', nome: 'Bota ', preco: '230', img: '../images/calçados/masculino/b1f60fc9-bf54-45b6-9d09-be7db792cc35.png', categoria: 'calcados' },
  { id: 'inf_c5', tipo: 'calca', nome: 'Calça ', preco: '90', img: '../images/infantil/calças/9494fd78-aad0-47b8-9a01-bb8c033c9ec0.png', categoria: 'infantil' },

  { id: 'fem_s4', tipo: 'shorts', nome: 'Shorts ', preco: '140', img: '../images/feminino/shorts/506f88ce-05e7-48b1-89e2-6c01fbf0969a.png', categoria: 'feminino' },
  { id: 'masc_s7', tipo: 'shorts', nome: 'Bermuda ', preco: '130', img: '../images/masculino/shorts/c5a243e1-c544-4a99-982b-0b09f10aa0ae (1).png', categoria: 'masculino' },
  { id: 'sap_f5', tipo: 'feminino', nome: 'Bota ', preco: '280', img: '../images/calçados/feminino/4932ef04-9411-49e5-ab75-0a08cea598c9.png', categoria: 'calcados' },
  { id: 'inf_t3', tipo: 'camiseta', nome: 'Camisa ', preco: '65', img: '../images/infantil/camisetas/9bda485d-698e-4ac1-ae67-9ebed01df95a.png', categoria: 'infantil' },

  { id: 'fem_v10', tipo: 'vestido', nome: 'Vestido ', preco: '190', img: '../images/feminino/vestido/vestido2.png', categoria: 'feminino' },
  { id: 'masc_b1', tipo: 'blusa', nome: 'Blusa ', preco: '160', img: '../images/masculino/blusas/43ca4c30-b52c-427d-a858-99e7f06b9ab8.png', categoria: 'masculino' },
  { id: 'sap_i5', tipo: 'infantil', nome: 'Botinha ', preco: '150', img: '../images/calçados/infantil/5641cbd5-9ab6-486b-9f0e-69606eebeea2.png', categoria: 'calcados_infantil' },
  { id: 'inf_v7', tipo: 'vestido', nome: 'Vestido ', preco: '115', img: '../images/infantil/vestidos/c39d4c76-56ae-4f68-a51c-08791c4cbfb4.png', categoria: 'infantil' },

  { id: 'fem_c6', tipo: 'calca', nome: 'Calça ', preco: '160', img: '../images/feminino/calças/b887f3c3-208d-4492-baa3-3a4c0bdde57e.png', categoria: 'feminino' },
  { id: 'masc_t6', tipo: 'camiseta', nome: 'Camisa ', preco: '140', img: '../images/masculino/camiseta/aeca1b65-e47b-4b3a-9da6-1f5efbfe95ec.png', categoria: 'masculino' },
  { id: 'sap_f1', tipo: 'feminino', nome: 'Bota ', preco: '220', img: '../images/calçados/feminino/6cd0ffa8-7f59-4fed-8a59-f0a3501421d7.png', categoria: 'calcados' },
  { id: 'inf_b1', tipo: 'blusa', nome: 'Casaco ', preco: '95', img: '../images/infantil/blusas/27e56737-8546-4097-a07f-a3e996cec30e.png', categoria: 'infantil' }
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
  renderizarProdutos();

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
    
