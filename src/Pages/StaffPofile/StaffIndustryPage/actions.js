import { fetchAction } from "../../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export const getIndustry = ({ userCountryId, industryId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Industry/1/${userCountryId}/true`,
  }).then((res) => {
    const { statusCode, industrylist } = res;
    statusCode !== 0
      ? callback([])
      : callback([
          industrylist.find((industry) => industry.industryId === industryId),
        ]);
  });
};
