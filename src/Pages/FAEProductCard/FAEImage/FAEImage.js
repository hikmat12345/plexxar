//libs
import React, { useState } from "react";
import { FAEText } from "@plexaar/components";

//src

//scss
import "./FAEImage.scss";

const FAEImage = ({
  src,
  alt,
  placeholder,
  width = "100%",
  textPosition = "bottom-right",
  textOnImage = "",
  textProps,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <div className="fae--service-card-image-container">
        {!loaded && (
          <img
            width={width}
            height="100%"
            src={placeholder}
            alt="placeholder"
            onError={(event) => {
              event.target.src = placeholder;
              event.onerror = null;
            }}
            {...rest}
          />
        )}
        <img
          width={width}
          height="100%"
          src={src}
          alt={alt}
          onError={(event) => {
            event.target.src = placeholder;
            event.onerror = null;
          }}
          style={!loaded ? { display: "none" } : {}}
          onLoad={() => setLoaded(true)}
          {...rest}
        />
        {textOnImage && (
          <FAEText
            primary
            {...textProps}
            className={`fae--image-text ${textPosition}`}
            bold
          >
            {textOnImage}
          </FAEText>
        )}
      </div>
    </>
  );
};
export default FAEImage