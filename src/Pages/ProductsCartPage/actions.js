import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const AddToCartProducts = ({
  id,
  cartId,
  productQuantity,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Product/AddToCart`,
    verb: "POST",
    payload: JSON.stringify({
      productId: id,
      cartId: cartId,
      items: productQuantity,
    }),
  }).then((res) => callback(res));
};

export const AddCartItem = ({ id, cartId }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Product/AddCartItems`,
    verb: "POST",
    payload: JSON.stringify({
      itemId: id,
      cartId: cartId,
    }),
  });
};

export const RemoveCartItem = ({ id, cartId }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Product/RemoveCartItems?ItemId=${id}&CartId=${cartId}`,
    verb: "DELETE",
  });
};

export const DeleteCart = ({ productId, id, cartId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Product/DeleteCart?ProductId=${productId}&ItemId=${id}&CartId=${cartId}`,
    verb: "DELETE",
  }).then((res) => callback(res));
};

export const GetCartDetails = ({ cartId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Product/GetCartDetails?CartId=${cartId}`,
  }).then((res) => {
    res.code !== 0 ? callback([]) : callback(res);
  });
};
