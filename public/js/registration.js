import { game, musicOn, clickSound } from "./constants.js";
import { modifyRAF, gameLoop, theme } from "./index.js";
import { createUser } from "./serverFunctions.js";

const isValidNickname = (nickname) => {
  const nicknameArr = nickname.split("");
  if (nickname.trim() == "") {
    return "empty";
  } else if (nicknameArr.length > 35) {
    return "long";
  }
  return true;
};

const generateId = () => {
  const random = Date.now() * Math.random();
  const id = random.toString().substring(4, 8);
  return id;
};

const endRegistration = (register, nickname, id) => {
  register.classList.add("register-wrapper-removed");
  modifyRAF(gameLoop);
  if (game.classList.contains("game-hidden")) {
    game.classList.add("game-transition");
    game.classList.remove("game-hidden");
    document.querySelector(".author").classList.remove("display-none");
  }
  localStorage.setItem("player", nickname);
  localStorage.setItem("id", id);
  localStorage.setItem("music", "1");
  setTimeout(() => {
    theme.play();
    musicOn.classList.remove("svg-display-none");
    theme.volume = 0.05;
  }, 3500);
};

const registration = `
    <div class="register-wrapper">
        <p class="register-upper-text">Create a nickname:</p>
          <div class="register-content-wrapper">
            <input class="input nes-input is-success" type="text"> 
            <span class="nickname-error-empty nickname-error display-none">The input line is empty</span>
            <span class="nickname-error-long nickname-error display-none">Nickname is too long</span>
            <span class="nickname-error-exist nickname-error display-none">Nickname is already exist</span>
            <button class="confirm-registration nes-btn is-success" href="#">Let${"`"}s go</button>
          </div>
    </div>
    `;

const inputHandler = (errorEmpty, errorLong, errorExist, input, e) => {
  const result = isValidNickname(e.target.value);

  errorExist.classList.add("display-none");

  if (result === "empty") {
    errorEmpty.classList.remove("display-none");
    errorLong.classList.add("display-none");
    input.classList.add("is-error");
  } else if (result === "long") {
    errorLong.classList.remove("display-none");
    errorEmpty.classList.add("display-none");
    input.classList.add("is-error");
  } else {
    errorLong.classList.add("display-none");
    errorEmpty.classList.add("display-none");
    input.classList.remove("is-error");
  }
};

export const generateRegistration = () => {
  document.body.insertAdjacentHTML("afterbegin", registration);
  const regButton = document.querySelector(".confirm-registration");
  const registerWrapper = document.querySelector(".register-wrapper");
  const input = document.querySelector(".input");
  const errorEmpty = document.querySelector(".nickname-error-empty");
  const errorLong = document.querySelector(".nickname-error-long");
  const errorExist = document.querySelector(".nickname-error-exist");

  setTimeout(() => {
    game.classList.add("game-transition");
  }, 2000);

  input.addEventListener(
    "input",
    inputHandler.bind(null, errorEmpty, errorLong, errorExist, input)
  );

  registerWrapper.addEventListener("transitionend", () => {
    registerWrapper.remove();
  });

  regButton.addEventListener("click", (e) => {
    clickSound.play();
    const result = isValidNickname(input.value);
    const nickname = input.value;
    const id = generateId();
    if (result === true) {
      createUser({ nickname: nickname, id: id }).then((res) => {
        if (res.status === "ok") {
          endRegistration(registerWrapper, nickname, id);
        } else {
          errorExist.classList.remove("display-none");
          input.classList.add("is-error");
        }
      });
    } else if (result === "empty") {
      errorEmpty.classList.remove("display-none");
      input.classList.add("is-error");
    }
  });
};
