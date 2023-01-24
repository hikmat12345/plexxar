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
  FAECheckBoxGroup,
  FAERadioGroup,
  FAESelect,
  FAEDatePicker,
  FAEText,
  FAEPhoneInput,
  FAEGoogleMap,
  FAEAutoComplete,
} from "@plexaar/components";

//src
import {
  eighteenYearsBackDate,
  getCookies,
  getFileSrcFromPublicFolder,
  getUniqueData,
  objectIsEmpty,
  setCookies,
  validateInput,
} from "../../utils";
import history from "../../history";
import {
  getProfileFields,
  updateProfile,
  getAddressSuggestions,
  getPlaceDetails,
  saveResidentialAddress,
  getAddresses,
} from "./actions";
import { UserContext } from "../../Contexts/userContext";
import { addressSuggestionsParser } from "../../parsers";
import { UserPermissionsContext } from "../../Contexts/userPermissionsContext";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import PlexaarContainer from "../PlexaarContainer";
import Loader from "../Loader";

//scss
import "./UpdateProfilePage.scss";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const profileFormParser = (data) => {
  const parsedData = data.map(({ value, id }) => ({
    value: `${id}`,
    label: value,
  }));
  return parsedData;
};

const UpdateProfilePage = () => {
  document.title = `Plexaar | Update Profile`;
  const location = useLocation();
  const { userId, next } = location.state;
  const isBusiness =
    next === "/staff-user-status" || next === "/staff-onboard"
      ? false
      : getCookies("customer_details").isBusiness;
  const roleId =
    next === "/staff-user-status" || next === "/staff-onboard"
      ? 2
      : getCookies("customer_details").roleId;
  const { getUserPermissions, screenStatus } = useContext(
    UserPermissionsContext
  );
  const { userCountryId, userLat, userLng } = useContext(CountryDetailContext);
  const [errorFileds, setErrorFields] = useState([]);
  const [fieldAnswers, setFieldAnswers] = useState([]);
  const [profileFields, setProfileFields] = useState([]);
  const [updateProfileRespone, setUpdateProfileResponse] = useState({});
  const [saveAddressResponse, setSaveAddressResponse] = useState({});
  const [loading, setLoading] = useState(true);
  const [securityAnswerField, setSecurityAnswerField] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [address, setAddress] = useState("");
  const [placeDetails, setPlaceDetails] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [streetAddress, setStreetAddress] = useState("");
  const [addressAlreadyAdded, setAddressAlreadyAdded] = useState(false);

  useEffect(() => {
    if (userCountryId !== "") {
      getProfileFields({
        userCountryId,
        roleId,
        userId,
        callback: (res) => {
          setProfileFields(res);
          setSecurityAnswerField(
            res.find((field) => field.label.includes("Answer"))
          );
          setLoading(false);
        },
      });
      // getAddresses({
      //   userId,
      //   callback: (res) => {
      //     if (!objectIsEmpty(res)) {
      //       const { line1, line2, latitude, longitude } = res;
      //       setAddress(line1);
      //       setStreetAddress(line2);
      //       setLat(latitude);
      //       setLng(longitude);
      //       setAddressAlreadyAdded(true);
      //     } else {
      //       setAddressAlreadyAdded(false);
      //     }
      //   },
      // });
    }
  }, [userCountryId, userId]);

  useEffect(() => {
    setErrorFields(
      profileFields.map((field) => ({
        fieldId: field.id,
        error: field.isRequired && field.inputField === "",
      }))
    );
  }, [profileFields]);

  useEffect(() => {
    setFieldAnswers(
      profileFields.map((field) => {
        return { fieldId: field.id, answer: field.inputField };
      })
    );
  }, [profileFields]);

  useEffect(() => {
    const profileUpdatedSuccessfully = (customer) => {
      // addressAlreadyAdded
      //   ?
      screenStatus === 0
        ? getUserPermissions({
            userId,
            callback: (res) => res === 1 && history.push("/user-status"),
          })
        : history.push({
            pathname: `${history.location.state.next}`,
            state: { userId },
          });

      if (next === "/user-status1") {
        setCookies("customer_details", customer);
        // window.location.reload();
      }
      if (next === "/user-status") {
        setCookies("customer_details", customer);
        window.location.reload();
      }

      setLoading(false);

      // : saveResidentialAddress({
      //     address,
      //     userId,
      //     streetAddress,
      //     lat,
      //     lng,
      //     callback: (res) => setSaveAddressResponse(res),
      //   });
      // if (next === "/user-status") {
      //   // setTimeout(() => {
      //   //   window.location.reload();
      //   // }, 3000);
      // }
    };
    if (!objectIsEmpty(updateProfileRespone)) {
      const { message, customerData, statusCode } = updateProfileRespone;
      statusCode !== 0
        ? someErrorOccured(message)
        : profileUpdatedSuccessfully(customerData);
      setUpdateProfileResponse({});
    }
  }, [
    // address,
    // addressAlreadyAdded,
    getUserPermissions,
    // lat,
    // lng,
    screenStatus,
    // streetAddress,
    updateProfileRespone,
    userId,
  ]);

  // useEffect(() => {
  //   const addressAddedSuccessfully = () => {
  //     if (screenStatus === 0) {
  //       getUserPermissions({
  //         userId,
  //         callback: (res) => res === 1 && history.push("/user-status"),
  //       });
  //     } else {
  //       history.push({
  //         pathname: `${history.location.state.next}`,
  //       });
  //     }
  //   };
  //   if (!objectIsEmpty(saveAddressResponse)) {
  //     const { error, message } = saveAddressResponse;
  //     error === true ? someErrorOccured(message) : addressAddedSuccessfully();
  //     setSaveAddressResponse({});
  //   }
  // }, [getUserPermissions, saveAddressResponse, screenStatus, userId]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    return errorFileds.some((field) => field.error === true)
      ? someErrorOccured("Please fill required fields")
      : updateProfile({
          fieldAnswers,
          userId,
          userCountryId,
          isBusiness,
          callback: (res) => {
            setUpdateProfileResponse(res);
          },
        });
  };

  const someErrorOccured = (message) => {
    alert(message);
    setLoading(false);
  };

  // const handleChangeDragEvent = (mapValues) => {
  //   const { mapAddress, lat, lng } = mapValues;
  //   setAddress(mapAddress);
  //   setLat(lat);
  //   setLng(lng);
  // };

  // useEffect(() => {
  //   if (!objectIsEmpty(placeDetails)) {
  //     const {
  //       formatted_address,
  //       geometry: {
  //         location: { lat, lng },
  //       },
  //     } = placeDetails;
  //     setAddress(formatted_address);
  //     setLat(lat);
  //     setLng(lng);
  //   }
  // }, [placeDetails]);

  // useEffect(() => {
  //   if (userLat !== 0 && userLng !== 0) {
  //     setLat(parseInt(userLat));
  //     setLng(parseInt(userLng));
  //   }
  // }, [userLat, userLng]);
  return (
    <div className="update-profile-page-main">
      {loading && <Loader />}
      {!loading && profileFields.length > 1 && (
        <form
          onSubmit={handleSubmit}
          className="fae--edit-profile-page-form-wrapper"
        >
          {/* <img src={getFileSrcFromPublicFolder("/plexaar_logo.png")} /> */}
          <FAEText subHeading bold>
            Update Profile
            {/* <FAEText>Personal Detail</FAEText> */}
          </FAEText>

          <div className="update-profile-title">
            <FAEText>Personal Details</FAEText>
          </div>
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
                    !label.includes("Answer") &&
                    label !== "Business Name" &&
                    label !== "No Of Employees" &&
                    label !== "Designation" && (
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
                          `${date.day}`.length === 2 ? date.day : `0${date.day}`
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
                        // : eighteenYearsBackDate()
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
                      maximumDate={eighteenYearsBackDate()}
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
                  label !== "Business Name" &&
                  label !== "No Of Employees" &&
                  label !== "Designation" &&
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

          {/* <FAEAutoComplete
            type="search"
            onChange={(e) => {
              e.target.value !== "" &&
                getAddressSuggestions({
                  value: e.target.value,
                  callback: (res) => setAddressSuggestions(res),
                });
            }}
            label="Address"
            values={addressSuggestionsParser(addressSuggestions)}
            getSelectedValue={(placeId) =>
              getPlaceDetails({
                placeId,
                callback: (res) => setPlaceDetails(res),
              })
            }
            placeholder="Address"
            value={{ label: address }}
            required={true}
            isRequired={true}
            primary
            shadowBoxProps={{
              className: "fae--edit-profile-page-field",
            }}
          />
          <FAETextField
            primary
            label="Street & House No."
            getValue={setStreetAddress}
            value={streetAddress}
            shadowBoxProps={{
              className: "fae--edit-profile-page-field",
            }}
            placeholder="Address"
          />
          <FAEGoogleMap
            apiKey={GOOGLE_MAP_API_KEY}
            lat={lat}
            lng={lng}
            address={address}
            getMapValues={(e) => handleChangeDragEvent(e)}
            className="fae--add-address-page-google-map"
          /> */}
          {profileFields.some(
            (a) =>
              a.label === "Business Name" ||
              a.label === "No Of Employees" ||
              a.label === "Designation"
          ) && (
            <div className="update-profile-title">
              <FAEText>Business Details</FAEText>
            </div>
          )}
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
                  {fieldType === "text" &&
                    !label.includes("Answer") &&
                    (label === "Business Name" ||
                      label === "No Of Employees" ||
                      label === "Designation") && (
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
                  {fieldType === "select" &&
                    (label === "Business Name" ||
                      label === "No Of Employees" ||
                      label === "Designation") && (
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
                    )}
                </>
              );
            })
          )}
          <FAEButton className="fae--edit-profile-page-form-button">
            Save Profile
          </FAEButton>
        </form>
      )}
    </div>
  );
};

export default UpdateProfilePage;
