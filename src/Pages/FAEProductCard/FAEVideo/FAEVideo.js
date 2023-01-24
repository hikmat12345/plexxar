//libs
import React, { useState } from "react";

//src

//scss
import "./FAEVideo.scss";

const FAEVideo = ({ src, alt, placeholder, width, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <video
          muted
          autoPlay
          loop
          playsInline
          type="video/mp4"
          width={width}
          height="100%"
          src={placeholder}
          alt={alt}
          onError={(event) => {
            event.target.src = placeholder;
            event.onerror = null;
          }}
          {...rest}
        />
      )}
      <video
        muted
        autoPlay
        loop
        playsInline
        type="video/mp4"
        width={width}
        height="100%"
        src={src}
        alt={alt}
        onError={(event) => {
          event.target.src = placeholder;
          event.onerror = null;
        }}
        style={!loaded ? { display: "none" } : {}}
        onLoadEnd={() => setLoaded(true)}
        {...rest}
      />
    </>
  );
};
export default FAEVideo