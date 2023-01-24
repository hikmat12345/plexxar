import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;


export const getProvidersDescription = ({ urlId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Clinics/GetClinicById/${urlId}`,
  }).then((res) => callback(res));
};

export const getProviders = ({ urlId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/ProvidersByClinic?UserId=${urlId}`,
  }).then((res) => (res.code !== 0 ? callback([]) : callback(res.result)));
};

//for provider detail
export const getProviderDetail = ({ urlId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/GetProviderDetails/${urlId}`,
  }).then((res) => (callback(res)));
};


export const getEventByDate = ({ urlId, urlDate, callback }) => {
  return fetchAction({  
    endpoint: `${APP_BASE_URL_2}/Appointments/AppointmentByDate?id=${urlId}&date=${urlDate}`,
  }).then((res) => (res.code !== 0 ? callback([]) : callback(res.result)));
};

// for single provider appointments
export const getProviderEventByDate = ({ urlId, urlDate, callback }) => {
  return fetchAction({  
    endpoint: `${APP_BASE_URL_2}/Appointments/ProviderAppointmentByDate?ProviderId=${urlId}&date=${urlDate}`,
  }).then((res) => (res.code !== 0 ? callback([]) : callback(res.result)));
};

//business availibility
export const getAvailability = ({ urlId , urlIsBusiness, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/GetAvailability?ProviderId=${urlId}&Isbusiness=${urlIsBusiness}`,
  }).then((res) => {
    const { providerAvailability, code } = res;
    code !== 0 ? callback([]) : callback(providerAvailability);
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

//breaks 
export const getBreakTime = ({ urlId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/UsersUnAvailablitiesByClinic/${urlId}`,
  }).then((res) => callback(res.response));
};

//breaks for single provider
export const getProviderBreakTime = ({ urlId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/ProviderUnAvailablitiesByClinic/${urlId}`,
  }).then((res) => callback(res));
};

