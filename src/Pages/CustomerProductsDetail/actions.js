import { fetchAction } from "../../fetchAction";
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const GetCartDetails = ({ cartId, callback}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Product/GetCartDetails?CartId=${cartId}`,
  }).then((res) => {
    res.code !==0 ? callback([]) :  callback(res)
  })
}
