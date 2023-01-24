import { fetchAction } from "../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export const getUserServices = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Providers/GetProviderServices`,
    verb: "POST",
    payload: JSON.stringify({
      providerId: userId,
    }),
  }).then((res) => callback(res));
};
export const deleteUserService = ({ serviceId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Providers/DeleteBusinessProviderServices/${serviceId}`,
    verb: "PUT",
  }).then((res) => callback(res));
};
