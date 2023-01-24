// libs
import React from "react";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

// src
import { FAESubIndustry } from "../FAESubIndustry/FAESubIndustry";
import {FAEContainer, FAELoading } from "@plexaar/components";

// css
import "./FAESubIndustries.scss";

export const FAESubIndustries = ({
  subIndustries,
  forwardIcon = <ArrowForwardIosIcon />,
  className = "",
  justify,
  align,
  loading,
  loaderProps,
  shadowBoxProps,
  ...rest
}) => {
  return (
    <FAEContainer justify={justify} align={align}>
      {loading ? (
        <FAELoading {...loaderProps} />
      ) : (
        <div className={`fae--sub-industries ${className}`} {...rest}>
          {subIndustries.map((subIndustry, index) => {
            const { src, alt, label, ...rest } = subIndustry;
            return (
              <FAESubIndustry
                key={index}
                src={src}
                alt={alt}
                label={label}
                icon={forwardIcon}
                shadowBoxProps={shadowBoxProps}
                {...rest}
              />
            );
          })}
        </div>
      )}
    </FAEContainer>
  );
};
