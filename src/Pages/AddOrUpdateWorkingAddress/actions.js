import { fetchAction } from "../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;
const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

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

export const saveWorkingAddress = ({
  userId,
  address,
  streetAddress,
  lat,
  lng,
  radius,
  inclinic,
  isBusiness,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/AddWorkingAddress`,
    verb: "POST",
    payload: JSON.stringify({
      userID: parseInt(userId),
      line1: address,
      address: "",
      line2: "",
      townCity: "",
      postalCode: "",
      latitude: lat,
      longitude: lng,
      radius: radius,
      isActive: true,
      isBusiness: isBusiness,
      inclinic: inclinic,
    }),
  }).then((res) => callback(res));
};
