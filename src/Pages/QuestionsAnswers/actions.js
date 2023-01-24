import { getCookies } from "../../utils";

const APP_BASE_URL_3 = process.env.REACT_APP_BASE_URL_3;

export const getQuestions = (pageNumber, callback) => {
  fetch(
    `${APP_BASE_URL_3}/Country/getmultilevequestions?step=${pageNumber}&authtoken=${
      getCookies("customer_details").authToken
    }`
  )
    .then((res) => res.json())
    .then((res) => callback(res))
    .catch((err) => alert(err));
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
