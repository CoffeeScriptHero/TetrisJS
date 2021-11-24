import { game } from "./constants.js";

const registration = `
    <div class="register-wrapper">
        <p class="register-upper-text">Create a nickname:</p>
        <form>
            <input class="input" type="text"> 
            <button type="submit" class="confirm-registration">Lets go</button>
        </form>
    </div>
    `;

export const generateRegistration = () => {
  document.body.insertAdjacentHTML("afterbegin", registration);
  const regButton = document.querySelector(".confirm-registration");
  const registrationWrapper = document.querySelector(".register-wrapper");
  const input = document.querySelector(".input");
  console.log(registrationWrapper);
  regButton.addEventListener("click", (e) => {
    game.classList.remove("display-none");
    document.querySelector(".register-wrapper").remove();
  });
};
