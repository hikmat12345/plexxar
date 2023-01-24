import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;
const GEO_LOCATION_API_KEY = process.env.REACT_APP_GEO_LOCATION_API_KEY;

//get current time
export const getGeoLocation = ({ callback }) => {
  return fetchAction({
    endpoint: `https://api.ipgeolocation.io/ipgeo?apiKey=${GEO_LOCATION_API_KEY}`,
  }).then((res) => callback(res.time_zone.current_time));
};

//provider description
export const getProvidersDescription = ({ ProviderId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Clinics/GetClinicById/${ProviderId}`,
  }).then((res) => callback(res));
};

export const getProviders = ({ ProviderId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/ProvidersByClinic?UserId=${ProviderId}`,
  }).then((res) => (res.code !== 0 ? callback([]) : callback(res.result)));
};

export const getEventByDate = ({ ProviderId, date, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Appointments/AppointmentByDate?id=${ProviderId}&date=${date}`,
  }).then((res) => (res.code !== 0 ? callback([]) : callback(res.result)));
};

//breaks
export const getBreakTime = ({ ProviderId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/UsersUnAvailablitiesByClinic/${ProviderId}`,
  }).then((res) => callback(res));
};

// get break info
export const GetBreakInfo = ({ breakId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/GetBreakInfo?BreakId=${breakId}`,
  }).then((res) => callback(res.breakInfoResponse));
};

//edit breaktime
export const EditBreakTime = ({
  breakId,
  breaktime,
  callback,
  title,
  description,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/EditBreakTime`,
    verb: "PUT",
    payload: JSON.stringify({
      breakId: breakId,
      minutes: parseInt(breaktime),
      breakDescription: description,
      breakTitle: title,
    }),
  }).then((res) => callback(res));
};

// delete provider break
export const DeleteProviderBreak = ({ breakId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/DeleteProviderBreakTime?BreakId=${breakId}`,
    verb: "DELETE",
  }).then((res) => callback(res));
};
//business availibility
export const getAvailability = ({ ProviderId, isBusiness, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/GetAvailability?ProviderId=${ProviderId}&Isbusiness=${isBusiness}`,
  }).then((res) => {
    const { providerAvailability, code } = res;
    code !== 0 ? callback([]) : callback(providerAvailability);
  });
};

//staff availibility
export const getAvailabilityStaff = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/GetAvailability?ProviderId=${userId}&Isbusiness=${false}`,
  }).then((res) => {
    const { providerAvailability, code } = res;
    code !== 0 ? callback([]) : callback(providerAvailability);
  });
};

//get sub business
export const GetSubBusiness = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Clinics/GetSubBusiness?BusinsessId=${userId}`,
  }).then((res) => {
    const { subBusinesses, code } = res;
    code !== 0 ? callback([]) : callback(subBusinesses);
  });
};

// switch account
export const SwitchAccount = ({ accountswitchid, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/AccountActivity/SwitchAccount`,
    verb: "POST",
    payload: JSON.stringify({
      accountswitchid: accountswitchid,
      deviceid: "web",
      pushtoken: "web",
      deviceplatform: "web",
    }),
  }).then((res) => {
    const { customerData, statusCode } = res;
    statusCode !== 0 ? callback([]) : callback(customerData);
  });
};
