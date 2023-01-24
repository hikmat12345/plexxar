import { fetchAction } from "../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getIndustry = ({ userCountryId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Industry/1/${userCountryId}/true`,
  }).then((res) => {
    const { statusCode, industrylist } = res;
    statusCode !== 0 ? callback([]) : callback(industrylist);
    // [industrylist.find((industry) => industry.industryId === industryId)];
  });
};

export const getBusnissService = ({ providerId, countryId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Industry/GetBusinessServices?ProviderId=${providerId}&countryId=${countryId}`,
    verb: "GET",
  }).then((res) => callback(res));
};
