//libs
/* eslint-disable */
import React, { useEffect, Children, useState, useContext } from "react";
import {
  FAETextField,
  FAEButton,
  FAEPhoneInput,
  FAEDialogueBox,
  FAEText,
  FAERadioGroup,
} from "@plexaar/components";

//src
import {
  getCookies,
  getUniqueData,
  objectIsEmpty,
  validateInput,
} from "../../utils";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import { getStaffForm, saveStaffForm } from "./actions";
import Loader from "../Loader";
import history from "../../history";
import PlexaarContainer from "../PlexaarContainer";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

//scss
import "./AddStaffPage.scss";

const AddStaffPage = () => {
  const { userCountryId } = useContext(CountryDetailContext);
  const userId = getCookies("userId");
  document.title = "Plexaar | Sign Up";
  const [currentStep, setCurrentStep] = useState(1);
  const [errorFileds, setErrorFields] = useState([]);
  const [fieldAnswers, setFieldAnswers] = useState([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [staffFormData, setStaffFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSteps, setTotalSteps] = useState(0);
  const [saveStaffFormResponse, setSaveStaffFormResponse] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [passwordEye, setPasswordEye] = useState(true);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(true);

  useEffect(() => {
    if (userCountryId !== "") {
      setLoading(true);
      getStaffForm({
        userCountryId,
        currentStep,
        callback: (res) => {
          const { signuplist, totalSteps } = res;
          setStaffFormData(signuplist);
          setTotalSteps(totalSteps);
          setLoading(false);
        },
      });
    }
  }, [currentStep, userCountryId]);

  useEffect(() => {
    setErrorFields(
      staffFormData.map((field) => ({
        fieldId: field.id,
        error: field.isRequired,
      }))
    );
  }, [staffFormData]);

  useEffect(() => {
    if (!objectIsEmpty(saveStaffFormResponse)) {
      const { statusCode, message } = saveStaffFormResponse;
      if (statusCode !== 0) {
        alert(message);
      } else {
        setOpen(true);
        setContent(message);
      }
      setSaveStaffFormResponse({});
    }
  }, [saveStaffFormResponse]);

  const handleChangefieldValue = ({
    value,
    regex,
    id,
    fieldType,
    label,
    isRequired,
  }) => {
    label === "Password" && setPassword(value);
    label === "Confirm Password" && setConfirmPassword(value);
    setFieldAnswers(
      getUniqueData(
        [{ fieldId: id, answer: value }, ...fieldAnswers],
        "fieldId"
      )
    );
    console.log(
      label,
      regex === null ? false : !validateInput(regex, value),
      regex,
      value
    );
    value !== ""
      ? setErrorFields(
          getUniqueData(
            [
              {
                fieldId: id,
                error: regex === null ? false : !validateInput(regex, value),
              },
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
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const someErrorOccured = (message) => {
      alert(message);
      setLoading(false);
    };
    console.log("error", errorFileds);
    return errorFileds.some((field) => field.error === true)
      ? someErrorOccured("Please fill required fields")
      : currentStep !== totalSteps
      ? setCurrentStep(currentStep + 1)
      : password === confirmPassword
      ? saveStaffForm({
          fieldAnswers,
          userCountryId,
          userId,
          callback: (res) => {
            setSaveStaffFormResponse(res);
            setLoading(false);
          },
        })
      : someErrorOccured("Passwords do not match!");
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
  return (
    <>
      <FAEText subHeading bold>
        Add Staff
      </FAEText>
      {loading && <Loader />}
      {!loading && staffFormData.length !== 0 && (
        <form
          onSubmit={handleSubmit}
          className="fae--add-staff-page-form-wrapper"
        >
          {Children.toArray(
            staffFormData.map((field) => {
              const {
                type,
                regex,
                isRequired,
                errorMessage,
                label,
                id,
                optionList,
              } = field;
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
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
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
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
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
                        handleChangefieldValue({ id, value, label, isRequired })
                      }
                      shadowBoxProps={{
                        primary: true,
                      }}
                    />
                  )}

                  {fieldType === "radio" && (
                    <FAERadioGroup
                      label={label}
                      values={[
                        // { label: "None", value: "" },
                        ...optionList.map((option) => {
                          return { label: option.value, value: option.value };
                        }),
                      ]}
                      // value={genderID}
                      errorMessage={errorMessage}
                      getSelectedValue={(value) =>
                        handleChangefieldValue({
                          id,
                          value: value === "Male" ? 1 : 2,
                          label,
                          isRequired,
                        })
                      }
                      isRequired={isRequired}
                      primary
                    />
                  )}
                </>
              );
            })
          )}
          <FAEButton className="fae--add-staff-page-form-button">
            {currentStep !== totalSteps ? "Next" : "Add Staff"}
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
                pathname: history.location.state.next,
                state: { from: history.location.state.from },
              });
            },
          },
        ]}
      />
    </>
  );
};

export default PlexaarContainer(AddStaffPage);
