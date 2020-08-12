const { API } = require("../../backend");

export const getUser = (userId, token) => {
  return fetch(`${API}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => {
      // console.log(err);
    });
};

export const updateUser = (userId, userInfo, token) => {
  return fetch(`${API}/user/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userInfo),
  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => {
      // console.log(err);
    });
};
