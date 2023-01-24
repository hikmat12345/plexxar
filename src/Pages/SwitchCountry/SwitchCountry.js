import React from "react";
import PlexaarContainer from "../PlexaarContainer";
import { FAEText, FAEShadowBox } from "@plexaar/components";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//src
import { getCookies } from "../../utils";
import "./SwitchCountry.scss";

const SwitchCountry = () => {
  return (
    <>
      <FAEText bold subHeading>
        Select Country
      </FAEText>
      <FAEShadowBox
        primary
        padding
        className={`switch-country-list ${
          getCookies("countryId") === "1" && "switch-country-active"
        }`}
      >
        {getCookies("countryId") === 1 ? (
          <CheckCircleIcon color="success" />
        ) : (
          ""
        )}{" "}
        <FAEText>United Kingdom</FAEText>
      </FAEShadowBox>
      <FAEShadowBox
        primary
        padding
        className={`switch-country-list ${
          getCookies("countryId") === "253" && "switch-country-active"
        }`}
      >
        {getCookies("countryId") === 253 ? (
          <CheckCircleIcon color="success" />
        ) : (
          ""
        )}{" "}
        <FAEText>United State</FAEText>
      </FAEShadowBox>
      <FAEShadowBox
        primary
        padding
        className={`switch-country-list ${
          getCookies("countryId") === "171" && "switch-country-active"
        }`}
      >
        {getCookies("countryId") === 171 ? (
          <CheckCircleIcon color="success" />
        ) : (
          ""
        )}{" "}
        <FAEText>Pakistan</FAEText>
      </FAEShadowBox>
    </>
  );
};
export default PlexaarContainer(SwitchCountry);
