import { fetchAction } from "../../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getServices = ({ userCountryId, industryId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Services/GetAllServicesAndSubServices/${industryId}/${userCountryId}`,
  }).then((res) => {
    const { statusCode, servicesList } = res;
    statusCode !== 0 ? callback([]) : callback(servicesList);
  });
};

// export const addServices = ({ userId, checkedArray, callback }) => {
//   return fetchAction({
//     endpoint: `${APP_BASE_URL}/Providers/AddProviderServices`,
//     verb: "POST",
//     payload: JSON.stringify({
//       providerId: parseInt(userId),
//       services: checkedArray.toString(),
//     }),
//   }).then((res) => callback(res));
// };

export const addServices = ({ staffId, serviceId, house, clinic, online, radioValue, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Industry/AddUserService`,
    verb: "POST",
    payload: JSON.stringify({
      userId: parseInt(staffId),
      serviceId: parseInt(serviceId),
      isInhouse: house,
      isInclinic: clinic,
      isOnline: online,
      genderPreference: radioValue,
      isBusiness: true,
    }),
  }).then((res) => callback(res));
};