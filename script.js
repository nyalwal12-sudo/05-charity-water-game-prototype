// Charity Water Memory Game JavaScript

const board = document.getElementById('board');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');
const maxMovesDisplay = document.getElementById('max-moves');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const cardsData = ['💧', '🚰', '🌊', '🪣', '🏠', '🌍'];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let score = 0;
let matchedPairs = 0;
let timer = null;
let secondsElapsed = 0;
let gameStarted = false;
const maxMoves = 12; // Maximum amount of moves

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function updateStats() {
  scoreDisplay.textContent = score;
  movesDisplay.textContent = moves;
  maxMovesDisplay.textContent = maxMoves;
  timeDisplay.textContent = formatTime(secondsElapsed);
}

function endGame(message) {
  stopTimer();
  lockBoard = true;
  gameStarted = false;
  startBtn.disabled = false;
  alert(message);
}
// Timer functions
function startTimer() {
  clearInterval(timer);
  secondsElapsed = 60;
  timeDisplay.textContent = formatTime(secondsElapsed);
  timer = setInterval(() => {
    secondsElapsed -= 1;
    if (secondsElapsed <= 0) {
      secondsElapsed = 0;
      timeDisplay.textContent = formatTime(secondsElapsed);
      endGame('Time is up! Try again to improve your score.');
      return;
    }
    timeDisplay.textContent = formatTime(secondsElapsed);
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function createCard(value) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.value = value;
  card.textContent = '';

  card.addEventListener('click', () => {
    if (!gameStarted || lockBoard || card.classList.contains('matched') || card === firstCard) {
      return;
    }

    card.classList.add('flipped');
    card.textContent = value;

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves += 1;

    if (firstCard.dataset.value === secondCard.dataset.value) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      score += 10;
      matchedPairs += 1;
      resetTurn();

      if (matchedPairs === cardsData.length) {
        endGame(`Great job! You finished in ${formatTime(secondsElapsed)} with ${moves} moves and ${score} score.`);
      }
    } else {
      lockBoard = true;
      score = Math.max(0, score - 1);
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetTurn();
      }, 800);
    }

    updateStats();

    if (gameStarted && matchedPairs !== cardsData.length && moves >= maxMoves) {
      endGame(`Game over! You used ${moves} moves and did not finish all pairs. Score: ${score}.`);
    }
  });

  return card;
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function initializeBoard() {
  board.innerHTML = '';
  const deck = shuffle([...cardsData, ...cardsData]);

  deck.forEach((symbol) => {
    const cardElement = createCard(symbol);
    board.appendChild(cardElement);
  });
}

function startGame() {
  moves = 0;
  score = 0;
  matchedPairs = 0;
  resetTurn();
  initializeBoard();
  updateStats();
  startTimer();
  gameStarted = true;
  startBtn.disabled = true;
}

restartBtn.addEventListener('click', () => {
  startGame();
});

startBtn.addEventListener('click', () => {
  if (!gameStarted) {
    startGame();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  initializeBoard();
  updateStats();
});

