import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

// get product attributes
export const GetProductAttributes = ({ productId, callback }) => {
    return fetchAction({
        endpoint: `${APP_BASE_URL_2}/Product/GetProductAttributes?ProductId=${productId}`,
    }).then((res) => {
        const { attributeList, code } = res;
        code !== 0 ? callback([]) : callback(attributeList);
    })
}

//Save product Attributes
export const SaveProductBookingAttributes = ({ cartId, productId, bookingId, form, callback }) => {
    return fetchAction({
        endpoint: `${APP_BASE_URL_2}/Product/SaveProductBookingAttributes`,
        verb: "POST",
        payload: JSON.stringify({
            cartId: cartId,
            productId: productId,
            itemNo: 1,
            tempBookingID: bookingId,
            notes: "abc",
            attributes: form,
      }),
    }).then((res) => callback(res));
};