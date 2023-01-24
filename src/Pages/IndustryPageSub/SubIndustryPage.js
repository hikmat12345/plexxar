//libs
/* eslint-disable */
import { FAEText, FAEShadowBox } from "@plexaar/components";
import React, { Children, useContext, useEffect, useState } from "react";
// import Accordion from "@material-ui/core/Accordion";
// import AccordionSummary from "@material-ui/core/AccordionSummary";
// import AccordionDetails from "@material-ui/core/AccordionDetails";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FAESubIndustries } from "./FAESubIndustries/FAESubIndustries";
// import { FAEIndustries } from "@findanexpert-fae/components";
//src
import PlexaarContainer from "../PlexaarContainer";
import Loader from "../Loader";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import {
  faeIndustriesParser,
  faeSubIndustriesParser,
  getCookies,
  getFileSrcFromPublicFolder,
} from "../../utils";
import { getIndustry, getBusnissService } from "./actions";
import history from "../../history";

//scss
import "./SubIndustryPage.scss";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const loaderImage = getFileSrcFromPublicFolder("loader.webm");

const SubIndustryPage = () => {
  const location = useLocation();
  const { userId, next, industryId, childs } = location.state;
  const isBusiness =
    next === "/staff-user-status" || next === "/staff-onboard"
      ? false
      : getCookies("customer_details").isBusiness;
  const { userCountryId } = useContext(CountryDetailContext);
  const [loading, setLoading] = useState(true);
  const [subIndustries, setSubIndustries] = useState(childs);
  const [providerServices, setProviderServices] = useState([]);
  console.log(location.state);
  setTimeout(() => {
    setLoading(false);
  }, 1000);
  return (
    <div className="sub-industry-page-main">
      <img
        src="/onboard/arrow-back.svg"
        width="40px"
        style={{ cursor: "pointer" }}
        onClick={
          () => history.goBack()
          // history.push({
          //   pathname: "/your-staff",
          //   state: {
          //     next: "/user-status",
          //     from: "signup",
          //   },
          // })
        }
      />
      <FAEText subHeading bold className="main-heading">
        {window.location.pathname.split("/")[1]}
      </FAEText>
      <div style={{ marginTop: "10px" }}></div>
      {loading && <Loader />}
      {!loading && (
        <FAESubIndustries
          loading={loading}
          loaderProps={{
            loaderImage,
            height: "150px",
            type: "video",
          }}
          subIndustries={faeSubIndustriesParser(
            subIndustries,
            userId,
            isBusiness,
            next
          )}
          shadowBoxProps={{ primary: true }}
        />
      )}
    </div>
  );
};

export default PlexaarContainer(SubIndustryPage);
