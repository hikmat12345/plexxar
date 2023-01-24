import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

//customer cards
export const GetCustomerPaymentCards = ({customerAccount, callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Payment/GetCustomerPaymentCards?AccountNumber=${customerAccount}`,
  }).then((res) =>{
    const { code, paymentList } = res;
    code !== 0 ? callback([]) : callback(paymentList)
  });
};

//send otp
export const sendPaymentOtp = ({ customerAccount, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Payment/sendpaymentotp`,
    verb: "POST",
    payload: JSON.stringify({ accountNumber: customerAccount }),
  }).then((res) => {
    callback(res);
  });
};

//ResendPaymentCode
export const ResendPaymentCode = ({ customerAccount, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Payment/ResendPaymentCode`,
    verb: "POST",
    payload: JSON.stringify({ accountNumber: customerAccount }),
  }).then((res) => {
    callback(res);
  });
};

//verify otp 
export const verifyPaymentOtp = ({ customerAccount, code, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Payment/verifypaymentotp`,
    verb: "POST",
    payload: JSON.stringify({ 
      accountNumber: customerAccount,
      paymentOTP: code, 
    }),
  }).then((res) => {
    callback(res);
  });
};

// capture card payment 
export const CapturePayment = ({
  customerAccount,
  paymentAmount,
  bookingId,
  clickedId,
  cartId,
  userCountryId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Payment/CapturePayment`,
    verb: "POST",
    payload: JSON.stringify({
      accountNumber: customerAccount,
      paymentAmount: paymentAmount,
      bookingID: bookingId,
      stripePaymentMethodId: clickedId,
      cartid: cartId,
      countryId: userCountryId,
      voucherCode: "",
    }),
  }).then((res) => {
    callback(res);
    // const { code, result } = res;
    // code !== 0 ? callback([]) : callback(result);
  });
};
