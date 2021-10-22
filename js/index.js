const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const cell = 32;
let field = [];
let tSequence = [];
let RAF = null;
let count = 0;
let gameOver = false;

const theme = new Audio("../audio/theme.mp3");
theme.loop = true;
theme.volume = 0.05;
// theme.play();

for (let row = -2; row < canvas.height / 32; row++) {
  field[row] = [];
  for (let col = 0; col < canvas.width / 32; col++) {
    field[row][col] = 0;
  }
}

const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

const colors = {
  I: "cyan",
  O: "yellow",
  T: "purple",
  S: "green",
  Z: "red",
  J: "blue",
  L: "orange",
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

const getNextTetromino = () => {
  if (tSequence.length === 0) {
    generateSequence();
  }

  const name = tSequence.pop();
  const matrix = tetrominos[name];
  const col = field[0].length / 2 - Math.ceil(matrix[0].length / 2);
  const row = name === "I" ? -1 : -2;

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
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        if (tetromino.row + row < 0) {
          return showGameOver();
        }
        field[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  for (let row = field.length - 1; row >= 0; ) {
    if (field[row].every((rowCell) => !!rowCell)) {
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < field[r].length; c++) {
          field[r][c] = field[r - 1][c];
        }
      }
    } else {
      row--;
    }
  }
  tetromino = getNextTetromino();
};

const showGameOver = () => {
  cancelAnimationFrame(RAF);
  gameOver = true;
  console.log("game over");
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

  if (e.key === "ArrowUp") {
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
  if (e.key === " ") {
    for (let row = tetromino.row; row < field.length; row++) {
      tetromino.row = row - 1;
      if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
        placeTetromino();
        return;
      }
    }
  }
});

RAF = requestAnimationFrame(gameLoop);
