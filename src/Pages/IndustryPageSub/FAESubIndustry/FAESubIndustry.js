// libs
import React from "react";

// src
import {FAEText, FAELoading, FAEShadowBox } from "@plexaar/components";

// css
import "./FAESubIndustry.scss";

export const FAESubIndustry = ({
  src,
  alt,
  label,
  icon,
  loading,
  loaderProps,
  shadowBoxProps,
  ...rest
}) => {
  return (
    <>
      <FAEShadowBox {...shadowBoxProps}>
        {loading ? (
          <FAELoading {...loaderProps} />
        ) : (
          <div className="fae--sub-industry" {...rest}>
            <div className="fae--sub-industry-content">
              <img
                src={src}
                alt={alt}
                width={window.screen.width > 599 ? "250px" : "200px"}
              />
              <FAEText>{label}</FAEText>
            </div>
            {window.screen.width > 799 && (
              <div className="fae--sub-industry-icon">{icon}</div>
            )}
          </div>
        )}
      </FAEShadowBox>
    </>
  );
};
