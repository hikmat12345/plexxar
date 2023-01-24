import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const PlexaarCreateBooking = ({
  totalAmount,
  providerId,
  customerId,
  numberOfSessions,
  cartId,
  chargeId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Booking/PlexaarCreateBooking`,
    verb: "POST",
    payload: JSON.stringify({
      amount: totalAmount,
      isCaptured: true,
      referralBonusUsed: false,
      cartId,
      voucherCode: "",
      providerId,
      userId: customerId,
      isReferralReceiver: false,
      numberOfSessions,
      chargeId,
    }),
  }).then((res) => {
    callback(res);
  });
};

export const SendPaymentLink = ({
  bookingId,
  customerId,
  nextDate,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/SalesOrder/SendPaymentLink`,
    verb: "POST",
    payload: JSON.stringify({
      bookingId,
      customerId,
      payAbleByDate: nextDate,
    }),
  }).then((res) => {
    callback(res);
  });
};

export const Getinvoice = ({
  salesOrderNumber,
  bookingId,
  cartId,
  customerId,
  providerId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/SalesOrder/Getinvoice`,
    verb: "POST",
    payload: JSON.stringify({
      salesOrderNumber,
      cartId,
      bookingId,
      userId: customerId,
      providerId,
    }),
  }).then((res) => {
    callback(res);
  });
};
