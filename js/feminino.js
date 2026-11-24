import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export const todosProdutos = [
  { id: 'fem_v1', tipo: 'vestido', nome: 'Vestido ', preco: '150', img: '../images/feminino/vestido/2ab05ce1-a652-49e0-a775-00e7b8e6ca2e.png', categoria: 'feminino' },
  { id: 'fem_v2', tipo: 'vestido', nome: 'Vestido ', preco: '150', img: '../images/feminino/vestido/9eb5d0fa-933a-4493-97de-fddae96171d0.png', categoria: 'feminino' },
  { id: 'fem_v3', tipo: 'vestido', nome: 'Vestido', preco: '160', img: '../images/feminino/vestido/9f443dff-2c2c-48c3-9b36-e7a005ed743b.png', categoria: 'feminino' },
  { id: 'fem_v4', tipo: 'vestido', nome: 'Vestido ', preco: '135', img: '../images/feminino/vestido/312eecdb-1172-416d-b227-52cb1433befd.png', categoria: 'feminino' },
  { id: 'fem_v5', tipo: 'vestido', nome: 'Vestido ', preco: '180', img: '../images/feminino/vestido/b53252b2-93bd-4e1b-89c4-03adaee337f5.png', categoria: 'feminino' },
  { id: 'fem_v6', tipo: 'vestido', nome: 'Vestido ', preco: '210', img: '../images/feminino/vestido/c7ec3f3d-5535-4a8e-8f3d-48361291dc89.png', categoria: 'feminino' },
  { id: 'fem_v7', tipo: 'vestido', nome: 'Vestido ', preco: '115', img: '../images/feminino/vestido/e6b3c8b6-d762-4118-8eb1-3d6f72cad316.png', categoria: 'feminino' },
  { id: 'fem_v8', tipo: 'vestido', nome: 'Vestido ', preco: '140', img: '../images/feminino/vestido/e7c020f1-33f1-47f9-8c1c-f1b3b1ff48ba.png', categoria: 'feminino' },
  { id: 'fem_v9', tipo: 'vestido', nome: 'Vestido ', preco: '145', img: '../images/feminino/vestido/vestido.png', categoria: 'feminino' },
  { id: 'fem_v10', tipo: 'vestido', nome: 'Vestido ', preco: '190', img: '../images/feminino/vestido/vestido2.png', categoria: 'feminino' },

  { id: 'fem_c1', tipo: 'calca', nome: 'Calça ', preco: '150', img: '../images/feminino/calças/3d486810-c3e9-42f8-8c95-6d2f0f6579b0.png', categoria: 'feminino' },
  { id: 'fem_c2', tipo: 'calca', nome: 'Calça ', preco: '140', img: '../images/feminino/calças/8b798451-168d-45bc-9f87-21be694b8992.png', categoria: 'feminino' },
  { id: 'fem_c3', tipo: 'calca', nome: 'Calça ', preco: '170', img: '../images/feminino/calças/76e34b98-e5d3-4a7d-882a-b4e4e5233eb8.png', categoria: 'feminino' },
  { id: 'fem_c4', tipo: 'calca', nome: 'Calça ', preco: '125', img: '../images/feminino/calças/0435d6c4-0e07-429f-a5ea-3250f35b3d15.png', categoria: 'feminino' },
  { id: 'fem_c5', tipo: 'calca', nome: 'Calça ', preco: '90', img: '../images/feminino/calças/aeef7f50-3f80-4b73-9d3e-959bc3dfd45b.png', categoria: 'feminino' },
  { id: 'fem_c6', tipo: 'calca', nome: 'Calça ', preco: '160', img: '../images/feminino/calças/b887f3c3-208d-4492-baa3-3a4c0bdde57e.png', categoria: 'feminino' },
  { id: 'fem_c7', tipo: 'calca', nome: 'Calça ', preco: '155', img: '../images/feminino/calças/c9dec70e-7bac-4cc8-ba42-c799f79f8fe4.png', categoria: 'feminino' },
  { id: 'fem_c8', tipo: 'calca', nome: 'Calça ', preco: '145', img: '../images/feminino/calças/cdf5b993-3931-4f43-97f3-93f760c5bbff.png', categoria: 'feminino' },
  { id: 'fem_c9', tipo: 'calca', nome: 'Calça ', preco: '130', img: '../images/feminino/calças/dd4632c8-7af8-4a09-b1e9-34166bf4c262.png', categoria: 'feminino' },
  { id: 'fem_c10', tipo: 'calca', nome: 'Calça ', preco: '150', img: '../images/feminino/calças/e2890da2-b2ef-44bf-b8dd-1e9756555d03.png', categoria: 'feminino' },

  { id: 'fem_b1', tipo: 'blusa', nome: 'Blusa ', preco: '90', img: '../images/feminino/blusa/1ecd57b0-92b5-4f6b-9d2e-f3084fa572a7.png', categoria: 'feminino' },
  { id: 'fem_b2', tipo: 'blusa', nome: 'Blusa ', preco: '70', img: '../images/feminino/blusa/7fc9d90a-86db-4b9f-acef-2f9cd8f5987d.png', categoria: 'feminino' },
  { id: 'fem_b3', tipo: 'blusa', nome: 'Blusa ', preco: '85', img: '../images/feminino/blusa/8e53ab14-030b-4f92-b2f8-33edcff467eb.png', categoria: 'feminino' },
  { id: 'fem_b4', tipo: 'blusa', nome: 'Blusa ', preco: '130', img: '../images/feminino/blusa/9e2c7737-0c92-439b-86d2-a1b2c6d02eae.png', categoria: 'feminino' },
  { id: 'fem_b5', tipo: 'blusa', nome: 'Blusa ', preco: '60', img: '../images/feminino/blusa/9f803d1f-aff2-4506-bab1-e749d47e0c83.png', categoria: 'feminino' },
  { id: 'fem_b6', tipo: 'blusa', nome: 'Blusa ', preco: '95', img: '../images/feminino/blusa/773dfff9-a5e0-4634-8253-77d7e27e0fb9.png', categoria: 'feminino' },
  { id: 'fem_b7', tipo: 'blusa', nome: 'Blusa ', preco: '100', img: '../images/feminino/blusa/63055f0c-07ce-4884-8f79-0fca7159ce77.png', categoria: 'feminino' },
  { id: 'fem_b8', tipo: 'blusa', nome: 'Blusa ', preco: '110', img: '../images/feminino/blusa/ad01f097-1391-4996-b201-9ebd5a3d9cb2.png', categoria: 'feminino' },
  { id: 'fem_b9', tipo: 'blusa', nome: 'Blusa ', preco: '85', img: '../images/feminino/blusa/f9d1e342-a98d-414f-b9b5-53be6c565541.png', categoria: 'feminino' },
  { id: 'fem_b10', tipo: 'blusa', nome: 'Blusa ', preco: '140', img: '../images/feminino/blusa/f3471c72-036c-4540-b249-d08ce2bd8c94.png', categoria: 'feminino' },

  { id: 'fem_s1', tipo: 'shorts', nome: 'Shorts ', preco: '110', img: '../images/feminino/shorts/1f50825e-e512-47c4-8d22-33f9a37b1514.png', categoria: 'feminino' },
  { id: 'fem_s2', tipo: 'shorts', nome: 'Shorts ', preco: '120', img: '../images/feminino/shorts/8f9d8778-1b32-44b0-828d-00ceaf3ec9ed.png', categoria: 'feminino' },
  { id: 'fem_s3', tipo: 'shorts', nome: 'Shorts ', preco: '115', img: '../images/feminino/shorts/40fab3d9-f8b9-4825-9444-b8f96eb3b858.png', categoria: 'feminino' },
  { id: 'fem_s4', tipo: 'shorts', nome: 'Shorts ', preco: '140', img: '../images/feminino/shorts/506f88ce-05e7-48b1-89e2-6c01fbf0969a.png', categoria: 'feminino' },
  { id: 'fem_s5', tipo: 'shorts', nome: 'Shorts ', preco: '125', img: '../images/feminino/shorts/1600b421-bd21-4d0a-bc3e-56d3bd26e27e.png', categoria: 'feminino' },
  { id: 'fem_s6', tipo: 'shorts', nome: 'Shorts ', preco: '85', img: '../images/feminino/shorts/27571a37-3f31-45b4-8e9d-192bc8a952f0.png', categoria: 'feminino' },
  { id: 'fem_s7', tipo: 'shorts', nome: 'Shorts ', preco: '110', img: '../images/feminino/shorts/37632e05-bc6c-4aea-bef8-26bac6f76e6c.png', categoria: 'feminino' },
  { id: 'fem_s8', tipo: 'shorts', nome: 'Shorts ', preco: '105', img: '../images/feminino/shorts/a01a2cc6-2f57-4062-b8cb-32df06937308.png', categoria: 'feminino' },
  { id: 'fem_s9', tipo: 'shorts', nome: 'Shorts ', preco: '75', img: '../images/feminino/shorts/b6467a51-86e6-45de-acff-1e45e13e3278.png', categoria: 'feminino' },
  { id: 'fem_s10', tipo: 'shorts', nome: 'Shorts ', preco: '70', img: '../images/feminino/shorts/d39239a6-4ab2-4014-8546-135e395acb15.png', categoria: 'feminino' }
];

document.addEventListener("DOMContentLoaded", () => {
  const gradeProdutos = document.getElementById("feminino-grid") || document.getElementById("product-grid");
  const modalCategorias = document.getElementById("modal-categorias");
  const botaoAbrirCategorias = document.getElementById("btn-open-cat");
  const botaoFecharCategorias = document.getElementById("btn-close-cat");

  if (botaoAbrirCategorias && modalCategorias) {
    botaoAbrirCategorias.addEventListener("click", () => {
      modalCategorias.classList.remove("hidden");
    });
  }

  if (botaoFecharCategorias && modalCategorias) {
    botaoFecharCategorias.addEventListener("click", () => {
      modalCategorias.classList.add("hidden");
    });
  }

  let filtroAtual = 'todos';
  let identificadorUsuario = null;
  let curtidasUsuario = [];
  let carrinhoUsuario = [];

  onAuthStateChanged(auth, async (usuario) => {
    if (usuario) {
      identificadorUsuario = usuario.uid;
      await carregarDadosUsuario(identificadorUsuario);
    } else {
      renderizarProdutos();
    }
  });

  async function carregarDadosUsuario(identificador) {
    try {
      const referenciaUsuario = doc(db, "usuarios", identificador);
      const documentoUsuario = await getDoc(referenciaUsuario);

      if (documentoUsuario.exists()) {
        const dadosUsuario = documentoUsuario.data();
        curtidasUsuario = dadosUsuario.curtidas || [];
        carrinhoUsuario = dadosUsuario.carrinho || [];
      }
      renderizarProdutos();
    } catch (erro) {
      console.error("Erro ao carregar dados do Firebase:", erro);
      renderizarProdutos();
    }
  }

  function renderizarProdutos() {
    if (!gradeProdutos) return;
    gradeProdutos.innerHTML = "";

    let produtosFiltrados = todosProdutos;
    if (filtroAtual !== 'todos') {
      produtosFiltrados = todosProdutos.filter(produto => produto.tipo === filtroAtual);
    }

    const codigosCurtidas = curtidasUsuario.map(item => typeof item === 'object' ? item.id : item);
    const codigosCarrinho = carrinhoUsuario.map(item => typeof item === 'object' ? item.id : item);

    produtosFiltrados.forEach(produto => {
      const estaCurtido = codigosCurtidas.includes(produto.id);
      const estaNoCarrinho = codigosCarrinho.includes(produto.id);

      const cartaoProduto = document.createElement("div");
      cartaoProduto.className = "product-card";
      cartaoProduto.setAttribute("data-id", produto.id);

      cartaoProduto.innerHTML = `
        <div class="img-container" style="cursor: pointer;">
          <img src="${produto.img}" alt="${produto.nome}" />
        </div>
        <div class="card-content-bottom">
          <div class="product-info">
            <span class="p-title">${produto.nome}</span>
            <span class="p-price">R$${produto.preco}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn-fav ${estaCurtido ? 'favoritado' : ''}" title="Favoritar">
              <i class="${estaCurtido ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}" ${estaCurtido ? 'style="color: #38a11e;"' : ''}></i>
            </button>
            <button type="button" class="btn-cart ${estaNoCarrinho ? 'no-carrinho' : ''}" title="Carrinho">
              <i class="fa-solid ${estaNoCarrinho ? 'fa-check' : 'fa-cart-shopping'}" ${estaNoCarrinho ? 'style="color: #38a11e;"' : ''}></i>
            </button>
          </div>
        </div>
      `;

      const caixaImagem = cartaoProduto.querySelector(".img-container");
      caixaImagem.addEventListener("click", () => abrirModalSelecao(produto));

      const botaoFavoritar = cartaoProduto.querySelector(".btn-fav");
      botaoFavoritar.addEventListener("click", (evento) => {
        evento.stopPropagation();
        alternarFavorito(produto, botaoFavoritar);
      });

      const botaoCarrinho = cartaoProduto.querySelector(".btn-cart");
      botaoCarrinho.addEventListener("click", (evento) => {
        evento.stopPropagation();
        abrirModalSelecao(produto);
      });

      gradeProdutos.appendChild(cartaoProduto);
    });
  }

  function abrirModalSelecao(produto) {
    const janelaModal = document.getElementById("modal-produto");
    if (!janelaModal) return;

    const listaTamanhos = ['P', 'M', 'G', 'GG'];
    let tamanhoSelecionado = listaTamanhos[0];
    let quantidade = 1;

    document.getElementById("modal-p-img").src = produto.img;
    document.getElementById("modal-p-nome").textContent = produto.nome;
    document.getElementById("modal-p-preco").textContent = `R$${produto.preco}`;
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
      console.error("Erro ao atualizar curtidas no Firestore:", erro);
    }
  }

  const botoesFiltro = document.querySelectorAll(".filter-pills .pill");
  botoesFiltro.forEach(botaoFiltro => {
    botaoFiltro.addEventListener("click", (evento) => {
      botoesFiltro.forEach(botao => botao.classList.remove("active"));
      evento.currentTarget.classList.add("active");

      filtroAtual = evento.currentTarget.getAttribute("data-filter") || "todos";
      renderizarProdutos();
    });
  });
});
    
