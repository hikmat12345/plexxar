import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

// get booked product attributes
export const GetBookedProductAttributes = ({ itemId, callback }) => {
    return fetchAction({
        endpoint: `${APP_BASE_URL_2}/Product/GetBookedProductAttributes?ItemId=${itemId}`,
    }).then((res) => callback(res) )
}
