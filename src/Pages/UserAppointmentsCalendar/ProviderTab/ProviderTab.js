//libs
import { FAEAvatar } from "@plexaar/components";
import { FAEText } from "@plexaar/components/dist/stories/FAEText/FAEText";
import React from "react";

//src

//scss
import "./ProviderTab.scss";

const ProviderTab = ({ providerInfo: { resource } }) => {
  const { title, extendedProps } = resource;
  return (
    <>
      <div className="provider-tab-info-wrapper">
        <FAEText>{title}</FAEText>
        <FAEAvatar size="small" src={extendedProps.imagePath} />
      </div>
    </>
  );
};

export default ProviderTab;
