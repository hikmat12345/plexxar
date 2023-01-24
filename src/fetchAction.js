import history from "./history";

export const fetchAction = (action) => {
  const { endpoint, headers, payload, verb } = action;

  const result = new Promise((resolve, reject) => {
    fetch(endpoint, {
      method: verb,
      headers: { 
        "Content-Type": "application/json",
        mode: "no-cors",
        Authorization: `bearer ${process.env.REACT_APP_Bearer}`,
        // Authorization: `Basic ${Buffer.from(
        //   `${process.env.REACT_APP_USER_NAME}:${process.env.REACT_APP_PASSWORD}`
        // ).toString("base64")}`,
        "Access-Control-Allow-Origin": "*",
        ...headers,
      },
      body: payload,
    })
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => history.push("/not-found"));
  });
  return result;
};
