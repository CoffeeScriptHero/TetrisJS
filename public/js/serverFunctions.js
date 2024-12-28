import { topScore } from "./constants.js";

export const submitScore = async (data) => {
  const response = await fetch(
    "https://tetris-3d6efada5e34.herokuapp.com/submit-score",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
};

export const getTopScore = async (data) => {
  const response = await fetch(
    "https://tetris-3d6efada5e34.herokuapp.com/get-top-score",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
};

export const setTopScore = () => {
  const id = parseInt(localStorage.getItem("id"));
  if (id) {
    getTopScore({ id }).then((res) => {
      topScore.textContent = res.topScore;
    });
  } else {
    topScore.textContent = "000000";
  }
};

export const createUser = async (data) => {
  const response = await fetch(
    "https://tetris-3d6efada5e34.herokuapp.com/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(
    "https://tetris-3d6efada5e34.herokuapp.com/get-users"
  );
  return response.json();
};
