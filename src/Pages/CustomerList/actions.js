import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getCustomerByBusinessId = ({
  userCountryId,
  userId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Customer/GetCustomers?UserId=${userId}&CountryId=${userCountryId}`,
    verb: "GET",
  }).then((res) => callback(res));
};
