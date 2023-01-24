//libs
/* eslint-disable */
import {
  FAEAutoComplete,
  FAETextField,
  FAEGoogleMap,
  FAEText,
  FAEButton,
  FAESelect,
} from "@plexaar/components/dist";
import React, { useState, useEffect, useContext } from "react";

//src
import PlexaarContainer from "../PlexaarContainer";
import {
  getAddressSuggestions,
  getPlaceDetails,
  saveWorkingAddress,
} from "./actions";
import { addressSuggestionsParser } from "../../parsers";
import {
  getCookies,
  getFileSrcFromPublicFolder,
  objectIsEmpty,
} from "../../utils";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import { UserContext } from "../../Contexts/userContext";
import history from "../../history";
import Loader from "../Loader";

//scss
import "./AddOrUpdateWorkingAddress.scss";
import { FAERadioGroup } from "@plexaar/components/dist/stories/FAERadioGroup/FAERadioGroup";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const AddOrUpdateWorkingAddress = () => {
  const location = useLocation();
  const { userId, next } = location.state;
  const isBusiness =
    next === "/staff-user-status" || next === "/staff-onboard"
      ? false
      : getCookies("customer_details").isBusiness;

  const { userLat, userLng } = useContext(CountryDetailContext);
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [address, setAddress] = useState("");
  const [placeDetails, setPlaceDetails] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [streetAddress, setStreetAddress] = useState("");
  const [radius, setRadius] = useState(0);
  const [clinic, setClinic] = useState("");
  const [saveWorkingAddressResponse, setSaveWorkingAddressResponse] = useState(
    {}
  );

  useEffect(() => {
    if (!objectIsEmpty(saveWorkingAddressResponse)) {
      setLoading(false);
      const { error, message } = saveWorkingAddressResponse;
      error === true
        ? alert(message)
        : history.push({
            pathname:
              next === "/user-status" ? next : "/your-working-addresses",
            state: { userId, next },
          });
      // : history.push({
      //     pathname: "/your-working-addresses",
      //     state: { userId, next },
      //   });
      setSaveWorkingAddressResponse({});
    }
  }, [saveWorkingAddressResponse]);

  useEffect(() => {
    if (userLat !== 0 && userLng !== 0) {
      setLat(parseInt(userLat));
      setLng(parseInt(userLng));
    }
  }, [userLat, userLng]);
  useEffect(() => {
    if (!objectIsEmpty(placeDetails)) {
      const {
        formatted_address,
        geometry: {
          location: { lat, lng },
        },
      } = placeDetails;
      setAddress(formatted_address);
      setLat(lat);
      setLng(lng);
    }
  }, [placeDetails]);

  const handleChangeDragEvent = (mapValues) => {
    const { mapAddress, lat, lng } = mapValues;
    setAddress(mapAddress);
    setLat(lat);
    setLng(lng);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inclinic = isBusiness; //clinic === "expert" ? true : false;
    setLoading(true);
    saveWorkingAddress({
      userId,
      address,
      streetAddress,
      lat,
      lng,
      radius,
      inclinic,
      isBusiness,
      callback: (res) => setSaveWorkingAddressResponse(res),
    });
  };

  return (
    <div className="add-working-address-main">
      {loading && <Loader />}
      {!loading && (
        <form
          onSubmit={handleSubmit}
          className="add-or-update-address-form-wrapper"
        >
          {/* <img src={getFileSrcFromPublicFolder("/plexaar_logo.png")} /> */}
          <FAEText subHeading bold>
            Add Address
          </FAEText>
          <FAEAutoComplete
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
            value={{ label: address }}
            required={true}
            isRequired={true}
            primary
            placeholder="Address"
          />
          <FAETextField
            primary
            label="Street & House No."
            getValue={setStreetAddress}
            required={true}
            isRequired={true}
            value={streetAddress}
            placeholder="Street & House No."
          />
          {!isBusiness && (
            <FAESelect
              values={[
                { label: "10 km", value: 10 },
                { label: "15 km", value: 15 },
                { label: "20 km", value: 20 },
                { label: "25 km", value: 25 },
                { label: "30 km", value: 30 },
                { label: "35 km", value: 35 },
                { label: "40 km", value: 40 },
                { label: "45 km", value: 45 },
                { label: "50 km", value: 50 },
              ]}
              getSelectedValue={setRadius}
              primary
              label="Miles"
              isRequired={true}
              required
            />
          )}
          {/* <FAERadioGroup
            values={[
              { label: "Expert Center", value: "expert" },
              { label: "InField", value: "infield" },
            ]}
            value={clinic}
            getSelectedValue={(e) => {
              if (e === "expert") {
                setClinic(e);
                setRadius(0);
              } else setClinic(e);
            }}
            required
            isRequired={true}
            label="Clinic Type"
            primary
          />
          {clinic === "infield" ? (
            <FAESelect
              values={[
                { label: "10 km", value: 10 },
                { label: "15 km", value: 15 },
                { label: "20 km", value: 20 },
                { label: "25 km", value: 25 },
                { label: "30 km", value: 30 },
                { label: "35 km", value: 35 },
                { label: "40 km", value: 40 },
                { label: "45 km", value: 45 },
                { label: "50 km", value: 50 },
              ]}
              getSelectedValue={setRadius}
              primary
              label="Radius"
              isRequired={true}
              required
            />
          ) : (
            ""
          )} */}
          <FAEGoogleMap
            apiKey={GOOGLE_MAP_API_KEY}
            lat={lat}
            lng={lng}
            address={address}
            getMapValues={(e) => handleChangeDragEvent(e)}
            className="fae--add-address-page-google-map"
          />
          <FAEButton>Save Address</FAEButton>
        </form>
      )}
    </div>
  );
};

export default AddOrUpdateWorkingAddress;
