import { fetchAction } from "../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export const getStaffForm = ({ userCountryId, currentStep, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/SignupConfiguration/${userCountryId}/1/0/2/${currentStep}/true`,
  }).then((res) => {
    const { signuplist, totalSteps, error } = res;
    error ? callback([]) : callback({ signuplist, totalSteps });
  });
};

export const saveStaffForm = ({
  userId,
  fieldAnswers,
  userCountryId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Providers/AddProvider`,
    verb: "POST",
    payload: JSON.stringify({
      DeviceId: "_web",
      DeviceName: "_web",
      MACAddress: "_web",
      CountryCode: userCountryId,
      lstFields: fieldAnswers,
      businessId: parseInt(userId),
    }),
  }).then((res) => callback(res));
};
