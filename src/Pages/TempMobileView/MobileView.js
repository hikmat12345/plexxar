import React from "react";

import { FAEText } from "@plexaar/components";
import { getFileSrcFromPublicFolder } from "../../utils";
import './MobileView.scss'

export default function MobileView() {
  return (
    <div className="mobile-view-main">
      <img src="onboard/exp-logo.png" alt="expert-logo" className="exp-logo" />
      <FAEText className="headline">
        Expert has partnered with plexaar to provide an efficient ERP system.
      </FAEText>
      <div className="links-main">
        <img
          src={getFileSrcFromPublicFolder("plexaar_logo_2.svg")}
          className="plex-logo"
        />
        <FAEText
          style={{
            fontSize: "15px",
            marginBottom: "30px",
            marginTop: "10px",
          }}
          bold
        >
          Download and continue signing up
        </FAEText>
        <a
          href="https://play.google.com/store/apps/details?id=com.selteq.expertcrm"
          style={{ marginBottom: "10px" }}
        >
          <img
            src={getFileSrcFromPublicFolder("play-store.png")}
            className="store-logo"
          />
        </a>
        <a href="https://apps.apple.com/pk/app/plexaar/id1576352135">
          <img
            src={getFileSrcFromPublicFolder("app-store.png")}
            className="store-logo"
          />
        </a>
      </div>
    </div>
  );
}
