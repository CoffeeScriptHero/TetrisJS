import { game } from "./constants.js";
import { modifyRAF, gameLoop } from "./index.js";

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

const createUser = async (data) => {
  const response = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

const registration = `
    <div class="register-wrapper">
        <p class="register-upper-text">Create a nickname:</p>
          <div class="register-content-wrapper">
            <input class="input" type="text"> 
            <span class="nickname-error-empty nickname-error display-none">The input line is empty</span>
            <span class="nickname-error-long nickname-error display-none">Nickname is too long</span>
            <span class="nickname-error-exist nickname-error display-none">Nickname is already exist</span>
            <button class="confirm-registration">Lets go</button>
          </div>
    </div>
    `;

export const generateRegistration = () => {
  document.body.insertAdjacentHTML("afterbegin", registration);
  const regButton = document.querySelector(".confirm-registration");
  const registerWrapper = document.querySelector(".register-wrapper");
  const input = document.querySelector(".input");
  const errorEmpty = document.querySelector(".nickname-error-empty");
  const errorLong = document.querySelector(".nickname-error-long");

  game.classList.add("game-hidden");

  setTimeout(() => {
    game.classList.add("game-transition");
  }, 2000);

  input.addEventListener("input", (e) => {
    const result = isValidNickname(e.target.value);

    if (result === "empty") {
      errorEmpty.classList.remove("display-none");
      errorLong.classList.add("display-none");
      input.classList.add("input-error");
    } else if (result === "long") {
      errorLong.classList.remove("display-none");
      errorEmpty.classList.add("display-none");
      input.classList.add("input-error");
    } else {
      errorLong.classList.add("display-none");
      errorEmpty.classList.add("display-none");
      input.classList.remove("input-error");
    }
  });

  registerWrapper.addEventListener("transitionend", () => {
    registerWrapper.remove();
  });

  regButton.addEventListener("click", (e) => {
    const result = isValidNickname(input.value);
    const nickname = input.value;
    const id = generateId();

    if (result === true) {
      createUser({ nickname: nickname, id: id }).then((res) => {
        if (res.status === "bad") return;
      });

      registerWrapper.classList.add("register-wrapper-removed");
      modifyRAF(gameLoop);
      if (game.classList.contains("game-hidden")) {
        game.classList.add("game-transition");
        game.classList.remove("game-hidden");
      }
      localStorage.setItem("player", nickname);
      localStorage.setItem("id", generateId());
    } else if (result === "empty") {
      errorEmpty.classList.remove("display-none");
      input.classList.add("input-error");
    }
  });
};
