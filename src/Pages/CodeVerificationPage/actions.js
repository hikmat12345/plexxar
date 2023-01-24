import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const verifyCode = ({ emailCode, smsCode, email, mobile, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Users/VerifyEmailSMSOTP`,
    verb: "POST",
    payload: JSON.stringify({
      email,
      mobile,
      smsCode,
      emailCode,
    }),
  }).then((res) => callback(res));
};

export const ResendCode = ({ mobile, callback, email }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Users/ResendSMSEmailCode`,
    verb: "POST",
    payload: JSON.stringify({
      email,
      mobile,
    }),
  }).then((res) => callback(res));
};
