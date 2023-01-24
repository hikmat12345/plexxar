import { fetchAction } from "../../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getAvailability = ({ staffId, isBusiness, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/GetAvailability?ProviderId=${staffId}&Isbusiness=${isBusiness}`,
  }).then((res) => {
    const { providerAvailability, code } = res;
    code !== 0 ? callback([]) : callback(providerAvailability);
  });
};

export const saveAvailability = ({ staffId, selectedDayAndTime, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/AddAvailability`,
    verb: "POST",
    payload: JSON.stringify({
      providerAvailability: selectedDayAndTime,
      providerId: parseInt(staffId),
      isBusiness: false,
    }),
  }).then((res) => {
    callback(res);
  });
};
