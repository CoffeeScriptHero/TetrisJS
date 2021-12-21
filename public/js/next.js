import {
  tetrominos,
  colors,
  customFont,
  nextCanvas as canvas,
} from "./constants.js";

const context = canvas.getContext("2d");

customFont.load().then(() => {
  context.fillStyle = "white";
  context.font = "20px customFont";
  context.textAlign = "center";
  context.fillText("NEXT", canvas.width / 2, 25);
});

let cell = 30;

export const clearField = () => {
  context.clearRect(0, 30, canvas.height + 100, canvas.width + 100);
};

export const fillField = (tetromino) => {
  context.fillStyle = colors[tetromino];
  cell = 30;
  let rowBorder = 5;
  let colBorder = 5;
  let row = 2;
  let col = 1;

  switch (tetromino) {
    case "O":
      rowBorder = 5;
      colBorder = 5;
      row = 3;
      col = 2;
      cell = 24;
      break;
    case "I":
      rowBorder = 5;
      colBorder = 5;
      col = 1;
      cell = 24;
      break;
  }

  for (let r = row; r < rowBorder; r++) {
    for (let c = col; c < colBorder; c++) {
      if (tetrominos[tetromino][r - row][c - col]) {
        context.fillRect(c * cell, r * cell, cell, cell);
        context.strokeRect(c * cell, r * cell, cell, cell);
      }
    }
  }
};
