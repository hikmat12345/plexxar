//libs
/* eslint-disable */
import {
  FAEText,
  FAEShadowBox,
  FAEButton,
  FAEDialogueBox,
} from "@plexaar/components";
import React, { Children, useContext, useEffect, useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
//src
import PlexaarContainer from "../PlexaarContainer";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import Loader from "../Loader";
import { addServices, getServices } from "./actions";
import { objectIsEmpty } from "../../utils";
import history from "../../history";

//scss
import "./AddServicesPage.scss";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
const AddServicesPage = () => {
  const location = useLocation();
  const { userId, isBusiness, next } = location.state;
  const { userCountryId } = useContext(CountryDetailContext);
  const {
    state: { industryId },
  } = history.location;
  console.log(location);
  const [loading, setLoading] = useState(true);
  const [servicesList, setServicesList] = useState([]);
  const [addServicesResponse, setAddServicesResponse] = useState({});
  const [openedPanels, setOpenedPanels] = useState([]);
  const [selectPref, setSelectPref] = useState([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  // useEffect(() => {
  //   if (!objectIsEmpty(addServicesResponse)) {
  //     setLoading(false);
  //     const { statusCode, message } = addServicesResponse;
  //     statusCode !== 0
  //       ? alert(message)
  //       : history.push({
  //           pathname: "/your-services",
  //           state: { next: history.location.pathname, userId },
  //         });
  //     setAddServicesResponse({});
  //   }
  // }, [addServicesResponse]);
  const getServicesAPI = () => {
    setLoading(true);
    getServices({
      userId,
      isBusiness,
      industryId,
      userCountryId,
      callback: (res) => {
        // console.log(res);
        setServicesList(res);
        let data = [];
        res.map((a) => data.push({ id: a.serviceId, selected: "" }));
        setSelectPref(data);
        setLoading(false);
      },
    });
  };
  const getChilds = (res) => {
    setServicesList(res);
    let data = [];
    res.map((a) => data.push({ id: a.serviceId, selected: "" }));
    setSelectPref(data);
  };

  useEffect(() => {
    if (userCountryId) {
      getServicesAPI();
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
      pathname: "/add-services-location",
      state: {
        serviceId: serviceId,
        serviceName: serviceName,
        isInClinic,
        isInHouse,
        isOnline,
        userId,
        isBusiness,
        next,
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

  const handleAddService = (serviceId) => {
    let selectedPref = selectPref.find((a) => a.id === serviceId).selected;
    let isOnline = selectedPref === "online" ? true : false;
    let isInclinic = selectedPref === "inClinic" ? true : false;
    let isInhouse = selectedPref === "inHouse" ? true : false;
    if (selectedPref !== "") {
      addServices({
        userId,
        serviceId,
        isOnline,
        isInclinic,
        isInhouse,
        isBusiness,
        callback: (res) => {
          if (res.code !== 0) {
            setOpen(true);
            setContent(res.message);
          } else {
            setOpen(true);
            setContent(res.message);
            getServicesAPI();
            setOpenedPanels([]);
          }
        },
      });
    } else {
      setOpen(true);
      setContent("Please select preferece!");
    }
  };
  return (
    <div className="add-services-main">
      <FAEText subHeading bold>
        Services
      </FAEText>
      {loading && <Loader />}
      {/* {!loading && <TreeNode services={servicesList} />} */}
      {/* <FAEButton onClick={() => addUserServices()}>Save Service(s)</FAEButton> */}
      {!loading && (
        <div className="add-services-container">
          {servicesList.map((service) => (
            <Accordion
              expanded={
                service.hasSubservice || service.isAlreadyAdded
                  ? false
                  : openedPanels.some((panel) => panel === service.serviceName)
              }
              // expanded={false}
              onClick={() =>
                service.hasSubservice
                  ? history.push({
                      pathname: "/add-sub-services",
                      state: {
                        serviceId: service.serviceId,
                        userId,
                        isBusiness,
                        next,
                      },
                    })
                  : service.hasChilds
                  ? getChilds(service.childs)
                  : console.log("")
              }
              onChange={() =>
                !service.isAlreadyAdded &&
                handleChangeOpenedPanels(service.serviceName)
              }
              className="services--page-unit-accordion"
            >
              <AccordionSummary
                expandIcon={
                  openedPanels.some((a) => a === service.serviceName) ? (
                    <img src="onboard/cross.png" />
                  ) : service.isAlreadyAdded ? (
                    <img src="onboard/added.png" />
                  ) : service.hasSubservice || service.hasChilds ? (
                    <img src="onboard/go-next.png" />
                  ) : (
                    <img src="onboard/plus.png" />
                  )
                }
                // ExpandMoreIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <img
                  src={
                    service.serviceId % 2 === 0
                      ? "onboard/blue-dot.png"
                      : "onboard/pink-dot.png"
                  }
                  height="10px"
                />
                <FAEText>{service.serviceName}</FAEText>
              </AccordionSummary>
              <AccordionDetails className="services-page-accordion-detials">
                {/* <FAEText>{service.serviceName}</FAEText> */}
                <hr />
                <div className="preference">
                  <img src="onboard/location.png" height="25px" />
                  <FAEText>Choose your Preferences</FAEText>
                </div>
                <div
                  className={`pref-options op${service.serviceId}`}
                  selected=""
                >
                  <FAEButton
                    className={
                      selectPref.find((a) => a.id === service.serviceId)
                        .selected === "online"
                        ? "option1"
                        : "option"
                    }
                    onClick={() => {
                      let newArr = [...selectPref];
                      newArr.find((a) => a.id === service.serviceId).selected =
                        "online";
                      setSelectPref(newArr);
                    }}
                    disabled={!service.isOnline}
                  >
                    Online
                  </FAEButton>

                  <FAEButton
                    className={
                      selectPref.find((a) => a.id === service.serviceId)
                        .selected === "inClinic"
                        ? "option1"
                        : "option"
                    }
                    onClick={() => {
                      let newArr = [...selectPref];
                      newArr.find((a) => a.id === service.serviceId).selected =
                        "inClinic";
                      setSelectPref(newArr);
                    }}
                    disabled={!service.isInClinic}
                  >
                    In Clinic
                  </FAEButton>

                  <FAEButton
                    className={
                      selectPref.find((a) => a.id === service.serviceId)
                        .selected === "inHouse"
                        ? "option1"
                        : "option"
                    }
                    onClick={() => {
                      let newArr = [...selectPref];
                      newArr.find((a) => a.id === service.serviceId).selected =
                        "inHouse";
                      setSelectPref(newArr);
                    }}
                    disabled={!service.isInHouse}
                  >
                    In House
                  </FAEButton>
                </div>
                <FAEButton onClick={() => handleAddService(service.serviceId)}>
                  {" "}
                  Save{" "}
                </FAEButton>
              </AccordionDetails>
            </Accordion>
          ))}
          {servicesList.length === 0 && <FAEText>No Record Found</FAEText>}
        </div>
      )}
      <FAEDialogueBox
        open={open}
        content={content}
        buttons={[
          {
            label: "Ok",
            onClick: () => {
              setOpen(false);
            },
          },
        ]}
      />
    </div>
  );
};

export default PlexaarContainer(AddServicesPage);
