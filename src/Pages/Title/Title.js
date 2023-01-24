//libs
import { FAETitle } from "@plexaar/components";
import React from "react";

//src
import { getFileSrcFromPublicFolder } from "../../utils";

//scss
import "./Title.scss";

const titleImage = getFileSrcFromPublicFolder("plexaar_logo_2.svg");

const Title = ({ logo, width, ...rest }) => {
  return (
    <>
      <FAETitle
        logo={logo ?? titleImage}
        logoWidth={width ?? "100%"}
        {...rest}
      />
    </>
  );
};

export default Title;
