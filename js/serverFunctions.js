export const submitScore = async (data) => {
  const response = await fetch("http://localhost:3000/submit-score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const createUser = async (data) => {
  const response = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch("http://localhost:3000/get-users");
  return response.json();
};
