import { fetchAction } from "../../fetchAction";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export const getSignUpForm = ({ userCountryId, currentStep, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/SignupConfiguration/${userCountryId}/1/0/4/${currentStep}/true`,
  }).then((res) => {
    const { signuplist, totalSteps, error } = res;
    error ? callback([]) : callback({ signuplist, totalSteps });
  });
};

export const saveSignUpForm = ({
  fieldAnswers,
  authToken,
  userCountryId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Providers/BusinessSignup`,
    verb: "POST",
    payload: JSON.stringify({
      DeviceId: "web",
      DeviceName: "web",
      MACAddress: "web",
      authToken,
      isMobile: false,
      CountryCode: userCountryId,
      lstFields: fieldAnswers,
    }),
  }).then((res) => callback(res));
};
