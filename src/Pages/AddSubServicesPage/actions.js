import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

// export const getServices = ({ userCountryId, industryId, callback }) => {
//   return fetchAction({
//     endpoint: `${APP_BASE_URL}/Services/GetAllServicesAndSubServices/${industryId}/${userCountryId}`,
//   }).then((res) => {
//     const { statusCode, servicesList } = res;
//     statusCode !== 0 ? callback([]) : callback(servicesList);
//   });
// };

export const getSubServices = ({
  userId,
  userCountryId,
  serviceId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Industry/GetSubServices?serviceId=${serviceId}&countryId=${userCountryId}&userId=${userId}`,
  }).then((res) => {
    const { code, result } = res;
    code !== 0 ? callback([]) : callback(result);
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

export const addServices = ({
  userId,
  serviceId,
  isInhouse,
  isInclinic,
  isOnline,
  isBusiness,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Industry/AddUserService`,
    verb: "POST",
    payload: JSON.stringify({
      userId: parseInt(userId),
      serviceId: parseInt(serviceId),
      isInhouse,
      isInclinic,
      isOnline,
      genderPreference: "both",
      isBusiness,
    }),
  }).then((res) => callback(res));
};
