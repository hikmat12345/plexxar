import { fetchAction } from "../../fetchAction";
const APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;
const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

export const getProfileFields = ({
  userCountryId,
  userId,
  roleId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/SignupConfiguration/${userCountryId}/1/${userId}/${roleId}/0/false`,
  }).then((res) => {
    const { signuplist, error } = res;
    error ? callback([]) : callback(signuplist);
  });
};

export const getAddresses = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/GetAddress?UserId=${userId}`,
  }).then((res) => {
    const { result, code } = res;
    code !== 0
      ? callback({})
      : callback(
          result.some((address) => address.isResidentialAddress === true)
            ? result.find((address) => address.isResidentialAddress === true)
            : {}
        );
  });
};

export const updateProfile = ({
  fieldAnswers,
  userId,
  callback,
  userCountryId,
  isBusiness,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Providers/UpdateBusinessProviders?isBusiness=${isBusiness}`,
    verb: "PUT",
    payload: JSON.stringify({
      DeviceId: "_web",
      DeviceName: "_web",
      MACAddress: "_web",
      id: parseInt(userId),
      lstFields: fieldAnswers,
      countryCode: userCountryId,
      countryId: userCountryId,
    }),
  }).then((res) => callback(res));
};

export const saveResidentialAddress = ({
  address,
  streetAddress,
  lat,
  lng,
  userId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/AddResidentialAddress`,
    verb: "POST",
    payload: JSON.stringify({
      userID: parseInt(userId),
      line1: address,
      address: "",
      line2: streetAddress,
      townCity: "",
      postalCode: "",
      latitude: lat,
      longitude: lng,
    }),
  }).then((res) => callback(res));
};

export const getAddressSuggestions = ({ value, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/GoogleApi/predictions/${value}/${GOOGLE_MAP_API_KEY}`,
  }).then((res) => callback(res.result.predictions));
};

export const getPlaceDetails = ({ placeId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/GoogleApi/placedetails/${placeId}/${GOOGLE_MAP_API_KEY}`,
  }).then((res) => callback(res.result.result));
};
