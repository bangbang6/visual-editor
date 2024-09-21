import axios from "axios";
export function getUsername(id) {
  return axios
    .get(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then((res) => {
      return res.data.username;
    });
}
