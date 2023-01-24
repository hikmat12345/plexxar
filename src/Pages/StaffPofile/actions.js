import { fetchAction } from "../../fetchAction";
import jsonToFormData from "json-form-data";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;
const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

export const getProfileFields = ({ userCountryId, staffId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/SignupConfiguration/${userCountryId}/1/${staffId}/2/0/false`,
  }).then((res) => {
    const { signuplist, error } = res;
    error ? callback([]) : callback(signuplist);
  });
};

export const getAddresses = ({ staffId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/GetAddress?staffId=${staffId}`,
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
  staffId,
  callback,
  userCountryId,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Providers/UpdateBusinessProviders?isBusiness=${false}`,
    verb: "PUT",
    payload: JSON.stringify({
      DeviceId: "_web",
      DeviceName: "_web",
      MACAddress: "_web",
      id: parseInt(staffId),
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
  staffId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/AddResidentialAddress`,
    verb: "POST",
    payload: JSON.stringify({
      staffId: parseInt(staffId),
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



export const uploadImage = (staffId, file, response) => {
  const formData = {
    userid: staffId,
    image: file,
  };

  let url = APP_BASE_URL_2 + "/Image/imageupload";

  const requestOptions = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_Bearer}`,
    },
    method: "POST",
    body: jsonToFormData(formData),
  };
  fetch(url, requestOptions)
    .then((res) => res.json())
    .then((res) => response(res))
    .catch((err) => alert(err));
};


export const ChangePassword = ({
  staffId,
  oldPassword,
  newPassword,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/SignIn/ChangePassword`,
    verb: "POST",
    payload: JSON.stringify({
      userId: parseInt(staffId),
      oldPassword: oldPassword,
      newPassword: newPassword,
    }),
  }).then((res) => callback(res));
};
