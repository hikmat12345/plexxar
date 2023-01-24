import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getProducts = ({ serviceId, cartId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Product/GetServiceProducts?ServiceId=${serviceId}&CartId=${cartId}`,
  }).then((res) => {
    callback(res)
    // const { providerAvailability, code } = res;
    // code !== 0 ? callback([]) : callback(providerAvailability);
  });
};

export const AddToCartProducts = ({ id, cartId , productQuantity, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Product/AddToCart`,
    verb: "POST",
    payload: JSON.stringify({
      productId: id,
      cartId: cartId,
      items: productQuantity
    }),
  }).then((res) => callback(res));
};


export const RemoveFromCart = ({ serviceId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/DeleteBusinessProviderServices/${serviceId}`,
    verb: "PUT",
  }).then((res) => callback(res));
};

export const GetCartDetails = ({ cartId, callback}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Product/GetCartDetails?CartId=${cartId}`,
  }).then((res) => callback(res))
}