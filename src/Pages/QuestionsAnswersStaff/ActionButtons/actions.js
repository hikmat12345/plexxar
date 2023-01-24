import { getCookies } from "../../../utils";

const APP_BASE_URL_3 = process.env.REACT_APP_BASE_URL_3;

export const saveAnswers = (answerList, response) => {
  let url = APP_BASE_URL_3 + "/Country/saveanswers";
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answerList: answerList,
      authtoken: getCookies("staffAuth"),
    }),
  };

  fetch(url, requestOptions)
    .then((res) => res.json())
    .then((res) => response(res))
    .catch((err) => alert(err));
};
