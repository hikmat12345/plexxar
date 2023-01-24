//libs
/* eslint-disable no-unused-vars */
import {
  FAEText,
  FAEShadowBox,
  FAEButton,
  FAECheckBoxGroup,
  FAERadioGroup,
} from "@plexaar/components";
import React, { Children, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PlexaarContainer from "../../../PlexaarContainer";
import { UserContext } from "../../../../Contexts/userContext";

//src
import "./AddStaffServiceLocation.scss";
import { addServices } from "../actions";
import { Checkbox } from "@mui/material";
import history from "../../../../history";

const AddServiceLocation = () => {
  const [userId] = useContext(UserContext);
  const location = useLocation();
  const { staffId } = location.state;
  const [radioValue, setRadioValue] = useState([]);
  const [clinic, setClinic] = useState(false);
  const [house, setHouse] = useState(false);
  const [online, setOnline] = useState(false);
  const { serviceId, serviceName, isInClinic, isInHouse, isOnline } =
    location.state;

  const handleSubmit = () => {
    if ((!clinic && !house && !online) || radioValue.length === 0) {
      alert("fill all the fields");
    } else {
      addServices({
        staffId,
        serviceId,
        house,
        clinic,
        online,
        radioValue,
        callback: (res) => {
          res.code !== 0
            ? alert(res.message)
            : history.push({
                pathname: "/staff-services",
                state: {
                  next: history.location.pathname,
                  staffId: staffId,
                },
              });
        },
      });
    }
  };
  return (
    <>
      <FAEText subHeading>Staff Service Location</FAEText>
      <br />
      <FAEShadowBox className="add-service-location-checkbox">
        <FAEText> Service Location</FAEText>
        {/* <FAECheckBoxGroup
                label= 'Location'
                values={[
                  { label: "In House", value: "1" },
                  { label: "In Clinic", value: "2" },
                  { label: "Online", value: "3" },
                ]}
                getSelectedValues= {(e)=> setCheckedValue(e)}
              /> */}
        <div className="add-service-loc-checkbox-div">
          <Checkbox
            disabled={isInHouse}
            onChange={(e) => setHouse(e.target.checked)}
          />
          <FAEText>In House</FAEText>
          <Checkbox
            disabled={isInClinic}
            onChange={(e) => setClinic(e.target.checked)}
          />
          <FAEText>In Clinic</FAEText>
          <Checkbox
            disabled={isOnline}
            onChange={(e) => setOnline(e.target.checked)}
          />
          <FAEText>Online</FAEText>
        </div>
      </FAEShadowBox>
      <br />
      <FAEShadowBox>
        <FAERadioGroup
          label="Gender"
          values={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Both", value: "both" },
          ]}
          getSelectedValue={(e) => setRadioValue(e)}
        />
      </FAEShadowBox>
      <FAEButton onClick={handleSubmit}>Submit</FAEButton>
    </>
  );
};

export default PlexaarContainer(AddServiceLocation);
