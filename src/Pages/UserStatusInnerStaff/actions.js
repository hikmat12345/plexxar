import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getUserStatus = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Users/GetUserStatus?Userid=${userId}`,
  }).then((res) => callback(res));
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
