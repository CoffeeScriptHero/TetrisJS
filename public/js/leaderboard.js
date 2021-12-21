import { getUsers } from "./serverFunctions.js";
import {
  clickSound,
  leaderboardBtn,
  leaderboard,
  leaderboardContent,
  leaderboardList,
} from "./constants.js";

const toggleLeaderboard = () => {
  leaderboardList.textContent = "";
  leaderboard.classList.toggle("display-none");
  const users = getUsers();
  clickSound.play();
  users.then((res) => {
    fillLeaderboard(res);
  });
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
  let firstPlace = "";
  let nicknameArr = [];
  let place = 0;
  let nickname = "";

  const usersList = usersArray.map((u, i) => {
    nicknameArr = u.nickname.split("");
    nickname =
      nicknameArr.length > 10 ? nicknameArr.slice(0, 11).join("") : u.nickname;
    place = i + 1 + ".";
    firstPlace = "";
    if (i === 0) {
      firstPlace = `<div class="trophy-wrapper">
      <i class="nes-icon trophy is-small"></i>
    </div>`;
      place = "";
    }
    return `
    <li class="leaderborad-player">
    <div class="player-name-wrapper">
      ${firstPlace}
      <span class="player-place">${place} </span>
      <span class="player-name">${nickname}</span>
    </div>
      <span class="player-score-title">score: <span class="player-score-number">${u.topScore}</span></span>
      <span class="player-lines-title">lines: <span class="player-lines-number">${u.linesScore}</span></span>
  </li>
  `;
  });
  leaderboardList.insertAdjacentHTML("afterbegin", usersList.join(""));
};
