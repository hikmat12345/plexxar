//libs
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, Children, Fragment } from "react";
import { FAEButton, FAEShadowBox, FAEText } from "@plexaar/components";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Switch } from "@material-ui/core";
import { useLocation } from "react-router-dom";
//src
import Loader from "../../Loader";
import {
  getAddresses,
  getWorkingAddresses,
  changeAddressState,
  deleteAddress,
} from "./actions";
import PlexaarContainer from "../../PlexaarContainer";
import history from "../../../history";
import { getFullAddress } from "../../../utils";

//scss
import "./StaffAddresses.scss";

const StaffAddresses = () => {
  const location = useLocation();
  const { staffId } = location.state;
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [residentialAddresses, setResidentialAddresses] = useState([]);
  const [workingAddresses, setWorkingAddresses] = useState([]);
  const [message, setMessage] = useState("");
  const [addressStateChanged, setAddressStateChanged] = useState(false);
  const [addressDeleted, setAddressDeleted] = useState(false);

  useEffect(() => {
    getAddresses({
      staffId,
      callback: (res) => {
        const { code, message, result } = res;
        if (code !== 0) {
          setAddresses([]);
          setMessage(message);
        } else {
          setAddresses(result);
          setResidentialAddresses(result.filter((t) => t.isResidentialAddress));
        }
      },
    });

    getWorkingAddresses({
      staffId,
      callback: (res) => {
        const { code, message, result } = res;
        if (code !== 0) {
          setWorkingAddresses([]);
          setMessage(message);
        } else {
          setWorkingAddresses(result);
        }
      },
    });
    setLoading(false);
  }, [staffId, addressDeleted, addressStateChanged]);
  const handleChangeAddressState = ({ id, state }) => {
    changeAddressState({
      id,
      state,
      staffId,
      callback: (res) => {
        const { code, message } = res;
        code !== 0
          ? someErrorOccured(message)
          : setAddressStateChanged(!addressStateChanged);
      },
    });
  };

  const handleDeleteAddress = ({ id }) => {
    setLoading(true);
    deleteAddress({
      id,
      staffId,
      callback: (res) => {
        const { code, message } = res;
        code !== 0
          ? someErrorOccured(message)
          : setAddressDeleted(!addressDeleted);
      },
    });
  };

  const someErrorOccured = (message) => {
    setLoading(true);
    alert(message);
    setLoading(false);
  };

  return (
    <>
      <FAEText subHeading bold>
        Your Residential Addresses
      </FAEText>
      <div className="add-address-button">
        <FAEButton
          onClick={() =>
            history.push({
              pathname: "/staff-residential-addresses/add",
              state: {
                next: history.location.pathname,
                staffId: staffId,
              },
            })
          }
        >
          + Add Residential Address
        </FAEButton>
      </div>
      {loading && <Loader />}
      {!loading && (
        // message === "" ? (
        <Fragment>
          {Children.toArray(
            residentialAddresses.map((address) => {
              const { line1, line2, townCity, id, isActive } = address;
              return (
                <FAEShadowBox className="addresses-page-each-unit">
                  <FAEText
                    // onClick={() =>
                    //   history.push({
                    //     pathname: "/staff-working-addresses/update",
                    //     state: {
                    //       next: history.location.pathname,
                    //       address: address,
                    //       staffId: staffId
                    //     },
                    //   })
                    // }
                    className="addresses-page-address-text pointer"
                  >
                    {getFullAddress(line1, line2, townCity)}
                  </FAEText>
                  {addresses.length > 1 && (
                    <DeleteForeverIcon
                      onClick={(e) =>
                        handleDeleteAddress({
                          id,
                        })
                      }
                      className="addresses-page-delete-icon pointer"
                    />
                  )}
                  <Switch
                    size="small"
                    className="addresses-page-delete-icon"
                    color="primary"
                    onChange={(e) =>
                      handleChangeAddressState({
                        id,
                        state: e.target.checked,
                      })
                    }
                    checked={isActive}
                  />
                </FAEShadowBox>
              );
            })
          )}
        </Fragment>
        // ) : (
        //   <NotFound message={message} link={""} />
        // )
      )}
      <br />
      <FAEText subHeading bold>
        Your Working Addresses
      </FAEText>
      <div className="add-address-button">
        <FAEButton
          onClick={() =>
            history.push({
              pathname: "/staff-working-addresses/add",
              state: {
                next: history.location.pathname,
                staffId: staffId,
              },
            })
          }
        >
          + Add Working Address
        </FAEButton>
      </div>
      {!loading && (
        // message === "" ? (
        <Fragment>
          {Children.toArray(
            workingAddresses.map((address) => {
              const { line1, line2, townCity, id, isActive } = address;
              return (
                <FAEShadowBox className="addresses-page-each-unit">
                  <FAEText
                    // onClick={() =>
                    //   history.push({
                    //     pathname: "/staff-working-addresses/update",
                    //     state: {
                    //       next: history.location.pathname,
                    //       address: address,
                    //       staffId: staffId
                    //     },
                    //   })
                    // }
                    className="addresses-page-address-text pointer"
                  >
                    {getFullAddress(line1, line2, townCity)}
                  </FAEText>
                  {addresses.length > 1 && (
                    <DeleteForeverIcon
                      onClick={(e) =>
                        handleDeleteAddress({
                          id,
                        })
                      }
                      className="addresses-page-delete-icon pointer"
                    />
                  )}
                  <Switch
                    size="small"
                    className="addresses-page-delete-icon"
                    color="primary"
                    onChange={(e) =>
                      handleChangeAddressState({
                        id,
                        state: e.target.checked,
                      })
                    }
                    checked={isActive}
                  />
                </FAEShadowBox>
              );
            })
          )}
        </Fragment>
        // ) : (
        //   <NotFound message={message} link={""} />
        // )
      )}
      {/* {screenStatus === 2 && (
        <FAEButton
          onClick={() => {
            history.push("/welcome-onboard");
          }}
        >
          Back to Welcome Page
        </FAEButton>
      )} */}
    </>
  );
};

export default PlexaarContainer(StaffAddresses);
