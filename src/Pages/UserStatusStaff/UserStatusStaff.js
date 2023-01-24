/* eslint-disable*/
//libs
import React, { Children, useContext, useEffect, useState } from "react";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { FAEText, FAEButton, FAEDialogueBox } from "@plexaar/components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Switch from "@mui/material/Switch";

//src
import { ActiveInactiveStaff, getUserStatus } from "./actions";
import { getCookies, objectIsEmpty, setCookies } from "../../utils";
import history from "../../history";
import PlexaarContainer from "../PlexaarContainer";
import Loader from "../Loader";

//scss
import "./UserStatusStaff.scss";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { deleteBusinessStaff } from "../BusinessStaffPage/actions";

const UserStatusPage = () => {
  // const [userId] = useContext(UserContext);
  const location = useLocation();
  const { userId } = location.state;
  const staffDetail = getCookies("staffDetail");
  const providerId = getCookies("staffDetail").id;
  const { isActive, isApproved } = getCookies("staffDetail");
  const authToken = getCookies("customer_details").authToken;
  const businessId = getCookies("userId");
  const userName = staffDetail.firstName + " " + staffDetail.lastName;
  const accountNumber = staffDetail.accountNumber;
  const [loading, setLoading] = useState(true);
  const [useStatusResponse, setUserStatusResponse] = useState({});
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

  useEffect(() => {
    if (userId !== "") {
      getUserStatus({
        userId,
        callback: (res) => {
          setUserStatusResponse(res);
          setLoading(false);
        },
      });
    }
  }, [userId]);
  return (
    <div className="staff-onboard-main-container">
      {loading && <Loader />}
      {!loading && (
        <div className="staff-onboard-container">
          <div className="staff-onboard-main">
            <FAEText
              subHeading
              bold
              style={{
                textAlign: "center",
                color: "#787878",
              }}
            >
              Staff Onboarding
            </FAEText>
            {getCookies("customer_details").isBusiness && (
              // <FAEButton
              //   onClick={() =>
              //     history.push({
              //       pathname: "/your-staff",
              //       state: {
              //         next: "/user-status",
              //         from: "signup",
              //       },
              //     })
              //   }
              // >
              //   Go Back
              // </FAEButton>
              <img
                src="/onboard/arrow-back.svg"
                width="40px"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  history.push({
                    pathname: "/your-staff",
                    state: {
                      next: "/user-status",
                      from: "signup",
                    },
                  })
                }
              />
            )}
            <div className="staff-onboard-profile">
              {/* <div className="staff-back-btn" style={{ marginTop: "6px" }}>
              <ArrowBackIcon
                color="primary"
                fontSize="large"
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  history.push({
                    pathname: "/your-staff",
                    state: {
                      next: "/user-status",
                      from: "signup",
                    },
                  })
                }
              />
            </div> */}
              <div className="profile">
                {/* <div></div> */}
                <img src="/onboard/default-expert.png" width="60px" />
                <div style={{ paddingTop: "6px" }}>
                  <FAEText bold style={{ fontSize: "16px" }}>
                    {userName}
                  </FAEText>
                  <FAEText style={{ color: "#787878" }}>
                    {accountNumber}
                  </FAEText>
                </div>
              </div>
              <div style={{ paddingTop: "12px", paddingRight: "20px" }}>
                <Switch
                  disabled={!isApproved}
                  defaultChecked={isActive}
                  onChange={(e) => {
                    ActiveInactiveStaff({
                      businessId: parseInt(businessId),
                      authToken,
                      providerId,
                      isActive: e.target.checked,
                      callback: (res) => {
                        if (res.code === 0) {
                          var x = getCookies("staffDetail");
                          x.isActive = e.target.checked;
                          setCookies("staffDetail", x);
                        } else {
                          alert(res.message);
                        }
                      },
                    });
                  }}
                />
              </div>
            </div>
            <Timeline
              sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
              }}
            >
              <div className="status-page-status-units-wrapper">
                {Children.toArray(
                  statusArray.map((status) => {
                    const { id, label, isActive, isEnable, isCompleted } =
                      status;
                    return (
                      <div className="status-page-inside">
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot
                              variant={id === current ? "outlined" : "filled"}
                              color={id <= current ? "primary" : "action"}
                            />
                            <TimelineConnector
                              style={{
                                backgroundColor:
                                  id < current ? "#5599ff" : "#bdbdbd",
                              }}
                            />
                          </TimelineSeparator>
                          <TimelineContent>
                            {id !== current && (
                              <div>
                                <FAEText
                                  bold={id == current ? true : false}
                                  style={{
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    color:
                                      id === current
                                        ? "#5599ff"
                                        : id < current
                                        ? "#000"
                                        : "#787878",
                                  }}
                                  onClick={() => {
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
                                            pathname:
                                              "/staff-questions-answers/1",
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
                                        : console.log("");
                                    } else {
                                      setOpen(true);
                                      setContent(
                                        `First Complete ${currentObj?.label}`
                                      );
                                    }
                                  }}
                                >
                                  {label}
                                </FAEText>
                              </div>
                            )}
                            {id === current && (
                              <div
                                className={`status-page-status-unit ${
                                  id === current && "current-status-unit"
                                } ${id > current && "after-status-unit"}`}
                                onClick={() =>
                                  isEnable
                                    ? id === 1
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
                                          pathname:
                                            "/staff-questions-answers/1",
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
                                      : ""
                                    : ""
                                }
                              >
                                <div className="status-page-status-unit-icon-and-label">
                                  {/* <AssignmentTurnedInIcon
                      className={`status-page-status-unit-icon ${
                        !isActive && "in-active-unit-icon"
                      }`}
                    /> */}
                                  {id === current && (
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
                                          ? "Apply@2x.png"
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
                                  )}
                                  <div className="text-heading">
                                    <FAEText className="head-text">
                                      {label}
                                    </FAEText>
                                    {id === current && (
                                      <FAEText className="sub-head-text">
                                        {descriptions[id - 1]}
                                      </FAEText>
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
                                  {/* Completed */}
                                </FAEText>
                              </div>
                            )}
                          </TimelineContent>
                        </TimelineItem>

                        {/* {id !== 10 && <hr className="user-status-line" />} */}
                      </div>
                    );
                  })
                )}
              </div>
            </Timeline>
          </div>

          <FAEButton
            className="pointer delete-btn"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete ?")) {
                deleteBusinessStaff({
                  userId,
                  callback: (res) => {
                    if (res.statusCode === 0) {
                      setLoading(true);
                      history.push({
                        pathname: "/your-staff",
                        state: {
                          next: "/user-status",
                          from: "signup",
                        },
                      });
                    } else {
                      alert(res.message);
                      setLoading(false);
                    }
                  },
                });
              }
            }}
          >
            Delete
          </FAEButton>
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
      )}
    </div>
    // <>
    //   {loading && <Loader />}
    //   {!loading && (
    //     <>
    //       <FAEText subHeading bold>
    //         Staff Onboarding
    //       </FAEText>
    //       <div className="status-page-status-units-wrapper">
    //         <div
    //           className="staff-back-btn"
    //           style={{ width: "97%", marginTop: "6px" }}
    //         >
    //           <ArrowBackIcon
    //             color="primary"
    //             fontSize="large"
    //             sx={{ cursor: "pointer" }}
    //             onClick={() =>
    //               history.push({
    //                 pathname: "/your-staff",
    //                 state: {
    //                   next: "/user-status",
    //                   from: "signup",
    //                 },
    //               })
    //             }
    //           />
    //         </div>
    //         {Children.toArray(
    //           statusArray.map((status) => {
    //             const { id, label, isActive, isEnable, isCompleted } = status;
    //             return (
    //               <>
    //                 <div
    //                   className={`status-page-status-unit`}
    //                   onClick={() =>
    //                     isEnable
    //                       ? id === 1
    //                         ? history.push({
    //                             pathname: "/update-profile",
    //                             state: {
    //                               next: history.location.pathname,
    //                               userId,
    //                             },
    //                           })
    //                         : id === 2
    //                         ? history.push({
    //                             pathname: "/your-working-addresses",
    //                             state: {
    //                               next: history.location.pathname,
    //                               userId,
    //                             },
    //                           })
    //                         : id === 3
    //                         ? history.push({
    //                             pathname: "/your-schedule",
    //                             state: {
    //                               next: history.location.pathname,
    //                               userId,
    //                             },
    //                           })
    //                         : id === 4
    //                         ? history.push({
    //                             pathname: "/your-services",
    //                             state: {
    //                               next: history.location.pathname,
    //                               userId,
    //                             },
    //                           })
    //                         : id === 6
    //                         ? history.push({
    //                             pathname: "/staff-questions-answers/1",
    //                             state: {
    //                               next: history.location.pathname,
    //                               userId,
    //                             },
    //                           })
    //                         : ""
    //                       : ""
    //                   }
    //                 >
    //                   <div className="status-page-status-unit-icon-and-label">
    //                     {/* <AssignmentTurnedInIcon
    //                   className={`status-page-status-unit-icon ${
    //                     !isActive && "in-active-unit-icon"
    //                   }`}
    //                 /> */}
    //                     <img
    //                       src={`/onboard/${
    //                         id === 1
    //                           ? "Business Profile@3x.png"
    //                           : id === 2
    //                           ? "Business Address@3x.png"
    //                           : id === 3
    //                           ? "Business Hours@3x.png"
    //                           : id === 4
    //                           ? "Business Services@3x.png"
    //                           : id === 5
    //                           ? "Documents@3x.png"
    //                           : id === 6
    //                           ? "Apply@3x.png"
    //                           : id === 7
    //                           ? "Onboarding Meeting@3x.png"
    //                           : id === 8
    //                           ? "Training@3x.png"
    //                           : id === 9
    //                           ? "Staff@3x.png"
    //                           : id === 10
    //                           ? "Business Approval@3x.png"
    //                           : ""
    //                       }`}
    //                     />
    //                     <FAEText>{label}</FAEText>
    //                   </div>
    //                   <FAEText className="status-page-status-unit-stage">
    //                     {isCompleted ? (
    //                       <img src="/onboard/complete@3x.png" width="20px" />
    //                     ) : (
    //                       // <CheckCircleIcon color="success" />
    //                       // <CancelIcon color="error" />
    //                       ""
    //                     )}
    //                     {/* Completed */}
    //                   </FAEText>
    //                 </div>
    //                 {/* {id !== 10 && <hr className="user-status-line" />} */}
    //               </>
    //             );
    //           })
    //         )}
    //         {!statusArray.some((status) => status.isCompleted === false) && (
    //           <FAEButton>Next</FAEButton>
    //         )}
    //       </div>
    //     </>
    //   )}
    // </>
  );
};

export default UserStatusPage;
