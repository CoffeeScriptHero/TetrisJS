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
  tetrominos,
  colors,
  gameAlert,
  linesScore,
  button,
  score,
  alertScore,
  topScore,
  record,
} from "./constants.js";

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const cell = 32;
let field = [];
let tSequence = [];
let RAF = null;
let count = 0;
const possibleScores = [3, 4, 5, 6];
const possibleLineScores = [150, 175, 200];
let localTopScore = localStorage.getItem("Top-score") || "000000";
let gameOver = false;
topScore.textContent = localTopScore;

const theme = new Audio("../audio/theme.mp3");
theme.loop = true;
theme.play();
theme.volume = 0.05;

button.addEventListener("click", () => {
  gameAlert.classList.add("display-none");
  button.classList.add("alert-button--mgtop");
  record.classList.add("display-none");
  field = [];
  fillField();
  tSequence = [];
  count = 0;
  generateSequence();
  clearNextField();
  score.textContent = "000000";
  linesScore.textContent = "000";
  localTopScore = localStorage.getItem("Top-score");
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

const updateScore = (num) => {
  let currentScore = parseInt(score.textContent);
  const sum = currentScore + num;
  if (sum < 10) {
    currentScore = "00000" + sum;
  } else if (sum < 100) {
    currentScore = "0000" + sum;
  } else if (sum < 1000) {
    currentScore = "000" + sum;
  } else if (sum < 10000) {
    currentScore = "00" + sum;
  } else if (sum < 100000) {
    currentScore = "0" + sum;
  } else {
    currentScore += num;
  }
  score.textContent = currentScore;
};

const checkRecord = () => {
  const scoreText = score.textContent;
  const scoreNumber = parseInt(scoreText);
  if (parseInt(localTopScore) < scoreNumber) {
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
  const score = possibleScores[getRandomInt(0, possibleScores.length - 1)];
  updateScore(score);
  checkRecord();

  let scoresToReceive = 0;
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
      extraPoints += 50;
      scoresToReceive +=
        possibleLineScores[getRandomInt(0, possibleLineScores.length - 1)];
    }
    scoresToReceive += extraPoints;
    updateScore(scoresToReceive);
  }

  tetromino = getNextTetromino();
};

const showGameOver = () => {
  cancelAnimationFrame(RAF);
  gameOver = true;
  gameAlert.classList.remove("display-none");
  const scoreText = score.textContent;
  alertScore.textContent = scoreText;
  if (checkRecord()) {
    record.classList.remove("display-none");
    button.classList.remove("alert-button--mgtop");
    localStorage.setItem("Top-score", scoreText);
  }
};

const gameLoop = () => {
  RAF = requestAnimationFrame(gameLoop);
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < canvas.height / 32; row++) {
    for (let col = 0; col < canvas.width / 32; col++) {
      if (field[row][col]) {
        context.fillStyle = colors[field[row][col]];
        context.fillRect(col * cell, row * cell, cell, cell);
        context.strokeRect(col * cell, row * cell, cell, cell);
      }
    }
  }

  if (tetromino) {
    if (++count > 35) {
      tetromino.row++;
      count = 0;

      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }

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
  }
};

document.addEventListener("keydown", (e) => {
  if (gameOver) return;

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
});

RAF = requestAnimationFrame(gameLoop);
