import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getUserStatus = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Users/GetWelcomeScreenStatus?Userid=${userId}`,
  }).then((res) => callback(res));
};
