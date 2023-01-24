//libs
/* eslint-disable */
import React, {
  useContext,
  useEffect,
  useState,
  Children,
  Fragment,
} from "react";
import {
  FAEButton,
  FAEShadowBox,
  FAEText,
  FAEDialogueBox,
  FAESelect,
} from "@plexaar/components";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Switch } from "@material-ui/core";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
//src
import { UserContext } from "../../Contexts/userContext";
import Loader from "../Loader";
import {
  getAddresses,
  getWorkingAddresses,
  changeAddressState,
  deleteAddress,
  saveWorkingAddress,
} from "./actions";
import NotFound from "../NotFound";
import PlexaarContainer from "../PlexaarContainer";
import history from "../../history";
import { UserPermissionsContext } from "../../Contexts/userPermissionsContext";
import {
  getCookies,
  getFullAddress,
  getFileSrcFromPublicFolder,
} from "../../utils";

//scss
import "./WorkingAddresses.scss";
import { useLocation } from "react-router-dom";

const WorkingAddresses = () => {
  const location = useLocation();
  const { userId, next } = location.state;
  const isBusiness =
    next === "/staff-user-status" || next === "/staff-onboard"
      ? false
      : getCookies("customer_details").isBusiness;
  const { screenStatus } = useContext(UserPermissionsContext);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [workingAddresses, setWorkingAddresses] = useState([]);
  const [residentialAddresses, setResidentialAddresses] = useState([]);
  const [message, setMessage] = useState("");
  const [addressStateChanged, setAddressStateChanged] = useState(false);
  const [addressDeleted, setAddressDeleted] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [contentAlert, setContentAlert] = useState(false);
  const [popNo, setPopNo] = useState(0);
  const [radius, setRadius] = useState(10);

  const getAllAddresses = async () => {
    await getAddresses({
      userId,
      callback: (res) => {
        const { code, message, result } = res;
        if (code !== 0) {
          setAddresses([]);
          setMessage(message);
        } else {
          setAddresses(result);
          console.log(
            result.filter((t) => t.radius > 0),
            isBusiness,
            next
          );
          setResidentialAddresses(result.filter((t) => t.radius > 0));
        }
      },
    });

    await getWorkingAddresses({
      userId,
      callback: (res) => {
        const { code, message, result } = res;
        if (code !== 0) {
          setWorkingAddresses([]);
          setMessage(message);
        } else {
          setWorkingAddresses(result.filter((t) => t.radius === 0));
        }
      },
    });
    setLoading(false);
  };
  useEffect(() => {
    getAllAddresses();
  }, [userId, addressDeleted, addressStateChanged]);

  const handleChangeAddressState = ({ id, state }) => {
    changeAddressState({
      id,
      state,
      userId,
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
      userId,
      callback: (res) => {
        const { code, message } = res;
        code !== 0
          ? someErrorOccured(message)
          : setAddressDeleted(!addressDeleted);
      },
    });
  };

  const someErrorOccured = (message) => {
    alert(message);
    setLoading(true);
  };

  const handleSameAddress = () => {
    setOpen(false);
    setPopNo(0);
    setLoading(true);

    saveWorkingAddress({
      userId,
      address: workingAddresses[0].line1,
      lat: workingAddresses[0].latitude,
      lng: workingAddresses[0].longitude,
      radius,
      inclinic: false,
      isBusiness: false,
      callback: (res) => {
        const { code, error, message } = res;
        if (code === 0) getAllAddresses();
        else {
          setContentAlert(message);
          setOpenAlert(true);
          setLoading(false);
        }
      },
    });
  };
  return (
    <div className="address-page-container">
      {loading && <Loader />}
      {!loading && (
        <div className="address-page-main">
          {/* <div className="page-logo">
            <img
              src={getFileSrcFromPublicFolder("/plexaar_logo.png")}
              width="140px"
            />
          </div> */}
          <FAEText bold subHeading style={{ textAlign: "center" }}>
            Your Address
          </FAEText>
          <div className="working-address">
            <img
              src="/onboard/arrow-back.svg"
              width="40px"
              style={{ cursor: "pointer" }}
              onClick={() => {
                history.push({
                  pathname: `${history.location.state.next}`,
                  state: { userId },
                });
              }}
            />
            <FAEText>Business Address</FAEText>
            {workingAddresses.map((address) => {
              const { line1, line2, townCity, id, isActive } = address;
              return (
                <>
                  <div className="address-card">
                    <img src="onboard/address-icon.svg" />
                    <FAEText>{getFullAddress(line1, line2, townCity)}</FAEText>
                  </div>
                </>
              );
            })}
          </div>
          {!isBusiness && (
            <div className="residential-address">
              <FAEText>Infield Address</FAEText>
              {residentialAddresses.map((address) => {
                const { line1, line2, townCity, id, radius } = address;
                return (
                  <>
                    <div className="address-card">
                      <div className="card-headline">
                        <img src="onboard/address-icon.svg" />
                        <FAEText>
                          {getFullAddress(line1, line2, townCity)}
                        </FAEText>
                      </div>
                      <div className="miles-main">
                        <FAEText className="miles-head">Service Radius</FAEText>
                        <FAEText bold>{radius} Kilometers</FAEText>
                      </div>
                    </div>
                  </>
                );
              })}
              {residentialAddresses.length === 0 && (
                <FAEButton onClick={() => setOpen(true)}>
                  Add Infield Address
                </FAEButton>
              )}
            </div>
          )}
          {/* {screenStatus >= 1 && (
            <FAEButton
              className="address-back-to"
              onClick={() => {
                history.push({
                  pathname: `${history.location.state.next}`,
                  state: { userId },
                });
              }}
            >
              Back to Onboarding Page
            </FAEButton>
          )} */}
        </div>
      )}
      <FAEDialogueBox
        open={open}
        content={
          <div className="address-model">
            <FAEText subHeading>Confirm</FAEText>
            <FAEText>Keep infield address same as business address</FAEText>
            {popNo === 0 ? (
              <>
                <FAEButton onClick={() => setPopNo(1)}>Yes</FAEButton>
                <FAEButton
                  className="address-model-no-btn"
                  onClick={() =>
                    history.push({
                      pathname: "/your-working-addresses/add",
                      state: { userId, next },
                    })
                  }
                >
                  No, Add New Address
                </FAEButton>
              </>
            ) : (
              <>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <FAEText style={{ textAlign: "initial" }}>
                    Select Kilometers
                  </FAEText>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={radius}
                    label="KM"
                    onChange={(e) => setRadius(e.target.value)}
                  >
                    <MenuItem value={10}>10 km</MenuItem>
                    <MenuItem value={15}>15 km</MenuItem>
                    <MenuItem value={20}>20 km</MenuItem>
                    <MenuItem value={25}>25 km</MenuItem>
                    <MenuItem value={30}>30 km</MenuItem>
                    <MenuItem value={35}>35 km</MenuItem>
                    <MenuItem value={40}>40 km</MenuItem>
                    <MenuItem value={45}>45 km</MenuItem>
                    <MenuItem value={50}>50 km</MenuItem>
                  </Select>
                </FormControl>
                <FAEButton onClick={handleSameAddress}>Save</FAEButton>
              </>
            )}
            <FAEText
              className="cancel-btn"
              onClick={() => {
                setOpen(false);
                setPopNo(0);
              }}
            >
              Cancel
            </FAEText>
          </div>
        }
        // buttons={[
        //   {
        //     label: "Cancel",
        //     onClick: () => {
        //       setOpen(false);
        //     },
        //   },
        // ]}
      />
      <FAEDialogueBox
        open={openAlert}
        content={contentAlert}
        buttons={[
          {
            label: "Ok",
            onClick: () => {
              setOpenAlert(false);
              setPopNo(0);
            },
          },
        ]}
      />
    </div>
  );
  // return (
  //   <>
  //     <FAEText subHeading bold>
  //       Your Residential Addresses
  //     </FAEText>
  //     <div className="add-address-button">
  //       {residentialAddresses.length === 0 ? (
  //         <FAEButton
  //           onClick={() =>
  //             history.push({
  //               pathname: "/your-residential-addresses/add",
  //               state: { userId, next: next },
  //             })
  //           }
  //         >
  //           + Add Residential Address
  //         </FAEButton>
  //       ) : (
  //         ""
  //       )}
  //     </div>
  //     {loading && <Loader />}
  //     {!loading && (
  //       // message === "" ? (
  //       <Fragment>
  //         {Children.toArray(
  //           residentialAddresses.map((address) => {
  //             const { line1, line2, townCity, id, isActive } = address;
  //             return (
  //               <FAEShadowBox className="addresses-page-each-unit">
  //                 <FAEText
  //                   // onClick={() =>
  //                   //   history.push({
  //                   //     pathname: "/staff-working-addresses/update",
  //                   //     state: {
  //                   //       next: history.location.pathname,
  //                   //       address: address,
  //                   //       staffId: staffId
  //                   //     },
  //                   //   })
  //                   // }
  //                   className="addresses-page-address-text pointer"
  //                 >
  //                   {getFullAddress(line1, line2, townCity)}
  //                 </FAEText>
  //                 {residentialAddresses.length > 1 && (
  //                   <DeleteForeverIcon
  //                     onClick={(e) =>
  //                       handleDeleteAddress({
  //                         id,
  //                       })
  //                     }
  //                     className="addresses-page-delete-icon pointer"
  //                   />
  //                 )}
  //                 {/* <Switch
  //                   size="small"
  //                   className="addresses-page-delete-icon"
  //                   color="primary"
  //                   onChange={(e) =>
  //                     handleChangeAddressState({
  //                       id,
  //                       state: e.target.checked,
  //                     })
  //                   }
  //                   checked={isActive}
  //                 /> */}
  //               </FAEShadowBox>
  //             );
  //           })
  //         )}
  //       </Fragment>
  //       // ) : (
  //       //   <NotFound message={message} link={""} />
  //       // )
  //     )}
  //     <br />
  //     <FAEText subHeading bold>
  //       Your Working Addresses
  //     </FAEText>
  //     <div className="add-address-button">
  //       {workingAddresses.length === 0 ? (
  //         <FAEButton
  //           onClick={() =>
  //             history.push({
  //               pathname: "/your-working-addresses/add",
  //               state: { userId, next: next },
  //             })
  //           }
  //         >
  //           + Add Working Address
  //         </FAEButton>
  //       ) : (
  //         ""
  //       )}
  //     </div>
  //     {!loading ? (
  //       message === "" ? (
  //         <Fragment>
  //           {Children.toArray(
  //             workingAddresses.map((address) => {
  //               const { line1, line2, townCity, id, isActive } = address;
  //               return (
  //                 <FAEShadowBox className="addresses-page-each-unit">
  //                   <FAEText
  //                     // onClick={() =>
  //                     //   history.push({
  //                     //     pathname: "/your-working-addresses/update",
  //                     //     state: {
  //                     //       next: next,
  //                     //       address: address,
  //                     //     },
  //                     //   })
  //                     // }
  //                     className="addresses-page-address-text pointer"
  //                   >
  //                     {getFullAddress(line1, line2, townCity)}
  //                   </FAEText>
  //                   {workingAddresses.length > 1 && (
  //                     <DeleteForeverIcon
  //                       onClick={(e) =>
  //                         handleDeleteAddress({
  //                           id,
  //                         })
  //                       }
  //                       className="addresses-page-delete-icon pointer"
  //                     />
  //                   )}
  //                   {/* <Switch
  //                     size="small"
  //                     className="addresses-page-delete-icon"
  //                     color="primary"
  //                     onChange={(e) =>
  //                       handleChangeAddressState({
  //                         id,
  //                         state: e.target.checked,
  //                       })
  //                     }
  //                     checked={isActive}
  //                   /> */}
  //                 </FAEShadowBox>
  //               );
  //             })
  //           )}
  //         </Fragment>
  //       ) : (
  //         // <NotFound message={message} link={""} />
  //         <FAEText>{message}</FAEText>
  //       )
  //     ) : (
  //       ""
  //     )}
  //     {screenStatus >= 1 && (
  //       <FAEButton
  //         onClick={() => {
  //           history.push({
  //             pathname: `${history.location.state.next}`,
  //             state: { userId },
  //           });
  //         }}
  //       >
  //         Back to Onboarding Page
  //       </FAEButton>
  //     )}
  //   </>
  // );
};

export default WorkingAddresses;
