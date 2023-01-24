import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getAvailability = ({ userId, isBusiness, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/GetAvailability?ProviderId=${userId}&Isbusiness=${isBusiness}`,
  }).then((res) => {
    const { providerAvailability, code } = res;
    code !== 0 ? callback([]) : callback(providerAvailability);
  });
};

export const saveAvailability = ({
  userId,
  selectedDayAndTime,
  isBusiness,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/AddAvailability`,
    verb: "POST",
    payload: JSON.stringify({
      providerAvailability: selectedDayAndTime,
      providerId: parseInt(userId),
      isBusiness,
    }),
  }).then((res) => {
    callback(res);
  });
};
