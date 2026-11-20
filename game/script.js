import { auth, db } from '../js/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let linhas = 9;
let colunas = 9;
let minas = 10;
let descontoAtual = "5%";
let nomeNivelAtual = "Nível 1";
let tabuleiro = [];
let reveladas = [];
let marcadas = [];
let fimDeJogo = false;
let intervaloTempo;
let segundos = 0;
let primeiroClique = true;
let identificadorUsuario = null;

onAuthStateChanged(auth, (usuario) => {
  if (usuario) {
    identificadorUsuario = usuario.uid;
  }
});

function definirDificuldade(l, c, m, desconto) {
  linhas = l;
  colunas = c;
  minas = m;
  descontoAtual = desconto;

  if (desconto === "5%") nomeNivelAtual = "Nível 1";
  else if (desconto === "10%") nomeNivelAtual = "Nível 2";
  else nomeNivelAtual = "Nível 3";

  reiniciarJogo();
}

window.setDifficulty = definirDificuldade;

function criarTabuleiroVazio() {
  tabuleiro = Array(linhas)
    .fill()
    .map(() => Array(colunas).fill(0));
  reveladas = Array(linhas)
    .fill()
    .map(() => Array(colunas).fill(false));
  marcadas = Array(linhas)
    .fill()
    .map(() => Array(colunas).fill(false));
}

function posicionarMinas(linhaExcluida, colunaExcluida) {
  let posicionadas = 0;
  while (posicionadas < minas) {
    const l = Math.floor(Math.random() * linhas);
    const c = Math.floor(Math.random() * colunas);

    if (l === linhaExcluida && c === colunaExcluida) continue;
    if (tabuleiro[l][c] === "M") continue;

    tabuleiro[l][c] = "M";
    posicionadas++;
  }
}

function calcularNumeros() {
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      if (tabuleiro[i][j] === "M") continue;

      let contagem = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          const ni = i + di;
          const nj = j + dj;
          if (
            ni >= 0 &&
            ni < linhas &&
            nj >= 0 &&
            nj < colunas &&
            tabuleiro[ni][nj] === "M"
          ) {
            contagem++;
          }
        }
      }
      tabuleiro[i][j] = contagem;
    }
  }
}

function renderizarGrade() {
  const gradeJogo = document.getElementById("grid");
  if (!gradeJogo) return;

  gradeJogo.style.gridTemplateColumns = `repeat(${colunas}, 32px)`;
  gradeJogo.innerHTML = "";

  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      const celula = document.createElement("div");
      celula.classList.add("cell");
      celula.dataset.row = i;
      celula.dataset.col = j;

      if (reveladas[i][j]) {
        celula.classList.add("revealed");
        if (tabuleiro[i][j] === "M") {
          celula.classList.add("mine");
        } else if (tabuleiro[i][j] > 0) {
          celula.textContent = tabuleiro[i][j];
          celula.classList.add(`num${tabuleiro[i][j]}`);
        }
      } else if (marcadas[i][j]) {
        celula.classList.add("flagged");
      }

      celula.addEventListener("click", lidarCliqueEsquerdo);
      celula.addEventListener("contextmenu", lidarCliqueDireito);
      gradeJogo.appendChild(celula);
    }
  }
}

function lidarCliqueEsquerdo(evento) {
  if (fimDeJogo) return;

  const linha = parseInt(evento.target.dataset.row);
  const coluna = parseInt(evento.target.dataset.col);

  if (marcadas[linha][coluna]) return;

  if (primeiroClique) {
    primeiroClique = false;
    posicionarMinas(linha, coluna);
    calcularNumeros();
    iniciarCronometro();
  }

  if (reveladas[linha][coluna]) return;

  revelarCelula(linha, coluna);

  const botaoReiniciar = document.getElementById("reset-btn");

  if (tabuleiro[linha][coluna] === "M") {
    fimDeJogo = true;
    revelarTodasMinas();
    if (botaoReiniciar) botaoReiniciar.textContent = "😅";
    clearInterval(intervaloTempo);
    mostrarTentarNovamente();
  } else if (verificarVitoria()) {
    fimDeJogo = true;
    if (botaoReiniciar) botaoReiniciar.textContent = "🎉";
    clearInterval(intervaloTempo);
    mostrarDesconto();
  }
}

function revelarCelula(linha, coluna) {
  if (linha < 0 || linha >= linhas || coluna < 0 || coluna >= colunas || reveladas[linha][coluna])
    return;

  reveladas[linha][coluna] = true;

  if (tabuleiro[linha][coluna] === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        revelarCelula(linha + i, coluna + j);
      }
    }
  }
  renderizarGrade();
}

function lidarCliqueDireito(evento) {
  evento.preventDefault();
  if (fimDeJogo || primeiroClique) return;

  const linha = parseInt(evento.target.dataset.row);
  const coluna = parseInt(evento.target.dataset.col);

  if (reveladas[linha][coluna]) return;

  marcadas[linha][coluna] = !marcadas[linha][coluna];
  renderizarGrade();
  atualizarContagemMinas();
}

function revelarTodasMinas() {
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      if (tabuleiro[i][j] === "M") reveladas[i][j] = true;
    }
  }
  renderizarGrade();
}

function verificarVitoria() {
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      if (tabuleiro[i][j] !== "M" && !reveladas[i][j]) {
        return false;
      }
    }
  }
  return true;
}

async function salvarCupomNoBanco(codigoCupom, percentualDesconto) {
  if (!identificadorUsuario) return;

  try {
    const referenciaUsuario = doc(db, "usuarios", identificadorUsuario);
    const documentoUsuario = await getDoc(referenciaUsuario);

    let listaCupons = [];
    if (documentoUsuario.exists() && Array.isArray(documentoUsuario.data().cupons)) {
      listaCupons = documentoUsuario.data().cupons;
    }

    const jaPossui = listaCupons.some(item => item.nome === codigoCupom);
    if (!jaPossui) {
      listaCupons.push({
        nome: codigoCupom,
        desconto: percentualDesconto,
        ganhoEm: new Date().toISOString()
      });

      await setDoc(referenciaUsuario, { cupons: listaCupons }, { merge: true });
    }
  } catch (erro) {
    console.error("Erro ao salvar cupom no Firestore:", erro);
  }
}

async function mostrarDesconto() {
  const percentual = Number(descontoAtual.replace("%", ""));
  const codigoGerado = `BUENAO${percentual}OFF`;

  const valorDescontoEl = document.getElementById("discount-val");
  const codigoCupomEl = document.getElementById("coupon-code");
  const bannerDesconto = document.getElementById("discount-banner");
  const bannerTentarNovamente = document.getElementById("retry-banner");

  if (valorDescontoEl) valorDescontoEl.textContent = descontoAtual;
  if (codigoCupomEl) codigoCupomEl.textContent = codigoGerado;
  if (bannerDesconto) bannerDesconto.classList.remove("hidden");
  if (bannerTentarNovamente) bannerTentarNovamente.classList.add("hidden");

  await salvarCupomNoBanco(codigoGerado, percentual);
}

function mostrarTentarNovamente() {
  const nomeNivelTentativa = document.getElementById("retry-level-name");
  const bannerTentarNovamente = document.getElementById("retry-banner");
  const bannerDesconto = document.getElementById("discount-banner");

  if (nomeNivelTentativa) nomeNivelTentativa.textContent = nomeNivelAtual;
  if (bannerTentarNovamente) bannerTentarNovamente.classList.remove("hidden");
  if (bannerDesconto) bannerDesconto.classList.add("hidden");
}

function atualizarContagemMinas() {
  const contadorMinasEl = document.getElementById("mine-count");
  if (!contadorMinasEl) return;

  let restantes = minas;
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      if (marcadas[i][j]) restantes--;
    }
  }
  contadorMinasEl.textContent = String(restantes).padStart(3, "0");
}

function iniciarCronometro() {
  const cronometroEl = document.getElementById("timer");
  segundos = 0;
  if (cronometroEl) cronometroEl.textContent = "000";
  clearInterval(intervaloTempo);
  intervaloTempo = setInterval(() => {
    segundos++;
    if (cronometroEl) cronometroEl.textContent = String(segundos).padStart(3, "0");
  }, 1000);
}

function reiniciarJogo() {
  clearInterval(intervaloTempo);
  primeiroClique = true;
  fimDeJogo = false;
  segundos = 0;

  const cronometroEl = document.getElementById("timer");
  const botaoReiniciar = document.getElementById("reset-btn");
  const bannerDesconto = document.getElementById("discount-banner");
  const bannerTentarNovamente = document.getElementById("retry-banner");

  if (cronometroEl) cronometroEl.textContent = "000";
  if (botaoReiniciar) botaoReiniciar.textContent = "🛍️";
  if (bannerDesconto) bannerDesconto.classList.add("hidden");
  if (bannerTentarNovamente) bannerTentarNovamente.classList.add("hidden");

  criarTabuleiroVazio();
  renderizarGrade();
  atualizarContagemMinas();
}

window.resetGame = reiniciarJogo;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", reiniciarJogo);
} else {
  reiniciarJogo();
}
  
