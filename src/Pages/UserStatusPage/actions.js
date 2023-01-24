import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;
const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export const getUserStatus = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Users/GetUserStatus?Userid=${userId}`,
  }).then((res) => callback(res));
};

export const getUserTabsStatus = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Statuses/GetUserStatus/${userId}`,
  }).then((res) => callback(res));
};
