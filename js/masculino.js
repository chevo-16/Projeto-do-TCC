import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("masculino-grid") || document.getElementById("product-grid");
  const modalCategorias = document.getElementById("modal-categorias");
  const btnOpenCat = document.getElementById("btn-open-cat");
  const btnCloseCat = document.getElementById("btn-close-cat");

  if (btnOpenCat && modalCategorias) {
    btnOpenCat.addEventListener("click", () => {
      modalCategorias.classList.remove("hidden");
    });
  }

  if (btnCloseCat && modalCategorias) {
    btnCloseCat.addEventListener("click", () => {
      modalCategorias.classList.add("hidden");
    });
  }

  const todosProdutos = [
  
    { id: 'masc_b1', tipo: 'blusa', nome: 'Blusa ', preco: '160', img: '../images/masculino/blusas/43ca4c30-b52c-427d-a858-99e7f06b9ab8.png', categoria: 'masculino' },
    { id: 'masc_b2', tipo: 'blusa', nome: 'Blusa ', preco: '220', img: '../images/masculino/blusas/46c25090-f284-455d-8ee3-703f8c7c8b7e.png', categoria: 'masculino' },
    { id: 'masc_b3', tipo: 'blusa', nome: 'Blusa ', preco: '200', img: '../images/masculino/blusas/299e3481-38e7-475a-886d-936614ed42ff.png', categoria: 'masculino' },
    { id: 'masc_b4', tipo: 'blusa', nome: 'Blusa ', preco: '180', img: '../images/masculino/blusas/597a1e2d-1179-4079-abbb-090fbf16be8b.png', categoria: 'masculino' },
    { id: 'masc_b5', tipo: 'blusa', nome: 'Blusa ', preco: '150', img: '../images/masculino/blusas/b8226e1c-1621-4f82-ae96-e8184558d085.png', categoria: 'masculino' },
    { id: 'masc_b6', tipo: 'blusa', nome: 'Blusa ', preco: '140', img: '../images/masculino/blusas/bff22c4b-0ef8-49b3-a78e-97d66962c849.png', categoria: 'masculino' },
    { id: 'masc_b7', tipo: 'blusa', nome: 'Blusa ', preco: '170', img: '../images/masculino/blusas/blusa.png', categoria: 'masculino' },
    { id: 'masc_b8', tipo: 'blusa', nome: 'Blusa ', preco: '130', img: '../images/masculino/blusas/blusa2.png', categoria: 'masculino' },
    { id: 'masc_b9', tipo: 'blusa', nome: 'Blusa ', preco: '190', img: '../images/masculino/blusas/jaqueta1.png', categoria: 'masculino' },
    { id: 'masc_b10', tipo: 'blusa', nome: 'Jaqueta ', preco: '145', img: '../images/masculino/blusas/jaqueta2.png', categoria: 'masculino' },

    { id: 'masc_c1', tipo: 'calca', nome: 'Calça ', preco: '150', img: '../images/masculino/calça/3e4764a2-519e-41ea-9d25-126dfe9b1d9b.png', categoria: 'masculino' },
    { id: 'masc_c2', tipo: 'calca', nome: 'Calça ', preco: '165', img: '../images/masculino/calça/5f6657d6-90dc-4e20-968f-37a52a1a7489.png', categoria: 'masculino' },
    { id: 'masc_c3', tipo: 'calca', nome: 'Calça ', preco: '135', img: '../images/masculino/calça/26f39c22-088a-4a43-b4c0-26ad5cd8b78d.png', categoria: 'masculino' },
    { id: 'masc_c4', tipo: 'calca', nome: 'Calça ', preco: '180', img: '../images/masculino/calça/1363e689-9af3-4886-ac2a-79f88d156ed3.png', categoria: 'masculino' },
    { id: 'masc_c5', tipo: 'calca', nome: 'Calça ', preco: '120', img: '../images/masculino/calça/8059280c-64a0-44e9-8dc9-dc86c3ee8db4.png', categoria: 'masculino' },
    { id: 'masc_c6', tipo: 'calca', nome: 'Calça ', preco: '155', img: '../images/masculino/calça/a832348e-2f57-4c2e-b8ae-7653f2cfb24b.png', categoria: 'masculino' },
    { id: 'masc_c7', tipo: 'calca', nome: 'Calça ', preco: '160', img: '../images/masculino/calça/calça.png', categoria: 'masculino' },
    { id: 'masc_c8', tipo: 'calca', nome: 'Calça ', preco: '140', img: '../images/masculino/calça/calca2.png', categoria: 'masculino' },
    { id: 'masc_c9', tipo: 'calca', nome: 'Calça ', preco: '110', img: '../images/masculino/calça/eeeeebe8-d919-4355-bc7f-30e3ce865145.png', categoria: 'masculino' },
    { id: 'masc_c10', tipo: 'calca', nome: 'Calça ', preco: '145', img: '../images/masculino/calça/fb5e5822-173f-41fb-9067-5e242228a898.png', categoria: 'masculino' },

    { id: 'masc_s1', tipo: 'shorts', nome: 'Shorts ', preco: '110', img: '../images/masculino/shorts/0b2a3a17-a116-4ca6-8d76-ab5a900a592a.png', categoria: 'masculino' },
    { id: 'masc_s2', tipo: 'shorts', nome: 'Bermuda ', preco: '125', img: '../images/masculino/shorts/7a4e6540-5362-4665-ae44-7a71c5a992ce.png', categoria: 'masculino' },
    { id: 'masc_s3', tipo: 'shorts', nome: 'Shorts ', preco: '85', img: '../images/masculino/shorts/8e624275-5474-42c1-a877-76119d798269.png', categoria: 'masculino' },
    { id: 'masc_s4', tipo: 'shorts', nome: 'Bermuda ', preco: '115', img: '../images/masculino/shorts/175e37d9-1cad-40cd-9047-2f1e63f506a9.png', categoria: 'masculino' },
    { id: 'masc_s5', tipo: 'shorts', nome: 'Shorts ', preco: '90', img: '../images/masculino/shorts/776d4990-258b-424d-9232-f0199a0a18c0.png', categoria: 'masculino' },
    { id: 'masc_s6', tipo: 'shorts', nome: 'Shorts ', preco: '95', img: '../images/masculino/shorts/b15d7349-c07f-4c06-93d6-710a43298a87.png', categoria: 'masculino' },
    { id: 'masc_s7', tipo: 'shorts', nome: 'Bermuda ', preco: '130', img: '../images/masculino/shorts/c5a243e1-c544-4a99-982b-0b09f10aa0ae (1).png', categoria: 'masculino' },
    { id: 'masc_s8', tipo: 'shorts', nome: 'Shorts ', preco: '80', img: '../images/masculino/shorts/f1ec417a-9cc7-46c8-854b-e407eeae87cd.png', categoria: 'masculino' },
    { id: 'masc_s9', tipo: 'shorts', nome: 'Bermuda ', preco: '135', img: '../images/masculino/shorts/f85bb240-be57-4461-8062-86602ab02d32.png', categoria: 'masculino' },
    { id: 'masc_s10', tipo: 'shorts', nome: 'Shorts ', preco: '100', img: '../images/masculino/shorts/fc2ea6ec-8cdf-4dfc-a110-23ca3db531ed.png', categoria: 'masculino' },

    { id: 'masc_t1', tipo: 'camiseta', nome: 'Camiseta ', preco: '70', img: '../images/masculino/camiseta/2f240c7b-ecf2-493d-aa21-6df20fe0437a.png', categoria: 'masculino' },
    { id: 'masc_t2', tipo: 'camiseta', nome: 'Camiseta ', preco: '85', img: '../images/masculino/camiseta/38b45457-8d4c-4238-8cdb-6206eef6efea.png', categoria: 'masculino' },
    { id: 'masc_t3', tipo: 'camiseta', nome: 'Camisa ', preco: '110', img: '../images/masculino/camiseta/64e46cbe-342a-4c05-a97b-d38ecbf6d9c4.png', categoria: 'masculino' },
    { id: 'masc_t4', tipo: 'camiseta', nome: 'Camisa  ', preco: '120', img: '../images/masculino/camiseta/72066be1-f12e-44ae-a846-09f16ce3cea9.png', categoria: 'masculino' },
    { id: 'masc_t5', tipo: 'camiseta', nome: 'Camiseta ', preco: '60', img: '../images/masculino/camiseta/a817bdfb-3f22-4717-b0d0-9f41d7c53985.png', categoria: 'masculino' },
    { id: 'masc_t6', tipo: 'camiseta', nome: 'Camisa ', preco: '140', img: '../images/masculino/camiseta/aeca1b65-e47b-4b3a-9da6-1f5efbfe95ec.png', categoria: 'masculino' },
    { id: 'masc_t7', tipo: 'camiseta', nome: 'Camiseta ', preco: '95', img: '../images/masculino/camiseta/c34c1e0c-e6a9-4528-a6b2-cf8f98092c98.png', categoria: 'masculino' },
    { id: 'masc_t8', tipo: 'camiseta', nome: 'Camisa ', preco: '130', img: '../images/masculino/camiseta/camiseta.png', categoria: 'masculino' },
    { id: 'masc_t9', tipo: 'camiseta', nome: 'Camiseta ', preco: '75', img: '../images/masculino/camiseta/camiseta2.png', categoria: 'masculino' },
    { id: 'masc_t10', tipo: 'camiseta', nome: 'Camisa ', preco: '125', img: '../images/masculino/camiseta/fa464828-33e4-4011-b3af-2c8820f59c25.png', categoria: 'masculino' }
  ];

  let filtroAtual = 'todos';
  let uidUsuario = null;
  let curtidasUsuario = [];
  let carrinhoUsuario = [];

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      uidUsuario = user.uid;
      await carregarDadosUsuario(uidUsuario);
    } else {
      renderizarProdutos();
    }
  });

  async function carregarDadosUsuario(uid) {
    try {
      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        curtidasUsuario = data.curtidas || [];
        carrinhoUsuario = data.carrinho || [];
      }
      renderizarProdutos();
    } catch (error) {
      console.error("Erro ao carregar dados do Firebase:", error);
      renderizarProdutos();
    }
  }

  function renderizarProdutos() {
    if (!grid) return;
    grid.innerHTML = "";

    let produtosExibir = todosProdutos;
    if (filtroAtual !== 'todos') {
      produtosExibir = todosProdutos.filter(p => p.tipo === filtroAtual);
    }

    const idsCurtidas = curtidasUsuario.map(p => typeof p === 'object' ? p.id : p);
    const idsCarrinho = carrinhoUsuario.map(p => typeof p === 'object' ? p.id : p);

    produtosExibir.forEach(produto => {
      const eCurtido = idsCurtidas.includes(produto.id);
      const noCarrinho = idsCarrinho.includes(produto.id);

      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-id", produto.id);

      card.innerHTML = `
        <div class="img-container" style="cursor: pointer;">
          <img src="${produto.img}" alt="${produto.nome}" />
        </div>
        <div class="card-content-bottom">
          <div class="product-info">
            <span class="p-title">${produto.nome}</span>
            <span class="p-price">R$${produto.preco}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn-fav ${eCurtido ? 'favoritado' : ''}" title="Favoritar">
              <i class="${eCurtido ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}" ${eCurtido ? 'style="color: #38a11e;"' : ''}></i>
            </button>
            <button type="button" class="btn-cart ${noCarrinho ? 'no-carrinho' : ''}" title="Carrinho">
              <i class="fa-solid ${noCarrinho ? 'fa-check' : 'fa-cart-shopping'}" ${noCarrinho ? 'style="color: #38a11e;"' : ''}></i>
            </button>
          </div>
        </div>
      `;

      const imgEl = card.querySelector(".img-container");
      imgEl.addEventListener("click", () => abrirModalSelecao(produto));

      const btnFav = card.querySelector(".btn-fav");
      btnFav.addEventListener("click", (e) => {
        e.stopPropagation();
        alternarFavorito(produto, btnFav);
      });

      const btnCart = card.querySelector(".btn-cart");
      btnCart.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModalSelecao(produto);
      });

      grid.appendChild(card);
    });
  }

  function abrirModalSelecao(produto) {
    const modal = document.getElementById("modal-produto");
    if (!modal) return;

    const tamanhos = ['P', 'M', 'G', 'GG'];
    let tamanhoSelecionado = tamanhos[0];
    let quantidade = 1;

    document.getElementById("modal-p-img").src = produto.img;
    document.getElementById("modal-p-nome").textContent = produto.nome;
    document.getElementById("modal-p-preco").textContent = `R$${produto.preco}`;
    document.getElementById("modal-p-qtd").textContent = quantidade;

    const gridTamanhos = document.getElementById("modal-p-tamanhos");
    gridTamanhos.innerHTML = "";

    tamanhos.forEach(tam => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `btn-tamanho ${tam === tamanhoSelecionado ? 'active' : ''}`;
      btn.textContent = tam;
      btn.onclick = () => {
        document.querySelectorAll(".btn-tamanho").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        tamanhoSelecionado = tam;
      };
      gridTamanhos.appendChild(btn);
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
      if (!uidUsuario) {
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
        const userRef = doc(db, "usuarios", uidUsuario);
        await setDoc(userRef, { carrinho: carrinhoUsuario }, { merge: true });
        renderizarProdutos();
        modal.classList.add("hidden");
      } catch (error) {
        console.error("Erro ao adicionar produto ao carrinho:", error);
      }
    };

    const btnCloseModal = document.getElementById("btn-close-produto");
    if (btnCloseModal) {
      btnCloseModal.onclick = () => modal.classList.add("hidden");
    }

    modal.classList.remove("hidden");
  }

  async function alternarFavorito(produto, btnFav) {
    if (!uidUsuario) return;

    const icone = btnFav.querySelector("i");
    const eCurtido = btnFav.classList.contains("favoritado");

    if (eCurtido) {
      btnFav.classList.remove("favoritado");
      icone.className = "fa-regular fa-heart";
      icone.style.color = "";
      curtidasUsuario = curtidasUsuario.filter(p => (typeof p === 'object' ? p.id : p) !== produto.id);
    } else {
      btnFav.classList.add("favoritado");
      icone.className = "fa-solid fa-heart";
      icone.style.color = "#38a11e";
      curtidasUsuario.push(produto);
    }

    try {
      const userRef = doc(db, "usuarios", uidUsuario);
      await setDoc(userRef, { curtidas: curtidasUsuario }, { merge: true });
    } catch (error) {
      console.error("Erro ao atualizar curtidas no Firestore:", error);
    }
  }

  const botoesFiltro = document.querySelectorAll(".filter-pills .pill");
  botoesFiltro.forEach(btn => {
    btn.addEventListener("click", (e) => {
      botoesFiltro.forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");

      filtroAtual = e.currentTarget.getAttribute("data-filter") || "todos";
      renderizarProdutos();
    });
  });
});