import {
  updateScore as updateStatisticsScore,
  clearField as clearStatisticsField,
  refreshStatistics,
} from "./statistics.js";

import {
  clearField as clearNextField,
  fillField as fillNextField,
} from "./next.js";

import {
  customFont,
  musicOn,
  musicOff,
  tetrominos,
  colors,
  gameAlert,
  linesScore,
  alertButton,
  score,
  alertScore,
  topScore,
  record,
} from "./constants.js";
import { setTopScore, submitScore } from "./serverFunctions.js";
import { generateRegistration } from "./registration.js";
import { leaderboardHandler } from "./leaderboard.js";

setTopScore();

leaderboardHandler();

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const cell = 32;
let field = [];
let tSequence = [];
let RAF = null;
let count = 0;
const possibleScores = [3, 4, 5, 6];
const possibleLineScores = [150, 175, 200];
let gameOver = false;
let stopped = true;
let speed = 15;
let currScore = 0;

export function modifyRAF(value) {
  RAF = requestAnimationFrame(value);
}

export const theme = new Audio("../audio/theme.mp3");
theme.loop = true;
let musicStatus = localStorage.getItem("music");

if (musicStatus) {
  const status = parseInt(musicStatus);
  theme.volume = status ? 0.05 : 0;
  theme.play();
}

const swapButtons = () => {
  const hidden = "svg-display-none";
  musicOn.classList.toggle(hidden);
  musicOff.classList.toggle(hidden);
  if (musicOn.classList.contains(hidden)) {
    theme.volume = 0;
    localStorage.setItem("music", "0");
  } else {
    localStorage.setItem("music", "1");
    theme.volume = 0.05;
  }
};

musicOn.addEventListener("click", swapButtons);
musicOff.addEventListener("click", swapButtons);

alertButton.addEventListener("click", () => {
  setTopScore();
  gameAlert.classList.add("display-none");
  alertButton.classList.add("alert-button--mgtop");
  record.classList.add("display-none");
  field = [];
  fillField();
  tSequence = [];
  count = 0;
  currScore = 0;
  generateSequence();
  clearNextField();
  score.textContent = "000000";
  linesScore.textContent = "000";
  gameOver = false;
  refreshStatistics();
  clearStatisticsField();
  tetromino = getNextTetromino();
  RAF = requestAnimationFrame(gameLoop);
});

const fillField = () => {
  for (let row = -2; row < canvas.height / 32; row++) {
    field[row] = [];
    for (let col = 0; col < canvas.width / 32; col++) {
      field[row][col] = 0;
    }
  }
};

fillField();

const updateLinesScore = () => {
  let currentScore = parseInt(linesScore.textContent);
  currentScore += 1;
  if (currentScore < 10) {
    linesScore.textContent = "00" + currentScore;
  } else if (currentScore < 100) {
    linesScore.textContent = "0" + currentScore;
  } else {
    linesScore.textContent = currentScore;
  }
};

const updateScore = () => {
  const textScore = ("000000" + currScore).slice(-6);
  score.textContent = textScore;
};

const checkRecord = () => {
  const scoreText = score.textContent;
  const scoreNumber = parseInt(scoreText);
  const topScoreNum = parseInt(topScore.textContent);
  if (topScoreNum > scoreNumber) {
    setTopScore();
    return false;
  }
  if (topScoreNum <= scoreNumber) {
    topScore.textContent = scoreText;
    return true;
  }
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * Math.ceil(max - min + 1)) + min;
};

const generateSequence = () => {
  const sequence = ["I", "J", "L", "O", "S", "T", "Z"];

  while (sequence.length) {
    const letter = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(letter, 1)[0];
    tSequence.push(name);
  }
};

generateSequence();

const getNextTetromino = () => {
  const name = tSequence.pop();
  const matrix = tetrominos[name];
  const col = field[0].length / 2 - Math.ceil(matrix[0].length / 2);
  const row = name === "I" ? -1 : -2;

  if (tSequence.length === 0) {
    generateSequence();
  }
  const lastElement = tSequence[tSequence.length - 1];

  clearNextField();

  if (lastElement) {
    fillNextField(tSequence[tSequence.length - 1]);
  }

  return {
    name: name,
    matrix: matrix,
    row: row,
    col: col,
  };
};

let tetromino = getNextTetromino();

const transponseMatrix = (matrix) => {
  let tMatrix = [];
  for (let i = 0; i < matrix.length; i++) {
    tMatrix.push([]);
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      tMatrix[j][i] = matrix[i][j];
    }
  }
  for (let i = 0; i < tMatrix.length; i++) {
    tMatrix[i].reverse();
  }
  return tMatrix;
};

const isValidMove = (matrix, cellRow, cellCol) => {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (
        matrix[row][col] &&
        (cellCol + col < 0 ||
          cellCol + col >= field[0].length ||
          cellRow + row >= field.length ||
          field[cellRow + row][cellCol + col])
      ) {
        return false;
      }
    }
  }
  return true;
};

const placeTetromino = () => {
  updateStatisticsScore(tetromino.name);
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        if (tetromino.row + 1 < 0) {
          return showGameOver();
        }
        field[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }
  let scoresToReceive =
    possibleScores[getRandomInt(0, possibleScores.length - 1)];
  currScore += scoresToReceive;
  updateScore();
  checkRecord();

  scoresToReceive = 0;
  let rowsCounter = 0;
  for (let row = field.length - 1; row >= 0; ) {
    if (field[row].every((rowCell) => !!rowCell)) {
      rowsCounter++;
      updateLinesScore();
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < field[r].length; c++) {
          field[r][c] = field[r - 1][c];
        }
      }
    } else {
      row--;
    }
  }

  if (rowsCounter) {
    let extraPoints = 0;
    for (let i = 0; i < rowsCounter; i++) {
      if (i >= 1) extraPoints += 50;
      scoresToReceive +=
        possibleLineScores[getRandomInt(0, possibleLineScores.length - 1)];
    }
    scoresToReceive += extraPoints;
    currScore += scoresToReceive;
    updateScore();
    checkRecord();
  }

  tetromino = getNextTetromino();
};

const showGameOver = () => {
  cancelAnimationFrame(RAF);
  gameOver = true;
  gameAlert.classList.remove("display-none");
  const scoreText = score.textContent;
  const linesText = linesScore.textContent;
  alertScore.textContent = scoreText;

  if (checkRecord()) {
    record.classList.remove("display-none");
    alertButton.classList.remove("alert-button--mgtop");
  }

  const player = localStorage.getItem("player");

  submitScore({
    nickname: player,
    topScore: scoreText,
    linesScore: linesText,
    id: parseInt(localStorage.getItem("id")),
  });
};

const pauseGame = async () => {
  if (stopped) {
    context.fillStyle = "black";
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    context.fillStyle = "white";
    context.font = "12px customFont";
    context.textAlign = "center";
    context.textBaseline = "middle";
    customFont.load().then(() => {
      context.fillText(
        "Press escape to unpause",
        canvas.width / 2,
        canvas.height / 2
      );
    });
  }
};

const drawField = () => {
  for (let row = 0; row < canvas.height / 32; row++) {
    for (let col = 0; col < canvas.width / 32; col++) {
      if (field[row][col]) {
        context.fillStyle = colors[field[row][col]];
        context.fillRect(col * cell, row * cell, cell, cell);
        context.strokeRect(col * cell, row * cell, cell, cell);
      }
    }
  }
};

const moveTetromino = () => {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        context.fillStyle = colors[tetromino.name];
        context.fillRect(
          (tetromino.col + col) * cell,
          (tetromino.row + row) * cell,
          cell,
          cell
        );
        context.strokeRect(
          (tetromino.col + col) * cell,
          (tetromino.row + row) * cell,
          cell,
          cell
        );
      }
    }
  }
};

export const gameLoop = () => {
  if (!stopped) {
    RAF = requestAnimationFrame(gameLoop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    moveTetromino();
    if (tetromino) {
      if (++count > speed) {
        tetromino.row++;
        count = 0;

        if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          placeTetromino();
        }
      }
    }
    drawField();
  } else {
    cancelAnimationFrame(RAF);
    drawField();
    pauseGame();
  }
};

document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (!stopped) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const col = e.key === "ArrowLeft" ? tetromino.col - 1 : tetromino.col + 1;

      if (isValidMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
    }

    if (e.key === "ArrowUp" && !e.repeat) {
      const matrix = transponseMatrix(tetromino.matrix);
      if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
    }

    if (e.key === "ArrowDown") {
      const row = tetromino.row + 1;
      if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
        tetromino.row = row - 1;
        placeTetromino();
        return;
      }
      tetromino.row = row;
    }
    if (e.key === " " && !e.repeat) {
      for (let row = tetromino.row; row < field.length; row++) {
        tetromino.row = row - 1;
        if (!isValidMove(tetromino.matrix, row, tetromino.col) && field[0]) {
          placeTetromino();
          return;
        }
      }
    }
  }
  if (e.key === "Escape") {
    stopped = !stopped;
    if (!stopped) {
      RAF = requestAnimationFrame(gameLoop);
    }
  }
});

if (localStorage.getItem("id")) {
  RAF = requestAnimationFrame(gameLoop);
} else {
  generateRegistration();
}
