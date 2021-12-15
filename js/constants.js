export const tetrominos = {
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

export const colors = {
  I: "cyan",
  O: "yellow",
  T: "purple",
  S: "green",
  Z: "red",
  J: "blue",
  L: "orange",
};

export const customFont = new FontFace(
  "customFont",
  "url(fonts/PressStart2P-Regular.otf)"
);

export const game = document.querySelector(".game");
export const statisticCanvas = document.getElementById("statisticsCanvas");
export const nextCanvas = document.getElementById("nextCanvas");
export const gameAlert = document.querySelector(".game-alert");
export const alertButton = document.querySelector(".alert-button");
export const linesScore = document.querySelector(".lines-score");
export const record = document.querySelector(".alert-record");
export const score = document.querySelector(".score");
export const topScore = document.querySelector(".top-score");
export const alertScore = document.querySelector(".alert-score");
export const regButton = document.querySelector(".registration-button");
export const leaderboard = document.querySelector(".leaderboard");
export const leaderboardBtn = document.querySelector(".leaderboard-btn");
export const leaderboardList = document.querySelector(".leaderboard-list");
export const leaderboardContent = document.querySelector(
  ".leaderboard-content-wrapper"
);
