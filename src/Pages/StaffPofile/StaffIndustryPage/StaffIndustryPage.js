//libs
import { FAEText, FAEShadowBox } from "@plexaar/components";
import React, { Children, useContext, useEffect, useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useLocation } from "react-router-dom";

//src
import PlexaarContainer from "../../PlexaarContainer";
import Loader from "../../Loader";
import { CountryDetailContext } from "../../../Contexts/countryDetailContext";
import { getCookies } from "../../../utils";
import { getIndustry } from "./actions";
import history from "../../../history";

//scss
import "./StaffIndustryPage.scss";

const StaffIndustryPage = () => {
  const location = useLocation();
  const { staffId } = location.state;
  const { userCountryId } = useContext(CountryDetailContext);
  const { industryId } = getCookies("customer_details");
  const [loading, setLoading] = useState(true);
  const [industryList, setIndustryList] = useState([]);

  useEffect(() => {
    if (userCountryId) {
      getIndustry({
        userCountryId,
        industryId,
        callback: (res) => {
          setLoading(false);
          console.log("ree", res);
          setIndustryList(res);
        },
      });
    }
  }, [industryId, userCountryId]);
  const TreeNode = ({ industries }) => {
    return Children.toArray(
      industries.map((industry) => {
        const { industryName, childs, hasChilds } = industry;
        return hasChilds ? (
          <Accordion className="industry--page-unit-accordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <FAEText>{industryName ?? ""}</FAEText>
            </AccordionSummary>
            <AccordionDetails className="industry-page-accordion-detials">
              <ChildTreeNode childIndustries={childs} />
            </AccordionDetails>
          </Accordion>
        ) : (
          <FAEShadowBox
            onClick={() => {
              history.push({
                pathname: "/add-staff-services",
                state: {
                  next: history.location.pathname,
                  staffId: staffId,
                  industryId: industry.industryId,
                },
              });
            }}
            className="industry--page-clickable-units pointer"
          >
            <FAEText style={{ padding: "0 16px" }}>{industryName}</FAEText>
          </FAEShadowBox>
        );
      })
    );
  };

  const ChildTreeNode = ({ childIndustries }) => {
    return Children.toArray(
      childIndustries.map((industry) => {
        const { industryName, childs, hasChilds } = industry;
        return hasChilds ? (
          <Accordion className="industry--page-unit-accordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <FAEText>{industryName}</FAEText>
            </AccordionSummary>
            <AccordionDetails className="industry-page-accordion-detials">
              <ChildTreeNode childIndustries={childs} />
            </AccordionDetails>
          </Accordion>
        ) : (
          <FAEShadowBox
            onClick={() => {
              history.push({
                pathname: "/add-staff-services",
                state: {
                  next: history.location.pathname,
                  industryId: industry.industryId,
                  staffId: staffId,
                },
              });
            }}
            className="industry--page-clickable-units pointer"
          >
            <FAEText style={{ padding: "0 16px" }}>{industryName}</FAEText>
          </FAEShadowBox>
        );
      })
    );
  };

  return (
    <>
      <FAEText subHeading bold>
        Industry
      </FAEText>
      {loading && <Loader />}
      {!loading && <TreeNode industries={industryList} />}
    </>
  );
};

export default PlexaarContainer(StaffIndustryPage);
