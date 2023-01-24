import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getAddresses = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/GetAddress?Userid=${userId}`,
  }).then((res) => {
    callback(res);
  });
};

export const getWorkingAddresses = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/GetWorkingAddress?Userid=${userId}`,
  }).then((res) => {
    callback(res);
  });
};

export const changeAddressState = ({ userId, id, state, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/ActiveInActiveAddress`,
    verb: "PUT",
    payload: JSON.stringify({
      id: parseInt(id),
      userId: parseInt(userId),
      isActive: state,
    }),
  }).then((res) => {
    callback(res);
  });
};

export const deleteAddress = ({ id, userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/DeleteAddress?Id=${id}&userId=${userId}`,
    verb: "DELETE",
  }).then((res) => {
    callback(res);
  });
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