//lib
import { FAETextField } from "@plexaar/components";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PlexaarContainer from "../../PlexaarContainer";

//src
import "./ProfileDetail.scss";

const ProfileDetail = () => {
  const location = useLocation();
  const eventDetail = location.state;
  console.log(eventDetail);
  const [profileDetail] = useState(eventDetail);
  return (
    <>
      <FAETextField
        label="First Name"
        value={profileDetail.firstName}
        disabled={true}
      />
      <FAETextField
        label="Last Name"
        value={profileDetail.lastName}
        disabled={true}
      />
      <FAETextField
        label="Email"
        value={profileDetail.customerEmail}
        disabled={true}
      />
      <FAETextField
        label="Mobile"
        value={profileDetail.customerMobile}
        disabled={true}
      />
      <FAETextField
        label="Date of Birth"
        value={profileDetail.dateOfBirth}
        disabled={true}
      />
      <FAETextField
        label="Address Line 1"
        placeholder="Address Line 1"
        value={profileDetail.line1}
        disabled={true}
      />
      <FAETextField
        label="Address Line 2"
        placeholder="Address Line 2"
        value={profileDetail.line2}
        disabled={true}
      />
      <FAETextField
        label="Town City"
        placeholder="Town City"
        value={profileDetail.townCity}
        disabled={true}
      />
      <FAETextField
        label="Address Notes"
        placeholder="Address Notes"
        value={profileDetail.addressNotes}
        disabled={true}
      />
    </>
  );
};

export default PlexaarContainer(ProfileDetail);
