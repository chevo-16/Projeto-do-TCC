let rows = 9,
  cols = 9,
  mines = 10;
let currentDiscount = "5%";
let currentLevelName = "Nível 1";
let board = [];
let revealed = [];
let flagged = [];
let gameOver = false;
let timerInterval;
let seconds = 0;
let firstClick = true;

const grid = document.getElementById("grid");
const mineCountEl = document.getElementById("mine-count");
const timerEl = document.getElementById("timer");
const resetBtn = document.getElementById("reset-btn");
const discountBanner = document.getElementById("discount-banner");
const discountVal = document.getElementById("discount-val");
const couponCode = document.getElementById("coupon-code");

const retryBanner = document.getElementById("retry-banner");
const retryLevelName = document.getElementById("retry-level-name");

function setDifficulty(r, c, m, discount) {
  rows = r;
  cols = c;
  mines = m;
  currentDiscount = discount;

  if (discount === "5%") currentLevelName = "Nível 1";
  else if (discount === "10%") currentLevelName = "Nível 2";
  else currentLevelName = "Nível 3";

  resetGame();
}

function createEmptyBoard() {
  board = Array(rows)
    .fill()
    .map(() => Array(cols).fill(0));
  revealed = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
  flagged = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
}

function placeMines(excludeRow, excludeCol) {
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    if (r === excludeRow && c === excludeCol) continue;
    if (board[r][c] === "M") continue;

    board[r][c] = "M";
    placed++;
  }
}

function calculateNumbers() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === "M") continue;

      let count = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          const ni = i + di,
            nj = j + dj;
          if (
            ni >= 0 &&
            ni < rows &&
            nj >= 0 &&
            nj < cols &&
            board[ni][nj] === "M"
          ) {
            count++;
          }
        }
      }
      board[i][j] = count;
    }
  }
}

function renderGrid() {
  grid.style.gridTemplateColumns = `repeat(${cols}, 32px)`;
  grid.innerHTML = "";

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;

      if (revealed[i][j]) {
        cell.classList.add("revealed");
        if (board[i][j] === "M") {
          cell.classList.add("mine");
        } else if (board[i][j] > 0) {
          cell.textContent = board[i][j];
          cell.classList.add(`num${board[i][j]}`);
        }
      } else if (flagged[i][j]) {
        cell.classList.add("flagged");
      }

      cell.addEventListener("click", handleLeftClick);
      cell.addEventListener("contextmenu", handleRightClick);
      grid.appendChild(cell);
    }
  }
}

function handleLeftClick(e) {
  if (gameOver) return;

  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  if (flagged[row][col]) return;

  if (firstClick) {
    firstClick = false;
    placeMines(row, col);
    calculateNumbers();
    startTimer();
  }

  if (revealed[row][col]) return;

  revealCell(row, col);

  if (board[row][col] === "M") {
    gameOver = true;
    revealAllMines();
    resetBtn.textContent = "😅";
    clearInterval(timerInterval);
    showRetry();
  } else if (checkWin()) {
    gameOver = true;
    resetBtn.textContent = "🎉";
    clearInterval(timerInterval);
    showDiscount();
  }
}

function revealCell(row, col) {
  if (row < 0 || row >= rows || col < 0 || col >= cols || revealed[row][col])
    return;

  revealed[row][col] = true;

  if (board[row][col] === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        revealCell(row + i, col + j);
      }
    }
  }
  renderGrid();
}

function handleRightClick(e) {
  e.preventDefault();
  if (gameOver || firstClick) return;

  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  if (revealed[row][col]) return;

  flagged[row][col] = !flagged[row][col];
  renderGrid();
  updateMineCount();
}

function revealAllMines() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === "M") revealed[i][j] = true;
    }
  }
  renderGrid();
}

function checkWin() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] !== "M" && !revealed[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function showDiscount() {
  discountVal.textContent = currentDiscount;
  couponCode.textContent = `BUENAO${currentDiscount.replace("%", "")}OFF`;
  discountBanner.classList.remove("hidden");
  retryBanner.classList.add("hidden");
}

function showRetry() {
  retryLevelName.textContent = currentLevelName;
  retryBanner.classList.remove("hidden");
  discountBanner.classList.add("hidden");
}

function updateMineCount() {
  let remaining = mines;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (flagged[i][j]) remaining--;
    }
  }
  mineCountEl.textContent = String(remaining).padStart(3, "0");
}

function startTimer() {
  seconds = 0;
  timerEl.textContent = "000";
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = String(seconds).padStart(3, "0");
  }, 1000);
}

function resetGame() {
  clearInterval(timerInterval);
  firstClick = true;
  gameOver = false;
  seconds = 0;
  timerEl.textContent = "000";
  resetBtn.textContent = "🛍️";
  discountBanner.classList.add("hidden");
  retryBanner.classList.add("hidden");
  createEmptyBoard();
  renderGrid();
  updateMineCount();
}

resetGame();
