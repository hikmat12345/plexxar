import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getProviderServices = ({providerId, callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Appointments/GetServiceHierarchy/${providerId}`,
  }).then((res) =>{
    const { code, result } = res;
    code !== 0 ? callback([]) : callback(result);
  });
};

//check available duration
export const getAvailableDuration = ({ resourceId, startStr, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Appointments/CheckAvailableDuration`,
    verb: "POST",
    payload: JSON.stringify({
      resourceId: resourceId,
      start: startStr,
      startDate: startStr,
    }),
  }).then((res) => callback(res));
};