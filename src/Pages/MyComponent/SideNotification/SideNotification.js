import React from "react";
import { FAEText } from "@plexaar/components";

import "./SideNotification.scss";
export default function SideNotification() {
  return (
    <div className="side-notification">
      <img src="onboard/call-us.png" width="50px" alt="call-us" />
      <div className="side-note">
        <FAEText style={{ fontSize: "12px" }}>Call us at</FAEText>
        <FAEText style={{ fontSize: "16px" }}>+44 2070996738</FAEText>
      </div>
    </div>
  );
}
