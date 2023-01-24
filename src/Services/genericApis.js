/* eslint-disable no-unused-vars */
import { getCookies, getCustomerId, setCookies } from "../utils";
import { api } from "./axios";
import { SocketService } from "./SocketService";
const baseURL = process.env.REACT_APP_BASE_URL_2;
const apiendpoint = baseURL + "/Providers/ProvidersByClinic?UserId=";

export const getAndSetBuisenessProviders = () => {
  const detail = getCookies("customer_details");
  const providers = getCookies("providers");
  const { id, isBusiness } = detail;

  if (!isBusiness) return Promise.reject("not a buisenes account");

  if (providers) {
    providers.providers.forEach((prov) => SocketService.join(prov));
    console.log("providers joined ", providers.providers.length);
    return Promise.resolve(providers);
  }

  console.log("calling for new ones providers also ....");
  return api
    .get(apiendpoint + `${id}`)
    .then((res) => {
      const { result } = res.data;
      let ids = [];
      result.forEach((itm) => {
        SocketService.join(itm.id);
        ids.push(itm.id);
      });
      setCookies("providers", { providers: ids });
      return Promise.resolve(ids);
    })
    .catch((err) => {
      console.log(err);
      return Promise.reject(err);
    });
};
