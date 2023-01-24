import { getCookies } from "../../utils";
import jsonToFormData from "json-form-data";
import { fetchAction } from "../../fetchAction";
const APP_BASE_URL_3 = process.env.REACT_APP_BASE_URL_3;
const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export const GetConsentForm = ({
  serviceId,
  bookingId,
  sessionId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Question/GetServiceQuestions/${serviceId}/${bookingId}/${sessionId}`,
  }).then((res) => {
    callback(res);
  });
};

export const getStatuses = (callback) => {
  fetch(
    `${APP_BASE_URL_3}/Country/getansweredsteps?authtoken=${
      getCookies("customer_details").authToken
    }`
  )
    .then((res) => res.json())
    .then((res) => callback(res))
    .catch((err) => alert(err));
};

//update customer profile
export const UpdatePersonalInfo = ({
  customerId,
  customerForm,
  customerEmail,
  callback,
}) => {
  const { firstName, lastName, dob, gender } = customerForm;
  return fetchAction({
    endpoint: `${APP_BASE_URL}/NewUser/UpdatePersonalInfo`,
    verb: "POST",
    payload: JSON.stringify({
      userId: customerId,
      strPassword: "",
      emailAddress: "",
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      dob: dob,
    }),
  }).then((res) => callback(res));
};

export const SaveConsent = ({
  bookingId,
  sessionId,
  cartId,
  customerId,
  signatureImageUrl,
  consentDate,
  consentTime,
  final,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Question/SaveServiceConsentAnswers`,
    verb: "POST",
    payload: JSON.stringify({
      bookingId: parseInt(bookingId),
      sessionId,
      cartId,
      userId: parseInt(customerId),
      signatureImageUrl,
      consentDate,
      consentTime,
      answers: final,
    }),
  }).then((res) => callback(res));
};

export const SaveSignatureConsent = (file, response) => {
  const formData = {
    SaveConsentFile: file,
  };

  let url = APP_BASE_URL + "/Question/UploadServiceConsentSignature";

  const requestOptions = {
    method: "POST",
    body: jsonToFormData(formData),
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_Bearer}`,
    },
  };
  fetch(url, requestOptions)
    .then((res) => res.json())
    .then((res) => response(res))
    .catch((err) => alert(err));
};
