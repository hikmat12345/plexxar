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
import { FAEIndustries } from "./FAEIndustries/FAEIndustries";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

// import { FAEIndustries } from "@findanexpert-fae/components";
//src
import PlexaarContainer from "../PlexaarContainer";
import Loader from "../Loader";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import {
  faeIndustriesParser,
  getCookies,
  getFileSrcFromPublicFolder,
  getUniqueData,
} from "../../utils";
import {
  getIndustry,
  getBusnissService,
  getServices,
  addServices,
} from "./actions";
import history from "../../history";

//scss
import "./IndustryPage.scss";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const IndustryPage = () => {
  const location = useLocation();
  const { userId, next } = location.state;
  const isBusiness =
    next === "/staff-user-status" || next === "/staff-onboard"
      ? false
      : getCookies("customer_details").isBusiness;
  const { userCountryId } = useContext(CountryDetailContext);
  const [loading, setLoading] = useState(true);
  const [industryList, setIndustryList] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [value, setValue] = useState("");
  const [allservices, setAllServices] = useState([]);
  const [allservicesData, setAllServicesData] = useState([]);
  const [searchServices, setSearchServices] = useState([]);
  const [openedPanels, setOpenedPanels] = useState([]);
  const [selectPref, setSelectPref] = useState([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const getServicesAPI = () => {
    setLoading(true);
    isBusiness
      ? getServices({
          userId,
          isBusiness,
          userCountryId,
          callback: (res) => {
            setAllServices(res);
            setAllServicesData(res);
            let data = [];
            res.map((a) => data.push({ id: a.serviceId, selected: "" }));
            setSelectPref(data);
            setLoading(false);
          },
        })
      : getBusnissService({
          providerId: userId,
          countryId: userCountryId,
          callback: (res) => {
            // setLoading(false);
            if (res.code === 0) {
              setProviderServices(res.result);
              let data = [];
              res.result.map((a) =>
                data.push({ id: a.serviceId, selected: "" })
              );
              setSelectPref(data);
            }
            setLoading(false);
          },
        });
  };

  const getChilds = (res) => {
    setAllServices(res);
    let data = [];
    res.map((a) => data.push({ id: a.serviceId, selected: "" }));
    setSelectPref(data);
  };

  useEffect(() => {
    if (userCountryId && isBusiness) {
      getIndustry({
        userCountryId,
        callback: (res) => {
          setIndustryList(res);
        },
      });
      getServicesAPI();
    }
  }, [userCountryId]);

  useEffect(() => {
    if (userCountryId) {
      getServicesAPI();
    }
  }, [userCountryId]);

  const handleChangeOpenedPanels = (serviceName) => {
    openedPanels.some((id) => id === serviceName)
      ? setOpenedPanels(openedPanels.filter((id) => id !== serviceName))
      : setOpenedPanels([...openedPanels, serviceName]);
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
  // const TreeNode = ({ industries }) => {
  //   return Children.toArray(
  //     industries.map((industry) => {
  //       const { industryName, childs, hasChilds, industryId } = industry;
  //       return hasChilds ? (
  //         <Accordion className="industry--page-unit-accordion">
  //           <AccordionSummary
  //             expandIcon={<ExpandMoreIcon />}
  //             aria-controls="panel1a-content"
  //             id="panel1a-header"
  //           >
  //             <FAEText>{industryName}</FAEText>
  //           </AccordionSummary>
  //           <AccordionDetails className="industry-page-accordion-detials">
  //             <ChildTreeNode childIndustries={childs} />
  //           </AccordionDetails>
  //         </Accordion>
  //       ) : (
  //         <FAEShadowBox
  //           onClick={() => {
  //             history.push({
  //               pathname: "/add-services",
  //               state: {
  //                 next,
  //                 industryId: industry.industryId,
  //                 userId,
  //                 isBusiness,
  //               },
  //             });
  //           }}
  //           className="industry--page-clickable-units pointer"
  //         >
  //           <FAEText style={{ padding: "0 16px" }}>{industryName}</FAEText>
  //         </FAEShadowBox>
  //       );
  //     })
  //   );
  // };

  // const ChildTreeNode = ({ childIndustries }) => {
  //   return Children.toArray(
  //     childIndustries.map((industry) => {
  //       const { industryName, childs, hasChilds } = industry;
  //       return hasChilds ? (
  //         <Accordion className="industry--page-unit-accordion">
  //           <AccordionSummary
  //             expandIcon={<ExpandMoreIcon />}
  //             aria-controls="panel1a-content"
  //             id="panel1a-header"
  //           >
  //             <FAEText>{industryName}</FAEText>
  //           </AccordionSummary>
  //           <AccordionDetails className="industry-page-accordion-detials">
  //             <ChildTreeNode childIndustries={childs} />
  //           </AccordionDetails>
  //         </Accordion>
  //       ) : (
  //         <FAEShadowBox
  //           onClick={() => {
  //             history.push({
  //               pathname: "/add-services",
  //               state: {
  //                 next,
  //                 industryId: industry.industryId,
  //                 userId,
  //                 isBusiness,
  //               },
  //             });
  //           }}
  //           className="industry--page-clickable-units pointer"
  //         >
  //           <FAEText style={{ padding: "0 16px" }}>{industryName}</FAEText>
  //         </FAEShadowBox>
  //       );
  //     })
  //   );
  // };

  // const handleChangeService = (
  //   serviceName,
  //   serviceId,
  //   isInClinic,
  //   isInHouse,
  //   isOnline
  // ) => {
  //   history.push({
  //     pathname: "/add-services-location",
  //     state: {
  //       serviceId: serviceId,
  //       serviceName: serviceName,
  //       isInClinic,
  //       isInHouse,
  //       isOnline,
  //       userId,
  //       isBusiness,
  //       next,
  //     },
  //   });
  // };

  const filterItems = (queryText, customerArray) => {
    var query = queryText.toLowerCase();

    let listitems = [];

    // For First Name
    const ServiceID = customerArray.filter((item) => {
      return (
        item.serviceId !== null &&
        item.serviceId.toString().lastIndexOf(query, 0) >= 0
      );
    });

    if (ServiceID.length > 0) {
      listitems = listitems.concat(ServiceID);
    }
    // For Last Name
    const ServiceName = customerArray.filter((item) => {
      return (
        item.serviceName !== null &&
        item.serviceName.toLowerCase().lastIndexOf(query, 0) >= 0
      );
    });
    if (ServiceName.length > 0) {
      listitems = listitems.concat(ServiceName);
    }

    // // For Email
    // const Email = customerArray.filter((item) => {
    //   return (
    //     item.email !== null &&
    //     item.email.toLowerCase().lastIndexOf(query, 0) >= 0
    //   );
    // });
    // if (Email.length > 0) {
    //   listitems = listitems.concat(Email);
    // }

    // // For AccountNo
    // const Account = customerArray.filter((item) => {
    //   return (
    //     item.accountNumber !== null &&
    //     item.accountNumber.toLowerCase().lastIndexOf(query, 0) >= 0
    //   );
    // });
    // if (Account.length > 0) {
    //   listitems = listitems.concat(Account);
    // }

    // // let x = "0042";
    // query = query.replace(/^0+/, "");

    // // For mobile
    // const Mobile = customerArray.filter((item) => {
    //   return (
    //     item.mobile !== null &&
    //     item.mobile.toLowerCase().lastIndexOf(query, 4) >= 0
    //   );
    // });
    // if (Mobile.length > 0) {
    //   listitems = listitems.concat(Mobile);
    // }

    // console.log(getUniqueData(listitems, "id"));
    return getUniqueData(listitems, "serviceId");
  };

  const filterFun = (text) => {
    setValue(text);
    if (text !== "") {
      const result = filterItems(text, allservicesData);
      console.log(allservicesData.length, result.length);
      setSearchServices(result);
    } else {
      setSearchServices([]);
    }
  };

  useEffect(() => {
    if (searchServices != undefined) {
      if (searchServices.length > 0) {
        setAllServices(searchServices);
      } else {
        if (value.length > 0) {
          setAllServices(searchServices);
        } else {
          setAllServices(allservicesData);
        }
      }
    } else {
      setSearchServices([]);
    }
  }, [searchServices]);

  return (
    <div className="industry-page-main">
      {/* <FAEText subHeading bold>
        {isBusiness ? "Industry" : "Select Service"}
      </FAEText> */}
      {loading && <Loader />}
      {!loading && (
        <div>
          <FAEIndustries
            className="fae--home-page-industries"
            industries={faeIndustriesParser(
              industryList,
              userId,
              isBusiness,
              next
            )}
            collapseIcon={
              window.screen.width > 600
                ? getFileSrcFromPublicFolder("up_arrow.png")
                : getFileSrcFromPublicFolder("mobile_down.png")
            }
            expandIcon={
              window.screen.width > 600
                ? getFileSrcFromPublicFolder("down_arrow.png")
                : getFileSrcFromPublicFolder("mobile_up.png")
            }
          />
          <div
            style={{
              display: "flex",
              width: "60%",
              margin: "20px auto",
            }}
          >
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
            {isBusiness && (
              <div className="search">
                <label htmlFor="search">
                  <SearchOutlinedIcon />
                  {/* <img src="onboard/search-icon.png" /> */}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={value}
                  id="search"
                  onChange={(e) => filterFun(e.target.value)}
                  //filterFun(e.target.value)
                />
              </div>
            )}
          </div>
          <div className="all-services">
            {isBusiness
              ? allservices.map((service) => (
                  <Accordion
                    expanded={
                      service.hasSubservice || service.isAlreadyAdded
                        ? false
                        : openedPanels.some(
                            (panel) => panel === service.serviceName
                          )
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
                            newArr.find(
                              (a) => a.id === service.serviceId
                            ).selected = "online";
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
                            newArr.find(
                              (a) => a.id === service.serviceId
                            ).selected = "inClinic";
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
                            newArr.find(
                              (a) => a.id === service.serviceId
                            ).selected = "inHouse";
                            setSelectPref(newArr);
                          }}
                          disabled={!service.isInHouse}
                        >
                          In House
                        </FAEButton>
                      </div>
                      <FAEButton
                        onClick={() => handleAddService(service.serviceId)}
                      >
                        {" "}
                        Save{" "}
                      </FAEButton>
                    </AccordionDetails>
                  </Accordion>
                ))
              : providerServices.map((service) => (
                  <Accordion
                    expanded={
                      service.isAlreadyAdded
                        ? false
                        : openedPanels.some(
                            (panel) => panel === service.serviceName
                          )
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
                            newArr.find(
                              (a) => a.id === service.serviceId
                            ).selected = "online";
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
                            newArr.find(
                              (a) => a.id === service.serviceId
                            ).selected = "inClinic";
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
                            newArr.find(
                              (a) => a.id === service.serviceId
                            ).selected = "inHouse";
                            setSelectPref(newArr);
                          }}
                          disabled={!service.isInHouse}
                        >
                          In House
                        </FAEButton>
                      </div>
                      <FAEButton
                        onClick={() => handleAddService(service.serviceId)}
                      >
                        {" "}
                        Save{" "}
                      </FAEButton>
                    </AccordionDetails>
                  </Accordion>
                ))}
          </div>
          {providerServices.length === 0 && !isBusiness && (
            <FAEText style={{ textAlign: "center" }}>No Services Found</FAEText>
          )}
        </div>
      )}
      {/* {!loading && isBusiness ? (
        <TreeNode industries={industryList} />
      ) : (
        <>
          {providerServices &&
            providerServices.map((service) => {
              const {
                serviceName,
                serviceId,
                isInClinic,
                isInHouse,
                isOnline,
              } = service;

              return (
                <FAEShadowBox className="services--page-clickable-units pointer">
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
            })}
        </>
      )} */}
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

export default IndustryPage;
