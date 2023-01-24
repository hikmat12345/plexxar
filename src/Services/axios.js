import axios from "axios";
// const baseURL = process.env.REACT_APP_SOCKET_SERVICE_URL;
const messageBaseUrl = process.env.REACT_APP_MESSAGE_SERVICE_URL;

export const api = axios.create({
  baseURL: messageBaseUrl,
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_Bearer}`,
    "x-auth-token": "", //localStorage.getItem("token"),
  },
  // timeout: 2000,
});
