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
import PlexaarContainer from "../../PlexaarContainer";
import {
  getAddressSuggestions,
  getPlaceDetails,
  saveWorkingAddress,
} from "./actions";
import { addressSuggestionsParser } from "../../../parsers";
import { objectIsEmpty } from "../../../utils";
import { CountryDetailContext } from "../../../Contexts/countryDetailContext";
import { UserContext } from "../../../Contexts/userContext";
import history from "../../../history";
import Loader from "../../Loader";
import { useLocation } from "react-router-dom";
//scss
import "./AddOrUpdateStaffResidentialAddress.scss";

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const AddOrUpdateWorkingAddress = () => {
  const location = useLocation();
  const { staffId } = location.state;

  const [userId] = useContext(UserContext);
  const { userLat, userLng } = useContext(CountryDetailContext);
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [address, setAddress] = useState("");
  const [placeDetails, setPlaceDetails] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [streetAddress, setStreetAddress] = useState("");
  const [radius, setRadius] = useState(null);
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
            pathname: history.location.state.next,
            state: { staffId: staffId },
          });
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
    setLoading(true);
    saveWorkingAddress({
      staffId,
      address,
      streetAddress,
      lat,
      lng,
      radius,
      callback: (res) => setSaveWorkingAddressResponse(res),
    });
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <form
          onSubmit={handleSubmit}
          className="add-or-update-address-form-wrapper"
        >
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
            value={streetAddress}
            placeholder="Street & House No."
          />
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
    </>
  );
};

export default PlexaarContainer(AddOrUpdateWorkingAddress);
