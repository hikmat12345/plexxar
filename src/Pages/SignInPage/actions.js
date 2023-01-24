import { fetchAction } from "../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2

export const signIn = ({ email, account, phone, password, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/SignIn/SignIn`,
    payload: JSON.stringify({
      email: email,
      accountNumber: account,
      mobileNumber: phone,
      password: password,
      forceLogout: false,
      isMobile: false,
      deviceId: "web",
      devicePlatform: "web",
      deviceName: "web",
      macAddress: "web",
      pushToken: "web",
    }),
    verb: "POST",
  }).then((res) => callback(res));
};

export const ForgetPassword = ({ email, isReset, isVerifyCode, resetCode, password, isUpdatePassword, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Customer/BusinessResetPassword`,
    payload: JSON.stringify({
      isCustomer: false,
      isReset: isReset,
      isVerifyCode: isVerifyCode,
      isUpdatePassword: isUpdatePassword,
      email: email,
      resetCode: resetCode,
      password: password,
    }),
    verb: "POST",
  }).then((res) => callback(res));
};