//libs
/* eslint-disable */
import React, { useEffect, Children, useState, useContext } from "react";
import {
  FAETextField,
  FAEButton,
  FAEPhoneInput,
  FAEDialogueBox,
  FAEText,
} from "@plexaar/components";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from "react-google-recaptcha-v3";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

//src
import {
  getFileSrcFromPublicFolder,
  getUniqueData,
  objectIsEmpty,
  validateInput,
} from "../../utils";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import { getSignUpForm, saveSignUpForm } from "./actions";
import Loader from "../Loader";
import history from "../../history";

//scss
import "./SignUpPage.scss";
import { useCallback } from "react";
import SideNotification from "../MyComponent/SideNotification";
import MobileView from "../TempMobileView/MobileView";

const SignUpPage = () => {
  const { userCountryId } = useContext(CountryDetailContext);
  document.title = "Plexaar | Sign Up";
  const [currentStep, setCurrentStep] = useState(1);
  const [errorFileds, setErrorFields] = useState([]);
  const [fieldAnswers, setFieldAnswers] = useState([]);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [signUpFormData, setSignUpFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSteps, setTotalSteps] = useState(0);
  const [saveSignUpFormResponse, setSaveSignUpFormResponse] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [passwordEye, setPasswordEye] = useState(true);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(true);
  const [capchaFill, setCapchaFill] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [tokenRefresh, setTokebRefresh] = useState(false);
  const [loadToken, setLoadToken] = useState(false);

  useEffect(() => {
    if (userCountryId !== "") {
      setLoading(true);
      getSignUpForm({
        userCountryId,
        currentStep,
        callback: (res) => {
          const { signuplist, totalSteps } = res;
          setSignUpFormData(signuplist);
          setTotalSteps(totalSteps);
          setLoading(false);
        },
      });
    }
  }, [currentStep, userCountryId]);

  useEffect(() => {
    setErrorFields(
      signUpFormData.map((field) => ({
        fieldId: field.id,
        error: field.isRequired,
      }))
    );
  }, [signUpFormData]);

  useEffect(() => {
    if (!objectIsEmpty(saveSignUpFormResponse)) {
      console.log("res", saveSignUpFormResponse);
      const { statusCode, message } = saveSignUpFormResponse;
      if (statusCode !== 0) {
        alert(message);
      } else {
        setOpen(true);
        setContent(message);
      }
      setSaveSignUpFormResponse({});
    }
  }, [saveSignUpFormResponse]);

  const handleChangefieldValue = ({
    value,
    regex,
    id,
    fieldType,
    label,
    isRequired,
  }) => {
    fieldType === "email" && setEmail(value);
    label === "Password" && setPassword(value);
    label === "Confirm Password" && setConfirmPassword(value);
    label === "Mobile" && setMobile(value);
    setFieldAnswers(
      getUniqueData(
        [{ fieldId: id, answer: value }, ...fieldAnswers],
        "fieldId"
      )
    );
    value !== ""
      ? setErrorFields(
          getUniqueData(
            [
              { fieldId: id, error: !validateInput(regex, value) },
              ...errorFileds,
            ],
            "fieldId"
          )
        )
      : isRequired
      ? setErrorFields(
          getUniqueData(
            [
              { fieldId: id, error: !validateInput(regex, value) },
              ...errorFileds,
            ],
            "fieldId"
          )
        )
      : setErrorFields(
          getUniqueData(
            [{ fieldId: id, error: false }, ...errorFileds],
            "fieldId"
          )
        );
  };

  const handleClickShowPassword = () => {
    setPasswordEye(!passwordEye);
    passwordType === "password"
      ? setPasswordType("text")
      : setPasswordType("password");
  };
  const handleClickShowConfirmPassword = () => {
    setConfirmPasswordEye(!confirmPasswordEye);
    confirmPasswordType === "password"
      ? setConfirmPasswordType("text")
      : setConfirmPasswordType("password");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTokebRefresh((r) => !r);
    setLoading(true);
    const someErrorOccured = (message) => {
      alert(message);
      setLoading(false);
    };
    return errorFileds.some((field) => field.error === true)
      ? someErrorOccured("Please fill required fields")
      : currentStep !== totalSteps
      ? setCurrentStep(currentStep + 1)
      : password === confirmPassword
      ? saveSignUpForm({
          fieldAnswers,
          authToken,
          userCountryId,
          callback: (res) => {
            setSaveSignUpFormResponse(res);
            setLoading(false);
          },
        })
      : someErrorOccured("Passwords do not match!");
  };
  function onCapchaChange(value) {
    // console.log("Captcha value:", value);
    value == null ? setCapchaFill(false) : setCapchaFill(true);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadToken(!loadToken);
    }, 20000);
    return () => clearInterval(interval);
  }, [loadToken]);

  const handleToken = useCallback(
    (token) => {
      setAuthToken(token);
    },
    [loadToken]
  );

  if (window.screen.width <= 768) {
    return <MobileView />;
  } else {
    return (
      <GoogleReCaptchaProvider reCaptchaKey="6LcMyJEiAAAAAKvPlP0s9akggaBx5U-OzUcrfEHd">
        {/* <button onClick={changeCapcha}>onsubmit</button> */}
        <GoogleReCaptcha
          onVerify={handleToken}
          refreshReCaptcha={tokenRefresh}
        />
        <div className="sign-up-page-main">
          <SideNotification />
          {loading && <Loader />}
          {!loading && signUpFormData.length !== 0 && (
            <form
              onSubmit={handleSubmit}
              className="fae--sign-up-page-form-wrapper"
            >
              <img
                src={getFileSrcFromPublicFolder("/plexaar_logo.png")}
                style={{ marginBottom: "30px" }}
              />
              {Children.toArray(
                signUpFormData.map((field) => {
                  const { type, regex, isRequired, errorMessage, label, id } =
                    field;
                  const fieldType = type.toLowerCase();
                  return (
                    <>
                      {fieldType === "text" || fieldType === "email" ? (
                        <FAETextField
                          placeholder={label}
                          primary
                          required={isRequired}
                          type={fieldType}
                          error={(value) =>
                            value !== "" && !validateInput(regex, value)
                          }
                          errorMessage={errorMessage}
                          getValue={(value) =>
                            handleChangefieldValue({
                              value,
                              regex,
                              id,
                              fieldType,
                              label,
                              isRequired,
                            })
                          }
                          shadowBoxProps={{
                            primary: true,
                          }}
                        />
                      ) : (
                        ""
                      )}
                      {label === "Password" && (
                        <FAETextField
                          placeholder={label}
                          primary
                          required={isRequired}
                          type={passwordType}
                          error={(value) =>
                            value !== "" &&
                            regex !== null &&
                            !validateInput(regex, value)
                          }
                          errorMessage={errorMessage}
                          getValue={(value) =>
                            handleChangefieldValue({
                              value,
                              regex,
                              id,
                              fieldType,
                              label,
                              isRequired,
                            })
                          }
                          shadowBoxProps={{
                            primary: true,
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  // onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {passwordEye ? (
                                    <VisibilityOffIcon
                                      sx={{ fontSize: "18px" }}
                                    />
                                  ) : (
                                    <VisibilityIcon sx={{ fontSize: "18px" }} />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      {label === "Confirm Password" && (
                        <FAETextField
                          placeholder={label}
                          primary
                          required={isRequired}
                          type={confirmPasswordType}
                          error={(value) =>
                            value !== "" &&
                            regex !== null &&
                            !validateInput(regex, value)
                          }
                          errorMessage={errorMessage}
                          getValue={(value) =>
                            handleChangefieldValue({
                              value,
                              regex,
                              id,
                              fieldType,
                              label,
                              isRequired,
                            })
                          }
                          shadowBoxProps={{
                            primary: true,
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowConfirmPassword}
                                  // onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {confirmPasswordEye ? (
                                    <VisibilityOffIcon
                                      sx={{ fontSize: "18px" }}
                                    />
                                  ) : (
                                    <VisibilityIcon sx={{ fontSize: "18px" }} />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      {fieldType === "phone" && (
                        <FAEPhoneInput
                          primary
                          required={isRequired}
                          getValue={(value) =>
                            handleChangefieldValue({
                              id,
                              value,
                              label,
                              isRequired,
                            })
                          }
                          shadowBoxProps={{
                            primary: true,
                          }}
                        />
                      )}
                    </>
                  );
                })
              )}
              {currentStep === totalSteps && (
                <>
                  <FAEText style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    By clicking Sign Up, indicates that you have read and agree
                    to our{" "}
                    <Link
                      style={{ color: "#548DFF" }}
                      to="/terms-and-conditions"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link style={{ color: "#548DFF" }} to="/privacy-policy">
                      Privacy Policy
                    </Link>
                    .
                  </FAEText>
                  {/* <ReCAPTCHA
                    sitekey="6LdzD5IiAAAAAPBTnR4VsZncUgBxFwOYb_A25-sY"
                    onChange={onCapchaChange}
                    onExpired={(e) => setCapchaFill(false)}
                  /> */}
                </>
              )}
              <FAEButton
                className="fae--sign-up-page-form-button"
                // disabled={currentStep == totalSteps ? true : false}
              >
                {currentStep !== totalSteps ? "Next" : "Sign Up"}
              </FAEButton>
            </form>
          )}
          <FAEDialogueBox
            open={open}
            content={content}
            buttons={[
              {
                label: "Ok",
                onClick: () => {
                  setOpen(false);
                  history.push({
                    pathname: "/verify-account",
                    state: { email: email, mobile: mobile },
                  });
                },
              },
            ]}
          />
        </div>
      </GoogleReCaptchaProvider>
    );
  }
};

export default SignUpPage;
