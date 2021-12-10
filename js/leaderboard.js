import {
  leaderboardBtn,
  leaderboard,
  leaderboardContent,
} from "./constants.js";

const toggleLeaderboard = () => {
  leaderboard.classList.toggle("display-none");
};

const closeLeaderBoard = (e) => {
  if (e.target !== leaderboardContent) {
    toggleLeaderboard();
  }
};

export const leaderboardHandler = () => {
  leaderboardBtn.addEventListener("click", toggleLeaderboard);
  leaderboard.addEventListener("click", closeLeaderBoard);
};

export const fillLeaderboard = (usersArray) => {
  // each user === array
  const usersList = usersArray.map(
    (u) => `
    <li class="leaderborad-player">
    <span class="player-place">1. </span>
    <span class="player-name">${u.nickname}</span>
    <span class="player-score-title">score: <span class="player-score-number">${u.highScore}</span></span>
    <span class="player-lines-title">lines: <span class="player-lines-number">${u.linesScore}</span></span>
  </li>
  `
  );
};
