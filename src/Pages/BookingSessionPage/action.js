import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

// get service session 
export const GetServiceSession = ({serviceId, userCountryId, callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/ServiceTypeSession/GetServiceSessionsWithPrice?ServiceId=${serviceId}&CountryId=${userCountryId}`,
  }).then((res) =>{
    const { code, serviceSessions } = res;
    code !== 0 ? callback([]) : callback(serviceSessions)
  });
};