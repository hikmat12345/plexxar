// libs
import React from "react";

// src
import { FAEText, FAELoading } from "@plexaar/components";

// scss
import "./FAEIndustry.scss";

export const FAEIndustry = ({
  src,
  alt,
  label,
  loading,
  loaderProps,
  className = "",
  ...rest
}) => {
  return (
    <>
      {loading ? (
        <FAELoading {...loaderProps} />
      ) : (
        <div className={`fae--industry-container ${className}`} {...rest}>
          <img
            src={src}
            alt={alt}
            className="fae--industry-img"
            height="auto"
            width="auto"
          />
          <FAEText className="fae--industry-text" light>
            {label}
          </FAEText>
        </div>
      )}
    </>
  );
};
