//libs
/* eslint-disable */
import React, {
  useEffect,
  Children,
  useState,
  Fragment,
  useContext,
} from "react";
import {
  FAETextField,
  FAEButton,
  FAEAvatar,
  FAECheckBoxGroup,
  FAERadioGroup,
  FAESelect,
  FAEDatePicker,
  FAEText,
  FAEPhoneInput,
  FAEDialogueBox,
} from "@plexaar/components";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

//src
import {
  getUniqueData,
  objectIsEmpty,
  setCookies,
  validateInput,
} from "../../utils";
import history from "../../history";
import {
  getProfileFields,
  updateProfile,
  getAddresses,
  uploadImage,
  ChangePassword,
} from "./actions";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import PlexaarContainer from "../PlexaarContainer";
import Loader from "../Loader";

//scss
import "./StaffProfile.scss";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import RightSideBar from "./RightSideBar";

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const profileFormParser = (data) => {
  const parsedData = data.map(({ value, id }) => ({
    value: `${id}`,
    label: value,
  }));
  return parsedData;
};

const StaffProfile = () => {
  document.title = `Plexaar | Update Profile`;
  const location = useLocation();
  const { staffId } = location.state;
  const [selectedEvent, setSelectedEvent] = useState(0);

  const { userCountryId } = useContext(CountryDetailContext);
  const [errorFileds, setErrorFields] = useState([]);
  const [fieldAnswers, setFieldAnswers] = useState([]);
  const [profileFields, setProfileFields] = useState([]);
  const [staffProfile, setStaffProfile] = useState({});
  const [image, setImage] = useState("");
  const [eye1, setEye1] = useState(true);
  const [eye2, setEye2] = useState(true);
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [securityAnswerField, setSecurityAnswerField] = useState("");
  const [address, setAddress] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  //const [addressAlreadyAdded, setAddressAlreadyAdded] = useState(false);

  useEffect(() => {
    if (userCountryId !== "") {
      getProfileFields({
        userCountryId,
        staffId,
        callback: (res) => {
          setProfileFields(res);
          setStaffProfile(res.find((obj) => obj.type.toLowerCase() === "doc"));

          setSecurityAnswerField(
            res.find((field) => field.label.includes("Answer"))
          );
          setLoading(false);
        },
      });
      getAddresses({
        staffId,
        callback: (res) => {
          if (!objectIsEmpty(res)) {
            const { line1, line2 } = res;
            setAddress(line1);
            setStreetAddress(line2);
          }
        },
      });
    }
  }, [userCountryId, staffId, image]);
  useEffect(() => {
    setErrorFields(
      profileFields.map((field) => ({
        fieldId: field.id,
        error: field.isRequired && field.inputField === "",
      }))
    );
  }, [profileFields, staffId]);

  useEffect(() => {
    setFieldAnswers(
      profileFields.map((field) => {
        return { fieldId: field.id, answer: field.inputField };
      })
    );
  }, [profileFields, staffId]);

  const handleChangefieldValue = ({ value, regex, id, isRequired }) => {
    console.log(
      "id: ",
      id,
      " value: ",
      value,
      " regex: ",
      regex,
      " required: ",
      isRequired
    );
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
              {
                fieldId: id,
                error: regex !== null && !validateInput(regex, value),
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

  const handleCheckBoxError = ({ isRequired, id, error }) => {
    isRequired === true &&
      setErrorFields(getUniqueData([{ id, error }, ...errorFileds], "id"));
    return error;
  };

  const uploadFile = (e) => {
    setLoading(true);
    var file = e.target.files[0];
    uploadImage(staffId, file, (res) => {
      setImage(res.path);
    });
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    return errorFileds.some((field) => field.error === true)
      ? someErrorOccured("Please fill required fields")
      : updateProfile({
          fieldAnswers,
          staffId,
          userCountryId,
          callback: (res) => {
            // setCookies("customer_details", res.customerData);
            history.push({
              pathname: `/your-staff`,
              state: { from: "sidebar" },
            });
          },
        });
  };

  const someErrorOccured = (message) => {
    alert(message);
    setLoading(false);
  };

  return (
    <>
      <div className="staff-profile-main">
        {loading && <Loader />}
        {!loading && profileFields.length > 1 && (
          <form
            onSubmit={handleSubmit}
            className="fae--edit-profile-page-form-wrapper"
          >
            <FAEText subHeading bold>
              Update Profile
            </FAEText>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              className="staff-profile"
              onChange={(e) => e.target.value !== "" && uploadFile(e)}
            />
            <FAEAvatar
              size="medium"
              src={staffProfile.inputField}
              onClick={() =>
                document.getElementsByClassName("staff-profile")[0].click()
              }
            />
            <FAEText
              className="staff-profile-password-change"
              onClick={() => setOpen(true)}
            >
              Change Password
            </FAEText>
            {Children.toArray(
              profileFields.map((field) => {
                const {
                  type,
                  regex,
                  isRequired,
                  errorMessage,
                  label,
                  id,
                  optionList,
                  inputField,
                  isEnabled,
                } = field;
                const fieldType = type.toLowerCase();

                return (
                  <>
                    {(fieldType === "text" ||
                      fieldType === "email" ||
                      fieldType === "password") &&
                      !label.includes("Answer") && (
                        <FAETextField
                          label={label}
                          placeholder={label}
                          primary
                          value={inputField}
                          required={isRequired}
                          isRequired={isRequired}
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
                              isRequired,
                            })
                          }
                          inputProps={{
                            readOnly: !isEnabled && true,
                          }}
                        />
                      )}
                    {fieldType === "date" && (
                      <FAEDatePicker
                        label={label}
                        primary
                        isRequired={isRequired}
                        required={isRequired}
                        dateFormat={(date) =>
                          `${date.year}-${
                            `${date.month}`.length === 2
                              ? date.month
                              : `0${date.month}`
                          }-${
                            `${date.day}`.length === 2
                              ? date.day
                              : `0${date.day}`
                          }`
                        }
                        value={
                          inputField !== ""
                            ? {
                                year: parseInt(inputField.split("-")[0]),
                                day: parseInt(inputField.split("-")[2]),
                                month: parseInt(inputField.split("-")[1]),
                              }
                            : ""
                        }
                        getSelectedDate={(date) =>
                          handleChangefieldValue({
                            id,
                            value: `${date.year}-${
                              `${date.month}`.length === 2
                                ? date.month
                                : `0${date.month}`
                            }-${
                              `${date.day}`.length === 2
                                ? date.day
                                : `0${date.day}`
                            }`,
                          })
                        }
                        //maximumDate={eighteenYearsBackDate()}
                      />
                    )}
                    {fieldType === "radio" && (
                      <FAERadioGroup
                        label={label}
                        values={profileFormParser(optionList)}
                        primary
                        value={inputField}
                        isRequired={isRequired}
                        required={isRequired}
                        getSelectedValue={(value) =>
                          handleChangefieldValue({ id, value })
                        }
                      />
                    )}
                    {fieldType === "phone" && (
                      <FAEPhoneInput
                        label={label}
                        primary
                        value={inputField}
                        isRequired={isRequired}
                        required={isRequired}
                        getValue={(value) =>
                          handleChangefieldValue({ id, value })
                        }
                        disabled={!isEnabled}
                      />
                    )}
                    {fieldType === "select" &&
                    !label.includes("Security Question") ? (
                      <FAESelect
                        label={label}
                        primary
                        values={profileFormParser(optionList)}
                        required={isRequired}
                        isRequired={isRequired}
                        getSelectedValue={(value) =>
                          handleChangefieldValue({ id, value })
                        }
                        value={inputField}
                        disabled={!isEnabled}
                      />
                    ) : (
                      fieldType === "select" &&
                      label.includes("Security Question") && (
                        <Fragment>
                          <FAESelect
                            label={label}
                            primary
                            values={profileFormParser(optionList)}
                            required={isRequired}
                            isRequired={isRequired}
                            getSelectedValue={(value) =>
                              handleChangefieldValue({ id, value })
                            }
                            value={inputField}
                          />
                          <FAETextField
                            label={securityAnswerField.label}
                            placeholder={securityAnswerField.label}
                            primary
                            required={securityAnswerField.isRequired}
                            type={securityAnswerField.type}
                            error={(value) =>
                              value !== "" &&
                              !validateInput(securityAnswerField.regex, value)
                            }
                            value={securityAnswerField.inputField}
                            errorMessage={securityAnswerField.errorMessage}
                            getValue={(value) =>
                              handleChangefieldValue({
                                value,
                                regex: securityAnswerField.regex,
                                id: securityAnswerField.id,
                                isRequired: securityAnswerField.isRequired,
                                type: securityAnswerField.type.toLowerCase(),
                              })
                            }
                            inputProps={{
                              readOnly:
                                securityAnswerField.type.toLowerCase() ===
                                  "email" && true,
                            }}
                          />
                        </Fragment>
                      )
                    )}
                    {fieldType === "checkbox" && (
                      <FAECheckBoxGroup
                        label={label}
                        values={profileFormParser(optionList)}
                        primary
                        error={(values) =>
                          isRequired && values.length < 1
                            ? handleCheckBoxError({
                                isRequired,
                                id,
                                error: true,
                              })
                            : handleCheckBoxError({
                                isRequired,
                                id,
                                error: false,
                              })
                        }
                        errorMessage="Select at least 1"
                        isRequired={isRequired}
                        getSelectedValues={(values) =>
                          handleChangefieldValue({
                            id,
                            value: values.toString(),
                          })
                        }
                      />
                    )}
                  </>
                );
              })
            )}
            <FAETextField
              primary
              label="Address"
              value={address}
              disabled={true}
              shadowBoxProps={{
                className: "fae--edit-profile-page-field",
              }}
              placeholder="Address"
            />
            <FAETextField
              primary
              label="Street & House No."
              getValue={setStreetAddress}
              value={streetAddress}
              disabled={true}
              shadowBoxProps={{
                className: "fae--edit-profile-page-field",
              }}
              placeholder="Address"
            />
            <FAEButton className="fae--edit-profile-page-form-button">
              Save Profile
            </FAEButton>
          </form>
        )}
        <FAEDialogueBox
          open={open}
          content={
            <div>
              <FAEText bold subHeading>
                Change Password
              </FAEText>
              <FAETextField
                primary
                className="old-pass"
                getValue={setOldPassword}
                value={oldPassword}
                type="password"
                placeholder="Old Password"
              />
              <FAETextField
                primary
                className="new-pass"
                getValue={setNewPassword}
                value={newPassword}
                type="password"
                placeholder="New Password"
              />
              {/* <div className="staff-password-change-1">
                <FAETextField
                  primary
                  className="old-pass"
                  getValue={setOldPassword}
                  value={oldPassword}
                  type="password"
                  placeholder="Old Password"
                />
                <i
                  onClick={() => {
                    console.log(document
                      .querySelector(".old-pass").getAttributeNames)
                    const type =
                      document
                        .querySelector(".old-pass")
                        .getAttribute("type") === "password"
                        ? "text"
                        : "password";
                    document.querySelector(".old-pass").setAttribute("type", type);
                    eye1 ? setEye1(false) : setEye1(true);
                  }}
                >
                  {eye1 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </i>
              </div>
              <div className="staff-password-change-1">
                <FAETextField
                  primary
                  className="new-pass"
                  getValue={setNewPassword}
                  value={newPassword}
                  type="password"
                  placeholder="New Password"
                />
                <i
                  onClick={() => {
                    eye2 ? setEye2(false) : setEye2(true);
                  }}
                >
                  {eye2 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </i>
              </div> */}
            </div>
          }
          buttons={[
            {
              label: "cancel",
              onClick: () => setOpen(false),
            },
            {
              label: "save",
              onClick: () => {
                oldPassword.length >= 8 && newPassword.length >= 8
                  ? ChangePassword({
                      staffId,
                      oldPassword,
                      newPassword,
                      callback: (res) => {
                        const { code, message } = res;
                        if (code !== 0) {
                          alert(message);
                        } else {
                          alert(message);
                          setOldPassword("");
                          setNewPassword("");
                          setOpen(false);
                        }
                      },
                    })
                  : alert("password must be greater then 8 ");
              },
            },
          ]}
        />
      </div>
      <RightSideBar staffId={staffId} />
    </>
  );
};

export default StaffProfile;
