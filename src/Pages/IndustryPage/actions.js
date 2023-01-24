import { fetchAction } from "../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getIndustry = ({ userCountryId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Industry/1/${userCountryId}/true`,
  }).then((res) => {
    const { statusCode, industrylist } = res;
    statusCode !== 0 ? callback([]) : callback(industrylist);
    // [industrylist.find((industry) => industry.industryId === industryId)];
  });
};

export const getBusnissService = ({ providerId, countryId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Industry/GetBusinessServices?ProviderId=${providerId}&countryId=${countryId}`,
    verb: "GET",
  }).then((res) => callback(res));
};

export const getServices = ({
  userId,
  isBusiness,
  userCountryId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Industry/GetServices?industryId=0&userId=${userId}&countryId=${userCountryId}&isBusiness=${isBusiness}`,
  }).then((res) => {
    const { code, result } = res;
    code !== 0 ? callback([]) : callback(result);
  });
};

//add service
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
