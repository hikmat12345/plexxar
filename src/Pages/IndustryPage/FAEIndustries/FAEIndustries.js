// libs
import React, { useState } from "react";
import { Collapse } from "@material-ui/core";

// src
import { FAEContainer, FAELoading } from "@plexaar/components";
import { FAEIndustry } from "../FAEIndustry/FAEIndustry";

// scss
import "./FAEIndustries.scss";

export const FAEIndustries = ({
  industries,
  className = "",
  justify,
  align,
  expandIcon,
  collapseIcon,
  loading,
  loaderProps,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const filteredIndustries =
    window.screen.width > 799
      ? industries.filter((industry, index) => index < 12)
      : industries.filter((industry, index) => index < 10);
  const remainingIndustries =
    window.screen.width > 799
      ? industries.filter((industry, index) => index >= 12)
      : industries.filter((industry, index) => index >= 10);

  const toggleIndustries = () => {
    setIsVisible(!isVisible);
  };

  return (
    <FAEContainer className="fae-industry-container">
      {loading ? (
        <FAELoading {...loaderProps} />
      ) : (
        <div
          className={`fae--industries-main-container ${className}`}
          {...rest}
        >
          <div className="fae--industries-container">
            {filteredIndustries.map((industry, index) => {
              const { src, alt, label, ...rest } = industry;
              return (
                <FAEIndustry
                  key={index}
                  src={src}
                  alt={alt}
                  label={label}
                  {...rest}
                />
              );
            })}
          </div>
          <div className="fae--remaining-industries-container">
            <Collapse timeout={1000} in={isVisible}>
              {remainingIndustries.map((industry, index) => {
                const { src, alt, label, ...rest } = industry;
                return (
                  <FAEIndustry
                    key={index}
                    src={src}
                    alt={alt}
                    label={label}
                    {...rest}
                  />
                );
              })}
            </Collapse>
            {window.screen.width > 799 && industries.length > 12 ? (
              isVisible ? (
                <img
                  src={collapseIcon}
                  alt="Up Arrow"
                  className="fae--up-arrow"
                  onClick={toggleIndustries}
                />
              ) : (
                <img
                  src={expandIcon}
                  alt="Down Arrow"
                  className="fae--down-arrow"
                  onClick={toggleIndustries}
                />
              )
            ) : (
              ""
            )}
            {window.screen.width < 799 && industries.length > 10 ? (
              isVisible ? (
                <img
                  src={collapseIcon}
                  alt="Up Arrow"
                  className="fae--up-arrow"
                  onClick={toggleIndustries}
                />
              ) : (
                <img
                  src={expandIcon}
                  alt="Down Arrow"
                  className="fae--down-arrow"
                  onClick={toggleIndustries}
                />
              )
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </FAEContainer>
  );
};
