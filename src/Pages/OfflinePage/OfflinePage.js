import { FAEText } from "@plexaar/components/dist/stories/FAEText/FAEText";
import React from "react";
import { getFileSrcFromPublicFolder } from "../../utils";

//src
import "./OfflinePage.scss";
import OfflineSVG from "./OfflineSVG";

const OfflinePage = () => {
  return (
    <div className="offline-main">
      <img src={getFileSrcFromPublicFolder("plexaar_logo.png")} alt="logo" />
      {/* <img src="/img/offline.svg" /> */}
      <OfflineSVG />
      <div className="offline-text">
        <FAEText bold className="text-one">
          Dear User
        </FAEText>
        <FAEText className="text-two">
          Please check your internet connection!
        </FAEText>
      </div>
    </div>
  );
};

export default OfflinePage;
