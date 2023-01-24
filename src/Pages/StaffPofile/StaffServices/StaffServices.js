//libs
import { FAEText, FAEButton, FAEShadowBox } from "@plexaar/components";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { Children, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//src
import PlexaarContainer from "../../PlexaarContainer";
import { deleteUserService, getUserServices } from "./actions";
import NotFound from "../../NotFound";
import Loader from "../../Loader";
import history from "../../../history";

//scss
import "./StaffServices.scss";

const StaffServices = () => {
  const location = useLocation();
  const { staffId } = location.state;
  const [loading, setLoading] = useState(true);
  const [userServices, setUserServices] = useState([]);
  const [message, setMessage] = useState("");
  const [serviceDeleted, setServiceDeleted] = useState(false);

  useEffect(() => {
    console.log(staffId);
    getUserServices({
      staffId,
      callback: (res) => {
        const { statusCode, message, providerServicesList } = res;
        setLoading(false);
        if (statusCode !== 0) {
          setUserServices([]);
          setMessage(message);
        } else {
          setUserServices(providerServicesList);
        }
      },
    });
  }, [staffId, serviceDeleted]);

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

  return (
    <>
      <FAEText subHeading bold>
        Your Service(s)
      </FAEText>
      <div className="add-services-button">
        <FAEButton
          onClick={() =>
            history.push({
              pathname: "/staff-industry",
              state: {
                next: history.location.pathname,
                staffId: staffId,
              },
            })
          }
        >
          Add Service(s)
        </FAEButton>
      </div>
      {loading && <Loader />}
      {!loading ? (
        message === "" ? (
          Children.toArray(
            userServices.map((service) => {
              const { serviceTypeName, id } = service;
              return (
                <FAEShadowBox className="services-page-each-unit">
                  <FAEText className="services-page-address-text pointer">
                    {serviceTypeName}
                  </FAEText>
                  <DeleteForeverIcon
                    onClick={() => handleDeleteService(id)}
                    className="services-page-delete-icon pointer"
                  />
                </FAEShadowBox>
              );
            })
          )
        ) : (
          <NotFound message={message} link="" />
        )
      ) : (
        ""
      )}
    </>
  );
};

export default PlexaarContainer(StaffServices);
