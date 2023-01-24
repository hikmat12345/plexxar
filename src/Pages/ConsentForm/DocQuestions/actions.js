import jsonToFormData from "json-form-data";
import { getCookies } from "../../../utils";
const APP_BASE_URL_3 = process.env.REACT_APP_BASE_URL_3;

export const uploadImage = (file, response) => {
  var providerAccesstoken = getCookies("customer_details").authToken;
  const formData = {
    documentFile: file,
    authToken: providerAccesstoken,
  };

  let url = APP_BASE_URL_3 + "/SignUp/uploadsignupdocument";

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
