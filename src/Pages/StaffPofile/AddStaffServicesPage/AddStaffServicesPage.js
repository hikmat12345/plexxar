/* eslint-disable no-unused-vars */
//libs
import { FAEText, FAEShadowBox, FAEButton } from "@plexaar/components";
import React, { Children, useContext, useEffect, useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Checkbox from "@mui/material/Checkbox";
import { useLocation } from "react-router-dom";

//src
import PlexaarContainer from "../../PlexaarContainer";
import { CountryDetailContext } from "../../../Contexts/countryDetailContext";
import Loader from "../../Loader";
import { getServices, addServices } from "./actions";
import { objectIsEmpty } from "../../../utils";
import history from "../../../history";
import { UserContext } from "../../../Contexts/userContext";

//scss
import "./AddStaffServicesPage.scss";
const AddStaffServicesPage = () => {
  const location = useLocation();
  const { staffId, industryId } = location.state;
  const [userId] = useContext(UserContext);
  const { userCountryId } = useContext(CountryDetailContext);
  // const {
  //   state: { industryId },
  // } = history.location;
  const [loading, setLoading] = useState(true);
  const [servicesList, setServicesList] = useState([]);
  const [checkedArray, setCheckedArray] = useState([]);
  const [addServicesResponse, setAddServicesResponse] = useState({});
  const [openedPanels, setOpenedPanels] = useState([]);

  useEffect(() => {
    if (!objectIsEmpty(addServicesResponse)) {
      setLoading(false);
      const { statusCode, message } = addServicesResponse;
      statusCode !== 0
        ? alert(message)
        : history.push({
            pathname: "/staff-services",
            state: { next: history.location.pathname },
          });
      setAddServicesResponse({});
    }
  }, [addServicesResponse]);

  useEffect(() => {
    if (userCountryId) {
      getServices({
        industryId,
        userCountryId,
        callback: (res) => {
          console.log(res);
          setLoading(false);
          setServicesList(res);
        },
      });
    }
  }, [industryId, userCountryId]);
  const handleChangeService = (
    serviceName,
    serviceId,
    isInClinic,
    isInHouse,
    isOnline
  ) => {
    history.push({
      pathname: "/add-staff-services-location",
      state: {
        staffId: staffId,
        serviceId: serviceId,
        serviceName: serviceName,
        isInClinic,
        isInHouse,
        isOnline,
      },
    });
    // checkedArray.some((id) => id === serviceId)
    //   ? setCheckedArray(checkedArray.filter((id) => id !== serviceId))
    //   : setCheckedArray([...checkedArray, serviceId]);
  };

  const handleChangeOpenedPanels = (serviceName) => {
    openedPanels.some((id) => id === serviceName)
      ? setOpenedPanels(openedPanels.filter((id) => id !== serviceName))
      : setOpenedPanels([...openedPanels, serviceName]);
  };

  const TreeNode = ({ services }) => {
    return Children.toArray(
      services.map((service) => {
        const {
          serviceName,
          childs,
          hasChilds,
          serviceId,
          isInClinic,
          isInHouse,
          isOnline,
        } = service;
        return hasChilds ? (
          <Accordion
            expanded={openedPanels.some((panel) => panel === serviceName)}
            onChange={() => handleChangeOpenedPanels(serviceName)}
            className="services--page-unit-accordion"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <FAEText>{serviceName}</FAEText>
            </AccordionSummary>
            <AccordionDetails className="services-page-accordion-detials">
              <ChildTreeNode childServices={childs} />
            </AccordionDetails>
          </Accordion>
        ) : (
          <FAEShadowBox className="services--page-clickable-units pointer">
            {/* <Checkbox
              onClick={() => handleChangeService(serviceId)}
              style={{ color: "#548dff" }}
              checked={checkedArray.some((id) => id === serviceId)}
            /> */}
            <FAEText
              onClick={() =>
                handleChangeService(
                  serviceName,
                  serviceId,
                  isInClinic,
                  isInHouse,
                  isOnline
                )
              }
              style={{ color: "#548dff", marginLeft: "30px" }}
            >
              {serviceName}
            </FAEText>
          </FAEShadowBox>
        );
      })
    );
  };

  const ChildTreeNode = ({ childServices }) => {
    return Children.toArray(
      childServices.map((service) => {
        const {
          serviceName,
          childs,
          hasChilds,
          serviceId,
          isInClinic,
          isInHouse,
          isOnline,
        } = service;
        return hasChilds ? (
          <Accordion
            expanded={openedPanels.some((panel) => panel === serviceName)}
            onChange={() => handleChangeOpenedPanels(serviceName)}
            className="services--page-unit-accordion"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <FAEText>{serviceName}</FAEText>
            </AccordionSummary>
            <AccordionDetails className="services-page-accordion-detials">
              <TreeNode services={childs} />
            </AccordionDetails>
          </Accordion>
        ) : (
          <FAEShadowBox className="services--page-clickable-units pointer">
            {/* <Checkbox
              onClick={() => handleChangeService(serviceId)}
              style={{ color: "#548dff" }}
              checked={checkedArray.some((id) => id === serviceId)}
            /> */}
            <FAEText
              onClick={() =>
                handleChangeService(
                  serviceName,
                  serviceId,
                  isInClinic,
                  isInHouse,
                  isOnline
                )
              }
              style={{ color: "#548dff", marginLeft: "30px" }}
            >
              {serviceName}
            </FAEText>
          </FAEShadowBox>
        );
      })
    );
  };

  const addUserServices = () => {
    setLoading(true);
    addServices({
      userId,
      checkedArray,
      callback: (res) => setAddServicesResponse(res),
    });
  };

  return (
    <>
      <FAEText subHeading bold>
        Add Your Staff Service(s)
      </FAEText>
      {loading && <Loader />}
      {!loading && <TreeNode services={servicesList} />}
    </>
  );
};

export default PlexaarContainer(AddStaffServicesPage);
