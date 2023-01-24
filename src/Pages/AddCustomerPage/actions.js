import { fetchAction } from "../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const saveClient = ({
  businessId,
  firstName,
  lastName,
  email,
  phoneNumber,
  userCountryId,
  isExpertState,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Users/AddClient`,
    verb: "POST",
    payload: JSON.stringify({
      firstname: firstName,
      lastname: lastName,
      email: email,
      mobile: phoneNumber,
      businessid: parseInt(businessId),
      countryId: parseInt(userCountryId),
      isExpert: isExpertState,
    }),
  }).then((res) => callback(res));
};

export const serachClient = ({ searchObject, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Users/SearchUserNew`,
    verb: "POST",
    payload: JSON.stringify({
      email: searchObject.email,
      mobile: searchObject.phoneNumber,
      businessid: parseInt(searchObject.businessId),
    }),
  }).then((res) => {
    callback(res);
  });
};

// check existing account 
export const searchExistingAccount = ({ accountNumber, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Customer/GetCustomerDetail?AccountNumber=${accountNumber}`
  }).then((res) => {
    callback(res);
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

//add provider breaktime
export const addProviderBreakTime = ({
  providerId,
  date,
  startTime,
  breaktime,
  breaktimeDescription,
  breaktimeTitle,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/AddProviderBreakTime`,
    verb: "POST",
    payload: JSON.stringify({
      userId: parseInt(providerId),
      date: date,
      startTime: startTime,
      minutes: breaktime,
      breakDescription: breaktimeDescription,
      breakTitle: breaktimeTitle,
    }),
  }).then((res) => callback(res));
};

export const VerifyAddClientSMSCode = ({ customerId, code, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/NewUser/VerifyAddClientSMSCode`,
    verb: "POST",
    payload: JSON.stringify({
      userId: customerId,
      verificationCode: code,
    }),
  }).then((res) => callback(res));
};
