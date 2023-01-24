import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getBookingByCustomerId = ({ customerId, userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Customer/GetCustomerBookings?customerId=${customerId}&businessId=${userId}`,
    verb: "GET",
  }).then((res) => callback(res));
};
