import { fetchAction } from "../../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

//get address
export const getAddresses = ({ staffId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/GetAddress?Userid=${staffId}`,
  }).then((res) => {
    callback(res);
  });
};

export const getWorkingAddresses = ({ staffId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/GetWorkingAddress?Userid=${staffId}`,
  }).then((res) => {
    callback(res);
  });
};

export const changeAddressState = ({ staffId, id, state, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/ActiveInActiveAddress`,
    verb: "PUT",
    payload: JSON.stringify({
      id: parseInt(id),
      staffId: parseInt(staffId),
      isActive: state,
    }),
  }).then((res) => {
    callback(res);
  });
};

export const deleteAddress = ({ id, staffId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Address/DeleteAddress?Id=${id}&userId=${staffId}`,
    verb: "DELETE",
  }).then((res) => {
    callback(res);
  });
};
