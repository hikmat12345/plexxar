import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const GetSummary = ({ customerId, cartId, userCountryId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/CalculateSummary/GetSummary?CustomerId=${customerId}&CartId=${cartId}&CountryId=${userCountryId}`,
  }).then((res) => {
    const { result, code } = res;
    code !== 0 ? callback([]) : callback(result);
  });
};

//cash on delivery
export const PlexaarCreateBooking = ({
  paymentAmount,
  providerId,
  customerId,
  numberOfSessions,
  cartId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Booking/PlexaarCreateBooking`,
    verb: "POST",
    payload: JSON.stringify({
      amount: paymentAmount,
      isCaptured: true,
      referralBonusUsed: false,
      cartId,
      voucherCode: "",
      providerId,
      userId: customerId,
      isReferralReceiver: false,
      numberOfSessions,
      chargeId: "cash",

      // bookingid: bookingId,
      // numberOfSession: numberOfSessions,
      // referralbonusused: false,
      // accountNumber: customerAccount,
      // paymentamount: paymentAmount,
      // vouchercode: "",
      // serviceproviderid: providerId,
      // stripepaymentmethodId: "cash",
      // isocode: parseInt(userCountryId),
      // isfreetreatmentused: isfreeConsultation,
      // cartid: cartid,
    }),
  }).then((res) => {
    console.log("result:", res);
    callback(res);
  });
};

//plexaar cod
export const PlexaarCod = ({
  paymentAmount,
  providerId,
  customerId,
  bookingId,
  customerAccount,
  numberOfSessions,
  cartId,
  userCountryId,
  isfreeConsultation,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Payment/PlexaarCod`,
    verb: "POST",
    payload: JSON.stringify({
      bookingid: bookingId,
      numberOfSession: numberOfSessions,
      referralbonusused: false,
      accountNumber: customerAccount,
      paymentamount: paymentAmount,
      vouchercode: "",
      serviceproviderid: providerId,
      stripepaymentmethodId: "cash",
      isocode: parseInt(userCountryId),
      isfreetreatmentused: isfreeConsultation,
      cartid: cartId,
    }),
  }).then((res) => {
    console.log("result:", res);
    callback(res);
  });
};

export const SalesOrder = ({ bookingId, cartId, customerId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/SalesOrder/SalesOrder`,
    verb: "POST",
    payload: JSON.stringify({
      tempBookingId: bookingId,
      cartId,
      userId: customerId,
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
    endpoint: `${APP_BASE_URL_2}SalesOrder/Getinvoice`,
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
