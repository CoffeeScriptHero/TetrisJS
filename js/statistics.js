import { colors } from "./constants.js";

export const canvas = document.getElementById("statisticsCanvas");
const context = canvas.getContext("2d");
export const customFont = new FontFace(
  "customFont",
  "url(fonts/PressStart2P-Regular.otf)"
);

customFont.load().then((font) => {
  document.fonts.add(font);
  fillField();
});

const cell = 22;

export const counters = {
  T: "000",
  J: "000",
  Z: "000",
  O: "000",
  S: "000",
  L: "000",
  I: "000",
};

const field = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, "T", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "T", "T", "T", 0, 0, 0, 0, 0, "P", 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "J", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "J", "J", "J", 0, 0, 0, 0, 0, "P", 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "Z", "Z", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, "Z", "Z", 0, 0, 0, 0, 0, "P", 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, "O", "O", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, "O", "O", 0, 0, 0, 0, 0, "P", 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, "S", "S", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "S", "S", 0, 0, 0, 0, 0, 0, "P", 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, "L", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "L", "L", "L", 0, 0, 0, 0, 0, "P", 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "I", "I", "I", "I", 0, 0, 0, 0, "P", 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const addScore = (num) => {
  return (num < 10 ? "00" : num < 100 ? "0" : "") + num;
};

export const updateScore = (name) => {
  counters[name] = addScore(parseInt(counters[name]) + 1);
  clearStatisticsField();
};

export const refreshStatistics = () => {
  for (const c in counters) {
    counters[c] = "000";
  }
};

export const clearStatisticsField = () => {
  context.clearRect(0, 0, canvas.height + 400, canvas.width + 400);
  fillField();
};

const fillField = () => {
  context.fillStyle = "white";
  context.font = "20px customFont";
  context.textAlign = "center";
  context.fillText("STATISTICS", canvas.width / 2, 25);
  for (let row = 0; row < field.length; row++) {
    for (let col = 0; col <= field[row].length; col++) {
      if (field[row][col] && field[row][col] !== "P") {
        const name = field[row][col];
        context.fillStyle = colors[name];
        context.fillRect(col * cell, row * cell, cell, cell);
        context.strokeRect(col * cell, row * cell, cell, cell);
      }
      if (field[row][col] == "P") {
        const name = field[row].find((letter) => !!letter);
        context.fillStyle = "white";
        context.font = "18px customFont";
        context.textAlign = "right";
        row = name == "I" ? row + 1 : row;
        context.fillText(counters[name], col * cell, row * cell);
      }
    }
  }
};
