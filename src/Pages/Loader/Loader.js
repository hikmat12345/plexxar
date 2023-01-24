//libs
import { FAELoading } from "@plexaar/components";
import React from "react";

//src
import { getFileSrcFromPublicFolder } from "../../utils";

//scss
import "./Loader.scss";

const Loader = ({ type, loaderImage, height, ...rest }) => {
  return (
    <>
      <FAELoading
        loaderImage={loaderImage ?? getFileSrcFromPublicFolder("loader2.webm")}
        height={height ?? "200px"}
        type={type ?? "video"}
        {...rest}
      />
    </>
  );
};

export default Loader;
