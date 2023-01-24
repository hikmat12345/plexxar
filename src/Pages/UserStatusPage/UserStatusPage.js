//libs
/* eslint-disable */
import React, { Children, useContext, useEffect, useState } from "react";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { FAEText, FAEButton, FAEDialogueBox } from "@plexaar/components";

//src
import { getUserStatus, getUserTabsStatus } from "./actions";
import {
  getCookies,
  getFileSrcFromPublicFolder,
  objectIsEmpty,
} from "../../utils";
import { UserContext } from "../../Contexts/userContext";
import history from "../../history";
import PlexaarContainer from "../PlexaarContainer";
import Loader from "../Loader";

//scss
import "./UserStatusPage.scss";
import SideNotification from "../MyComponent/SideNotification";

const UserStatusPage = () => {
  const [userId] = useContext(UserContext);
  const accountNumber = getCookies("customer_details").accountNumber;
  const [loading, setLoading] = useState(true);
  const [useStatusResponse, setUserStatusResponse] = useState({});
  const [useTabStatusResponse, setUserTabStatusResponse] = useState({});
  const [statusArray, setStatusArray] = useState([]);
  const [current, setCurrent] = useState(null);
  const [currentObj, setCurrentObj] = useState(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const descriptions = [
    "Add your business profile",
    "Add your business address",
    "Add business type and business structure",
    "Operational hours of the business",
    "Choose the services which your business offers",
    "Add staff information",
    "",
    "",
  ];
  useEffect(() => {
    if (!objectIsEmpty(useStatusResponse)) {
      const { error, message, result } = useStatusResponse;
      if (error) {
        alert(message);
      } else {
        setCurrent(
          result.find((a) => !a.isCompleted)
            ? result.find((a) => !a.isCompleted).id
            : 8
        );
        setCurrentObj(result.find((a) => !a.isCompleted));
        setStatusArray(result);
      }
      setUserStatusResponse({});
    }
  }, [useStatusResponse]);

  useEffect(async () => {
    if (userId !== "") {
      await getUserTabsStatus({
        userId,
        callback: (res) => {
          setUserTabStatusResponse(res);
        },
      });
      await getUserStatus({
        userId,
        callback: (res) => {
          setUserStatusResponse(res);
          setLoading(false);
        },
      });
    }
  }, [userId]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="user-status-container">
          <SideNotification />
          <div className="user-status-main">
            {/* <div className="page-logo">
              <img src={getFileSrcFromPublicFolder("/plexaar_logo.png")} />
            </div> */}
            <div className="head-text">
              <FAEText bold subHeading>
                {useTabStatusResponse.userStatusModel.businessName}
              </FAEText>
              <FAEText style={{ textAlign: "center", color: "#787878" }}>
                ID: {accountNumber}
              </FAEText>
            </div>
            <div className="status-page-status-units-wrapper">
              {/* <div className={`status-page-status-unit`}>
              <FAEText>{getCookies("customer_details").firstName}</FAEText>
              <FAEText>{getCookies("customer_details").accountNumber}</FAEText>
            </div> */}
              {Children.toArray(
                statusArray.map((status) => {
                  const { id, label, isActive, isEnable, isCompleted } = status;
                  return (
                    <>
                      {id < 7 ? (
                        <div
                          className={`status-page-status-unit ${
                            id === current && "current-status-unit"
                          } ${id > current && "after-status-unit"}`}
                          onClick={() => {
                            //
                            if (isEnable && id <= current) {
                              id === 1
                                ? history.push({
                                    pathname: "/update-profile",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 2
                                ? isCompleted
                                  ? history.push({
                                      pathname: "/your-working-addresses",
                                      state: {
                                        next: history.location.pathname,
                                        userId,
                                      },
                                    })
                                  : history.push({
                                      pathname: "/your-working-addresses/add",
                                      state: {
                                        next: history.location.pathname,
                                        userId,
                                      },
                                    })
                                : id === 3
                                ? history.push({
                                    pathname: "/questions-answers/1",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 4
                                ? history.push({
                                    pathname: "/your-schedule",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 5
                                ? history.push({
                                    pathname: "/your-services",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 6
                                ? history.push({
                                    pathname: "/your-staff",
                                    state: {
                                      next: history.location.pathname,
                                      from: "signup",
                                    },
                                  })
                                : console.log("");
                            } else {
                              setOpen(true);
                              setContent(`First Complete ${currentObj?.label}`);
                            }
                          }}
                        >
                          <div className="status-page-status-unit-icon-and-label">
                            {/* <AssignmentTurnedInIcon
                      className={`status-page-status-unit-icon ${
                        !isActive && "in-active-unit-icon"
                      }`}
                    /> */}
                            <img
                              className="user-status-icon"
                              src={`/onboard/${
                                id === current
                                  ? "white"
                                  : id < current
                                  ? "red"
                                  : "gray"
                              }/${
                                id === 1
                                  ? "Business Profile@2x.png"
                                  : id === 2
                                  ? "Business Address@2x.png"
                                  : id === 3
                                  ? "more-info.png"
                                  : id === 4
                                  ? "Business Hours@2x.png"
                                  : id === 5
                                  ? "Business Services@2x.png"
                                  : id === 6
                                  ? "Staff@2x.png"
                                  : id === 7
                                  ? "Training@2x.png"
                                  : id === 8
                                  ? "Onboarding Meeting@2x.png"
                                  : ""
                              }`}
                            />
                            <div>
                              <FAEText>{label}</FAEText>
                              {id === current && (
                                <FAEText>{descriptions[id - 1]}</FAEText>
                              )}
                            </div>
                          </div>
                          <FAEText className="status-page-status-unit-stage">
                            {isCompleted ? (
                              <img
                                src="/onboard/complete@2x.png"
                                width="20px"
                              />
                            ) : (
                              // <CheckCircleIcon color="success" />
                              // <CancelIcon color="error" />
                              ""
                            )}
                            {/* {isCompleted ? "Completed" : ""} */}
                          </FAEText>
                        </div>
                      ) : useTabStatusResponse.userStatusModel.userStatus ===
                          3 && id === 8 ? (
                        <div
                          className={`status-page-status-unit ${
                            id === current && "current-status-unit"
                          } ${id > current && "after-status-unit"}`}
                          onClick={() => {
                            //
                            if (isEnable && id <= current) {
                              id === 1
                                ? history.push({
                                    pathname: "/update-profile",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 2
                                ? history.push({
                                    pathname: "/your-working-addresses",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 3
                                ? history.push({
                                    pathname: "/questions-answers/1",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 4
                                ? history.push({
                                    pathname: "/your-schedule",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 5
                                ? history.push({
                                    pathname: "/your-services",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 6
                                ? history.push({
                                    pathname: "/your-staff",
                                    state: {
                                      next: history.location.pathname,
                                      from: "signup",
                                    },
                                  })
                                : console.log("");
                            } else {
                              setOpen(true);
                              setContent(`First Complete ${currentObj?.label}`);
                            }
                          }}
                        >
                          <div className="status-page-status-unit-icon-and-label">
                            {/* <AssignmentTurnedInIcon
                    className={`status-page-status-unit-icon ${
                      !isActive && "in-active-unit-icon"
                    }`}
                  /> */}
                            <img
                              className="user-status-icon"
                              src={`/onboard/${
                                id === current
                                  ? "white"
                                  : id < current
                                  ? "red"
                                  : "gray"
                              }/${
                                id === 1
                                  ? "Business Profile@2x.png"
                                  : id === 2
                                  ? "Business Address@2x.png"
                                  : id === 3
                                  ? "Business Hours@2x.png"
                                  : id === 4
                                  ? "Business Services@2x.png"
                                  : id === 5
                                  ? "Documents@2x.png"
                                  : id === 6
                                  ? "Apply@2x.png"
                                  : id === 7
                                  ? "Onboarding Meeting@2x.png"
                                  : id === 8
                                  ? "Training@2x.png"
                                  : id === 9
                                  ? "Staff@2x.png"
                                  : id === 10
                                  ? "Business Approval@3x.png"
                                  : ""
                              }`}
                            />
                            <div>
                              <FAEText>{label}</FAEText>
                              {id === current && (
                                <FAEText>{descriptions[id - 1]}</FAEText>
                              )}
                            </div>
                          </div>
                          <FAEText className="status-page-status-unit-stage">
                            {isCompleted ? (
                              <img
                                src="/onboard/complete@2x.png"
                                width="20px"
                              />
                            ) : (
                              // <CheckCircleIcon color="success" />
                              // <CancelIcon color="error" />
                              ""
                            )}
                            {/* {isCompleted ? "Completed" : ""} */}
                          </FAEText>
                        </div>
                      ) : useTabStatusResponse.userStatusModel.userStatus ===
                          3 && id === 7 ? (
                        <div
                          className={`status-page-status-unit ${
                            id === current && "current-status-unit"
                          } ${id > current && "after-status-unit"}`}
                          onClick={() => {
                            //
                            if (isEnable && id <= current) {
                              id === 1
                                ? history.push({
                                    pathname: "/update-profile",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 2
                                ? history.push({
                                    pathname: "/your-working-addresses",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 3
                                ? history.push({
                                    pathname: "/questions-answers/1",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 4
                                ? history.push({
                                    pathname: "/your-schedule",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 5
                                ? history.push({
                                    pathname: "/your-services",
                                    state: {
                                      next: history.location.pathname,
                                      userId,
                                    },
                                  })
                                : id === 6
                                ? history.push({
                                    pathname: "/your-staff",
                                    state: {
                                      next: history.location.pathname,
                                      from: "signup",
                                    },
                                  })
                                : console.log("");
                            } else {
                              setOpen(true);
                              setContent(`First Complete ${currentObj?.label}`);
                            }
                          }}
                        >
                          <div className="status-page-status-unit-icon-and-label">
                            {/* <AssignmentTurnedInIcon
                  className={`status-page-status-unit-icon ${
                    !isActive && "in-active-unit-icon"
                  }`}
                /> */}
                            <img
                              className="user-status-icon"
                              src={`/onboard/${
                                id === current
                                  ? "white"
                                  : id < current
                                  ? "red"
                                  : "gray"
                              }/${
                                id === 1
                                  ? "Business Profile@2x.png"
                                  : id === 2
                                  ? "Business Address@2x.png"
                                  : id === 3
                                  ? "Business Hours@2x.png"
                                  : id === 4
                                  ? "Business Services@2x.png"
                                  : id === 5
                                  ? "Documents@2x.png"
                                  : id === 6
                                  ? "Apply@2x.png"
                                  : id === 7
                                  ? "Onboarding Meeting@2x.png"
                                  : id === 8
                                  ? "Training@2x.png"
                                  : id === 9
                                  ? "Staff@2x.png"
                                  : id === 10
                                  ? "Business Approval@3x.png"
                                  : ""
                              }`}
                            />
                            <div>
                              <FAEText>{label}</FAEText>
                              {id === current && (
                                <FAEText>{descriptions[id - 1]}</FAEText>
                              )}
                            </div>
                          </div>
                          <FAEText className="status-page-status-unit-stage">
                            {isCompleted ? (
                              <img
                                src="/onboard/complete@2x.png"
                                width="20px"
                              />
                            ) : (
                              // <CheckCircleIcon color="success" />
                              // <CancelIcon color="error" />
                              ""
                            )}
                            {/* {isCompleted ? "Completed" : ""} */}
                          </FAEText>
                        </div>
                      ) : (
                        ""
                      )}
                      {/* {id !== 10 && <hr className="user-status-line" />} */}
                    </>
                  );
                })
              )}
              {/* {!statusArray.some((status) => status.isCompleted === false) && (
              <FAEButton>Next</FAEButton>
            )} */}
            </div>
          </div>
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
    </>
  );
};

export default UserStatusPage;
