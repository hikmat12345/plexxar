//libs
/* eslint-disable */
import { FAEText, FAEButton, FAEShadowBox } from "@plexaar/components";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { Children, useContext, useEffect, useState } from "react";

//src
import PlexaarContainer from "../PlexaarContainer";
import { deleteUserService, getUserServices } from "./actions";
import NotFound from "../NotFound";
import { UserPermissionsContext } from "../../Contexts/userPermissionsContext";
import Loader from "../Loader";
import history from "../../history";
import { getFileSrcFromPublicFolder, getUniqueData } from "../../utils";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

//scss
import "./UserServicesPage.scss";
import { useLocation } from "react-router-dom";

const UserServicesPage = () => {
  const location = useLocation();
  const { userId, next } = location.state;
  const { screenStatus } = useContext(UserPermissionsContext);
  const [loading, setLoading] = useState(true);
  const [allservicesData, setAllServicesData] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [searchServices, setSearchServices] = useState([]);
  const [message, setMessage] = useState("");
  const [serviceDeleted, setServiceDeleted] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    getUserServices({
      userId,
      callback: (res) => {
        const { statusCode, message, providerServicesList } = res;
        setLoading(false);
        if (statusCode !== 0) {
          setUserServices([]);
          setMessage(message);
        } else {
          setUserServices(providerServicesList);
          setAllServicesData(providerServicesList);
        }
      },
    });
  }, [userId, serviceDeleted]);

  const handleDeleteService = (serviceId) => {
    setLoading(true);
    deleteUserService({
      serviceId,
      callback: (res) => {
        const { statusCode, message } = res;
        statusCode !== 0
          ? someErrorOccured(message)
          : setServiceDeleted(!serviceDeleted);
      },
    });
  };

  const someErrorOccured = (message) => {
    setLoading(false);
    alert(message);
  };

  const filterItems = (queryText, customerArray) => {
    var query = queryText.toLowerCase();

    let listitems = [];

    // For First Name
    const ServiceID = customerArray.filter((item) => {
      return (
        item.serviceTypeId !== null &&
        item.serviceTypeId.toString().lastIndexOf(query, 0) >= 0
      );
    });

    if (ServiceID.length > 0) {
      listitems = listitems.concat(ServiceID);
    }
    // For Last Name
    const ServiceName = customerArray.filter((item) => {
      return (
        item.serviceTypeName !== null &&
        item.serviceTypeName.toLowerCase().lastIndexOf(query) >= 0
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
    return getUniqueData(listitems, "serviceTypeId");
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
        setUserServices(searchServices);
      } else {
        if (value.length > 0) {
          setUserServices(searchServices);
        } else {
          setUserServices(allservicesData);
        }
      }
    } else {
      setSearchServices([]);
    }
  }, [searchServices]);

  return (
    <div className="user-service-main">
      <div className="user-service-inside">
        {/* <div className="page-logo">
          <img
            src={getFileSrcFromPublicFolder("/plexaar_logo.png")}
            width="140px"
          />
        </div> */}
        <FAEText className="main-head" subHeading bold>
          Your Services
        </FAEText>
        <div className="add-services-button">
          <img
            src="/onboard/arrow-back.svg"
            width="40px"
            style={{ cursor: "pointer" }}
            onClick={() => {
              history.push({ pathname: next, state: { userId } });
            }}
          />

          {message === "" ? (
            <div className="search">
              <label htmlFor="search">
                <SearchOutlinedIcon />
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
          ) : (
            <div></div>
          )}
          <FAEButton
            onClick={() =>
              history.push({
                pathname: "/industry",
                state: { userId, next },
              })
            }
          >
            Add Services
          </FAEButton>
        </div>
        {loading && <Loader />}
        {!loading ? (
          message === "" ? (
            Children.toArray(
              userServices.map((service) => {
                const {
                  serviceTypeName,
                  id,
                  isApproved,
                  isInclinic,
                  isInhouse,
                  isOnline,
                } = service;
                return (
                  <FAEShadowBox className="services-page-each-unit">
                    <div className="service-name">
                      <FAEText className="services-page-address-text pointer head-text">
                        {serviceTypeName}
                      </FAEText>
                      <FAEText className="services-page-address-text pointer sub-head-text">
                        {serviceTypeName}
                      </FAEText>
                    </div>
                    {isApproved ? (
                      <div className="approved">
                        {" "}
                        <FAEText>Approved</FAEText>{" "}
                      </div>
                    ) : (
                      <div className="pending">
                        {" "}
                        <FAEText>Pending</FAEText>{" "}
                      </div>
                    )}
                    {/* <DeleteForeverIcon
                    onClick={() => handleDeleteService(id)}
                    className="services-page-delete-icon pointer"
                  /> */}
                  </FAEShadowBox>
                );
              })
            )
          ) : (
            <FAEText style={{ textAlign: "center", margin: "auto" }}>
              {message}
            </FAEText>
          )
        ) : (
          ""
        )}
        {/* {screenStatus < 3 ||
      next === "/staff-onboard" ||
      next === "/user-status" ||
      next === "/staff-user-status" ? (
        <FAEButton
          className="user-service-back-btn"
          onClick={() => {
            history.push({ pathname: next, state: { userId } });
          }}
        >
          Back to onboarding Page
        </FAEButton>
      ) : (
        ""
      )} */}
      </div>
    </div>
  );
};

export default UserServicesPage;
