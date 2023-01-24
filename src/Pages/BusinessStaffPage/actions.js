import { fetchAction } from "../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getBusinessStaff = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Providers/GetProviders?BusinessId=${userId}`,
  }).then((res) => {
    const { statusCode, providersList } = res;
    statusCode !== 0 ? callback([]) : callback(providersList);
  });
};

export const deleteBusinessStaff = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Providers/DeleteBusinessProvider/${userId}`,
    verb: "PUT",
  }).then((res) => {
    callback(res);
  });
};

export const ActiveInactiveStaff = ({
  businessId,
  providerId,
  isActive,
  authToken,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Business/provider/ActiveInactive`,
    verb: "PUT",
    payload: JSON.stringify({
      businessId,
      providerId,
      isActive,
      authToken,
    }),
  }).then((res) => {
    callback(res);
  });
};
