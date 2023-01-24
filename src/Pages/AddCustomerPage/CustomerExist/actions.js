import { fetchAction } from "../../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

// Account Verification Apis
export const VerifyAccount = ({ userId, isBusiness, account, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Customer/AddClientToBusiness`,
    payload: JSON.stringify({
      userId: JSON.parse(userId),
      accountNumber: account,
      isBusiness: isBusiness,
    }),
    verb: "POST",
  }).then((res) => callback(res));
};

// Send Code To Phone // Email  Apis
export const SendCodeToPhoneEmail = ({
  customerId,
  email,
  mobile,
  isEmail,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Users/SendOTP`,
    payload: JSON.stringify({
      customerId: JSON.parse(customerId),
      email,
      mobile,
      isEmail,
    }),
    verb: "POST",
  }).then((res) => callback(res));
};

// Verify Code  // Email  Apis
export const VerifyCode = ({ userId, userOTP, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Users/VerifyOTP?userId=${userId}&&userOtp=${userOTP}`,
    verb: "GET",
  }).then((res) => callback(res));
};
