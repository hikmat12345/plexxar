//lib
/* eslint-disable */
import { FAEText, FAEButton } from "@plexaar/components";
import React, { useEffect, useState, useContext } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CallIcon from "@mui/icons-material/Call";
import { FAEDialogueBox } from "@plexaar/components/dist/stories/FAEDialogueBox/FAEDialogueBox";
import moment from "moment";
//src
import {
  GetAppointmentDetails,
  CheckIn,
  JobStart,
  CompleteBooking,
  GetAppointmentHistory,
  GetUpComingBookings,
  getBookingByCustomerId,
} from "../action";
import "./../AppointmentDetail.scss";
import "./BookingDetail.scss";
import { MessageDialogue } from "../../Inbox/chat.component";
import history from "../../../history";
import TopHead from "../TopHead";
import { getCookies, setCookies } from "../../../utils";
import { UserContext } from "../../../Contexts/userContext";
import Loader from "../../Loader";
import ScrollButton from "./ScrollButton";

const BookingDetail = (location) => {
  const { bookingId, sessionId, customerId, list } = location.location;
  const [userId, setUserId] = useContext(UserContext);
  const isBusiness = getCookies("customer_details").isBusiness;
  const businessId = getCookies("customer_details").businessId;
  const ProviderId = parseInt(userId); //isBusiness ? parseInt(userId) : businessId;
  const [bookingDetail, setBookingDetail] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [sessionDetail, setSessionDetail] = useState([]);
  const [currentSession, setCurrentSession] = useState([]);
  const [bookingTime, setBookingTime] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [customerBookings, setCustomerBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isMessageBoxOpen, setisMessageBoxOpen] = useState(false);
  useEffect(() => {
    if (window.runScript) {
      window.runScript();
      console.log("run script");
    }
  }, [bookingHistory, bookingDetail]);

  // useEffect(() => {
  //   GetAppointmentDetails({
  //     bookingId,
  //     sessionId,
  //     callback: (res) => {
  //       setBookingDetail(res);
  //       setSessionDetail(res.sessionsDetails);
  //       setBookingDate(res.bookingDate);
  //       setBookingTime(
  //         res.start?.split("T")[1] + " to " + res.end?.split("T")[1]
  //       );
  //       setCurrentSession(
  //         res.sessionsDetails.find((ob) => {
  //           return ob.isAllocated == true && ob.isCompleted == false;
  //         })
  //       );
  //       // res.sessionsDetails.map((ob) => {
  //       //   var currentSession = res.sessionsDetails[ob.id - 1];
  //       //   if (
  //       //     currentSession.isAllocated == true &&
  //       //     currentSession.isCompleted == false
  //       //   ) {
  //       //     setCurrentSession(currentSession);
  //       //   }
  //       // });
  //     },
  //   });
  // }, []);
  // console.log("cu", currentSession);
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("false");
  //     setLoading(!loading);
  //   }, 500);
  // }, [bookingDetail, bookingHistory, upcomingBookings]);
  useEffect(async () => {
    if (!list) {
      await GetAppointmentHistory({
        bookingId,
        customerId,
        ProviderId,
        isBusiness,
        callback: (res) => setBookingHistory(res),
      });

      await GetUpComingBookings({
        bookingId,
        customerId,
        ProviderId,
        isBusiness,
        callback: (res) => setUpcomingBookings(res),
      });
      await GetAppointmentDetails({
        bookingId,
        sessionId,
        callback: (res) => {
          setBookingDetail(res);
          setSessionDetail(res.sessionsDetails);
          setBookingDate(res.bookingDate);
          setBookingTime(
            res.start?.split("T")[1] + " to " + res.end?.split("T")[1]
          );

          setCurrentSession(
            res.sessionsDetails.find((ob) => {
              return ob?.isAllocated == true && ob?.isCompleted == false;
            })
          );
          // res.sessionsDetails.map((ob) => {
          //   var currentSession = res.sessionsDetails[ob.id - 1];
          //   if (
          //     currentSession.isAllocated == true &&
          //     currentSession.isCompleted == false
          //   ) {
          //     setCurrentSession(currentSession);
          //   }
          // });
        },
      });
      setLoading(false);
      scrollIntoView(bookingId);
    } else {
      getBookingByCustomerId({
        userId,
        customerId,
        callback: (res) => {
          if (res && !res?.error) {
            setCustomerBookings(res?.customerBookingDetails);
            setLoading(false);
          } else {
            setLoading(false);
            // alert("Some Data is Messing");
          }
        },
      });
    }
  }, []);

  const GetAppointment = () => {
    GetAppointmentDetails({
      bookingId,
      sessionId,
      callback: (res) => {
        setBookingDetail(res);
        setSessionDetail(res.sessionsDetails);
        setBookingDate(res.bookingDate);
        setBookingTime(
          res.start?.split("T")[1] + " to " + res.end?.split("T")[1]
        );
      },
    });
  };
  const handleCheckIn = (btn) => {
    var bookingid = parseInt(bookingId);
    var providerId = bookingDetail.providerId;
    var customerId = bookingDetail.customerId + "";
    var sessionId = currentSession?.sessionId;
    var time = new Date().toISOString();
    if (btn === "Check In") {
      CheckIn({
        bookingid,
        providerId,
        sessionId,
        time,
        callback: (res) => {
          res.code === 0 ? GetAppointment() : alert(res.message);
        },
      });
    } else if (btn === "StartJob") {
      JobStart({
        bookingid,
        providerId,
        sessionId,
        time,
        callback: (res) => {
          res.code === 0 ? GetAppointment() : alert(res.message);
        },
      });
    } else {
      CompleteBooking({
        bookingid,
        providerId,
        customerId,
        sessionId,
        callback: (res) => {
          setCookies("initialDate", bookingDate);
          res.statusCode === 0
            ? history.push("/user-appointments")
            : alert(res.message);
        },
      });
    }
  };

  const handleSessionClick = (id) => {
    var selectedSession = sessionDetail[id - 1];
    var prevSession = id === 1 ? selectedSession : sessionDetail[id - 2];
    if (
      selectedSession.isAllocated == false &&
      selectedSession.isCompleted == false
    ) {
      history.push({
        pathname: "/session-details",
        state: {
          customerId: bookingDetail.customerId,
          customerMobile: bookingDetail.customerMobile,
          providerName: bookingDetail.providerName,
          bookingDate: bookingDate,
          eventId: bookingDetail.id,
          customerName: bookingDetail.firstName + " " + bookingDetail.lastName,
          mainService: `${bookingDetail.mainService} - (S${id})`,
          bookingId: selectedSession.bookingId,
          sessionId: selectedSession.sessionId,
          providerId: bookingDetail.providerId,
          bookingDuration: bookingDetail.bookingDuration,
          bookingDetail,
          isUpdated: false,
        },
      });
      // if (
      //   prevSession.isAllocated == false &&
      //   prevSession.isCompleted == false
      // ) {
      //   console.log("Previous session is not allocated.");
      // } else if (
      //   (prevSession.isAllocated == true && prevSession.isCompleted == false) ||
      //   (prevSession.isAllocated == true && prevSession.isCompleted == true)
      // ) {
      //   // console.log("previous session is not completed.");
      //   history.push({
      //     pathname: "/session-details",
      //     state: {
      //       customerId: bookingDetail.customerId,
      //       customerMobile: bookingDetail.customerMobile,
      //       providerName: bookingDetail.providerName,
      //       bookingDate: bookingDate,
      //       eventId: bookingDetail.id,
      //       customerName:
      //         bookingDetail.firstName + " " + bookingDetail.lastName,
      //       mainService: `${bookingDetail.mainService} - (S${id})`,
      //       bookingId: selectedSession.bookingId,
      //       sessionId: selectedSession.sessionId,
      //       providerId: bookingDetail.providerId,
      //       bookingDuration: bookingDetail.bookingDuration,
      //       bookingDetail,
      //       isUpdated: false,
      //     },
      //   });
      // }
      // else if (
      //   prevSession.isAllocated == true &&
      //   prevSession.isCompleted == true
      // ) {
      //   // if (bookingDetail.isExpert) {
      //   //   history.push({
      //   //     pathname: "/verify-customer",
      //   //     state: {
      //   //       customerId: bookingDetail.customerId,
      //   //       customerMobile: bookingDetail.customerMobile,
      //   //       providerName: bookingDetail.providerName,
      //   //       bookingDate: bookingDate,
      //   //       eventId: bookingDetail.id,
      //   //       customerName:
      //   //         bookingDetail.firstName + " " + bookingDetail.lastName,
      //   //       mainService: `${bookingDetail.mainService} - (S${id})`,
      //   //       bookingId: selectedSession.bookingId,
      //   //       sessionId: selectedSession.sessionId,
      //   //       providerId: bookingDetail.providerId,
      //   //       bookingDuration: bookingDetail.bookingDuration,
      //   //       bookingDetail,
      //   //       isUpdated: false,
      //   //     },
      //   //   });
      //   // } else {
      //   history.push({
      //     pathname: "/session-details",
      //     state: {
      //       customerId: bookingDetail.customerId,
      //       customerMobile: bookingDetail.customerMobile,
      //       providerName: bookingDetail.providerName,
      //       bookingDate: bookingDate,
      //       eventId: bookingDetail.id,
      //       customerName:
      //         bookingDetail.firstName + " " + bookingDetail.lastName,
      //       mainService: `${bookingDetail.mainService} - (S${id})`,
      //       bookingId: selectedSession.bookingId,
      //       sessionId: selectedSession.sessionId,
      //       providerId: bookingDetail.providerId,
      //       bookingDuration: bookingDetail.bookingDuration,
      //       bookingDetail,
      //       isUpdated: false,
      //     },
      //   });
      //   // }
      // }
    } else if (
      selectedSession.isAllocated == true &&
      selectedSession.isCompleted == false
    ) {
      history.push({
        pathname: "/verify-customer",
        state: {
          customerId: bookingDetail.customerId,
          customerMobile: bookingDetail.customerMobile,
          providerName: bookingDetail.providerName,
          bookingDate: bookingDate,
          eventId: bookingDetail.id,
          mainService: `${bookingDetail.mainService} - (S${id})`,
          bookingId: selectedSession.bookingId,
          sessionId: selectedSession.sessionId,
          providerId: bookingDetail.providerId,
          bookingDuration: bookingDetail.bookingDuration,
          isUpdated: true,
          customerName: bookingDetail.firstName + " " + bookingDetail.lastName,
          bookingDetail,
        },
      });
      // if (bookingDetail.isExpert) {
      //   history.push({
      //     pathname: "/verify-customer",
      //     state: {
      //       customerId: bookingDetail.customerId,
      //       customerMobile: bookingDetail.customerMobile,
      //       providerName: bookingDetail.providerName,
      //       bookingDate: bookingDate,
      //       eventId: bookingDetail.id,
      //       mainService: `${bookingDetail.mainService} - (S${id})`,
      //       bookingId: selectedSession.bookingId,
      //       sessionId: selectedSession.sessionId,
      //       providerId: bookingDetail.providerId,
      //       bookingDuration: bookingDetail.bookingDuration,
      //       isUpdated: true,
      //       customerName:
      //         bookingDetail.firstName + " " + bookingDetail.lastName,
      //       bookingDetail,
      //     },
      //   });
      // } else {
      //   history.push({
      //     pathname: "/session-details",
      //     state: {
      //       customerId: bookingDetail.customerId,
      //       customerMobile: bookingDetail.customerMobile,
      //       providerName: bookingDetail.providerName,
      //       bookingDate: bookingDate,
      //       eventId: bookingDetail.id,
      //       mainService: `${bookingDetail.mainService} - (S${id})`,
      //       bookingId: selectedSession.bookingId,
      //       sessionId: selectedSession.sessionId,
      //       providerId: bookingDetail.providerId,
      //       bookingDuration: bookingDetail.bookingDuration,
      //       isUpdated: true,
      //       customerName:
      //         bookingDetail.firstName + " " + bookingDetail.lastName,
      //       bookingDetail,
      //     },
      //   });
      // }
    } else if (
      selectedSession.isAllocated == true &&
      selectedSession.isCompleted == true
    ) {
      console.log("session is complete");
    }
  };
  const handleModify = () => {
    history.push({
      pathname: "/verify-customer",
      state: {
        eventId: bookingDetail.id,
        customerId: bookingDetail.customerId,
        providerName: bookingDetail.providerName,
        bookingDate: bookingDate,
        customerMobile: bookingDetail.customerMobile,
        bookingId: currentSession?.bookingId,
        sessionId: currentSession?.sessionId,
        providerId: bookingDetail.providerId,
        bookingDuration: bookingDetail.bookingDuration,
        bookingDetail,
        isUpdated: true,
      },
    });
    // if (bookingDetail.isExpert) {
    //   history.push({
    //     pathname: "/verify-customer",
    //     state: {
    //       eventId: bookingDetail.id,
    //       customerId: bookingDetail.customerId,
    //       providerName: bookingDetail.providerName,
    //       bookingDate: bookingDate,
    //       customerMobile: bookingDetail.customerMobile,
    //       bookingId: currentSession?.bookingId,
    //       sessionId: currentSession?.sessionId,
    //       providerId: bookingDetail.providerId,
    //       bookingDuration: bookingDetail.bookingDuration,
    //       bookingDetail,
    //       isUpdated: true,
    //     },
    //   });
    // } else {
    //   history.push({
    //     pathname: "/session-details",
    //     state: {
    //       eventId: bookingDetail.id,
    //       bookingId: currentSession?.bookingId,
    //       providerName: bookingDetail.providerName,
    //       bookingDate: bookingDate,
    //       customerId: bookingDetail.customerId,
    //       customerMobile: bookingDetail.customerMobile,
    //       sessionId: currentSession?.sessionId,
    //       providerId: bookingDetail.providerId,
    //       bookingDuration: bookingDetail.bookingDuration,
    //       bookingDetail,
    //       isUpdated: true,
    //     },
    //   });
    // }
  };
  const handleClosed = (data) => {
    setisMessageBoxOpen(false);
    history.push("/inbox", data.conversationId);
  };

  const scrollIntoView = (id) => {
    if (!list) {
      var scrollDiv = window.document.getElementById("Scroll" + id);
      console.log("scroll", scrollDiv);
      scrollDiv !== null &&
        scrollDiv.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  const getCurrentSession = (arr) => {
    return arr.find((r) => r.isAllocated == true && r.isCompleted == false);
  };
  return (
    <div className="booking-detail-main">
      {loading && <Loader />}
      {!list &&
        !loading &&
        upcomingBookings.map((detailHistory) => (
          <>
            <div className="subDetail" id={`Scroll` + detailHistory.id}>
              <div className="mainContent">
                <TopHead
                  bookingDetail={{
                    bookingId: detailHistory.id,
                    bookingDate: detailHistory.bookingDate,
                    providerName: detailHistory.providerName,
                  }}
                />
                {/* attributes */}
                <div className="attributeSection">
                  <h6 className="textheader">Service</h6>
                  <h5>{detailHistory?.mainService}</h5>
                  <span>{detailHistory?.serviceTypeName}</span>
                  <KeyboardArrowDownIcon />

                  {detailHistory.hasProducts && (
                    <>
                      <div
                        className="booking-products"
                        onClick={() =>
                          history.push({
                            pathname: "/products-detail",
                            state: detailHistory.cartId,
                          })
                        }
                      >
                        <FAEText bold>Products</FAEText>
                        <FAEText className="arrow"> {">"} </FAEText>
                      </div>
                      <hr />
                    </>
                  )}

                  {/* {detailHistory.hasAttributes && (
          <>
            <div className="booking-notes">
              <FAEText bold>Attributes</FAEText>
              <KeyboardArrowDownIcon
                onClick={() =>
                  history.push({
                    pathname: "/attributes-details",
                    state: {
                      eventId: detailHistory.id,
                      sessionId: sessionId,
                    },
                  })
                }
              />
            </div>
          </>
        )} */}
                </div>

                <div className="detailSection">
                  <div className="detailItem">
                    <img src="img/icon/celender.svg" alt="celender" />
                    <h5>
                      {moment(detailHistory.bookingDate).format("Do MMM YYYY")}
                    </h5>
                  </div>

                  <div className="detailItem">
                    <img src="img/icon/time.svg" alt="time" />
                    <h5>
                      {detailHistory.start?.split("T")[1] +
                        " to " +
                        detailHistory.end?.split("T")[1]}
                    </h5>
                  </div>

                  <div className="detailItem">
                    <img src="img/icon/duration.svg" alt="duration" />
                    <h5>{detailHistory?.bookingDuration} Minutes</h5>
                  </div>

                  <div className="detailItemPaid">
                    {/* <img src="img/icon/price.svg" alt="price" /> */}
                    <h5>
                      {" "}
                      {detailHistory?.currencySymbol + detailHistory?.price}
                    </h5>
                    {detailHistory?.paymentStatus.toLowerCase() === "paid" ? (
                      <img width="60px" height="15px" src="img/paid.png" />
                    ) : (
                      <img width="60px" height="15px" src="img/unpaid.png" />
                    )}
                  </div>
                </div>

                {/* attributes */}
                <div className="attributeSection2">
                  <h6 className="textheader">Service Venue</h6>
                  <h5>
                    {(detailHistory.line1 ? detailHistory.line1 + "," : "") +
                      (detailHistory.townCity
                        ? detailHistory.townCity + ","
                        : "") +
                      (detailHistory.postalCode
                        ? detailHistory.postalCode + ""
                        : "")}
                  </h5>
                </div>

                {/* Session Section */}

                {detailHistory.hasSession && (
                  <div className="sessionSection">
                    <span>Sessions</span>
                    <ul
                      className={
                        detailHistory.sessionsDetails.length > 15 && "large-ul"
                      }
                    >
                      {detailHistory.sessionsDetails.map((session) => (
                        <li
                          key={session.id}
                          className={
                            session.isCompleted && session.isAllocated
                              ? "disabled"
                              : !session.isCompleted && session.isAllocated
                              ? "active"
                              : ""
                          }
                          // onClick={() => scrollIntoView(detailHistory.id)}
                        >
                          {session.id}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* tabs section */}
                <div className="tabSection">
                  <div
                    className="tabItem"
                    onClick={() =>
                      history.push({
                        pathname: "/customer-notes",
                        state: {
                          notes: detailHistory.customerNotes,
                          bookingId: detailHistory.id,
                          providerId: detailHistory.providerId,
                          appDetails: detailHistory,
                        },
                      })
                    }
                  >
                    <img src="img/icon/note.svg" alt="note" />
                    <span>Notes</span>
                  </div>

                  {detailHistory.hasAttributes && (
                    <div
                      className="tabItem"
                      onClick={() =>
                        history.push({
                          pathname: "/attributes-details",
                          state: {
                            eventId: detailHistory.id,
                            sessionId: sessionId,
                          },
                        })
                      }
                    >
                      <img src="img/icon/attribute.svg" alt="attribute" />
                      <span>Attribute</span>
                    </div>
                  )}

                  <div
                    className="tabItem"
                    onClick={(e) => setisMessageBoxOpen(true)}
                  >
                    <img src="img/icon/chat.svg" alt="chat" />
                    <span>Chat</span>
                  </div>

                  <div
                    className={
                      detailHistory.isConsentAccepted
                        ? "tabItem booking-consent-accepted"
                        : "tabItem booking-consent"
                    }
                    onClick={() => {
                      var currSession = getCurrentSession(
                        detailHistory.sessionsDetails
                      );
                      if (currSession !== undefined) {
                        history.push({
                          pathname: "/consent-form",
                          state: {
                            bookingId: currSession.bookingId,
                            sessionId: currSession.sessionId,
                            cartId: detailHistory.cartId,
                            serviceId: detailHistory.serviceType,
                            bookingDetail: detailHistory,
                          },
                        });
                      }
                    }}
                  >
                    <img src="img/icon/concent.svg" alt="profile" />
                    <span>documents</span>
                  </div>
                  {/* {currentSession.isAllocated ? (
                  <div className="tabItem" onClick={handleModify}>
                    <img src="img/icon/modify.svg" alt="note" />
                    <span>Modify</span>
                  </div>
                ) : (
                  ""
                )} */}

                  <div className="tabItem">
                    <img src="img/icon/rebook.svg" alt="rebook" />
                    <span>Rebook</span>
                  </div>

                  {/* <div className="tabItem" onClick={(e) => setisMessageBoxOpen(true)}>
          <img src="img/icon/location.svg" alt="chat" />
          <span>direction</span>
        </div> */}
                </div>

                <FAEDialogueBox
                  title="Message"
                  open={detailHistory && isMessageBoxOpen}
                  content={
                    <MessageDialogue
                      details={{
                        ...detailHistory,
                        bookingId: detailHistory.id,
                      }}
                      onClosed={(d) => handleClosed(d)}
                    />
                  }
                  buttons={[
                    {
                      label: "close",
                      onClick: () => setisMessageBoxOpen(false),
                    },
                  ]}
                />
              </div>
            </div>
          </>
        ))}

      {!list && !loading && (
        <div className="subDetail" id={`Scroll` + bookingId}>
          <div className="mainContent box-shadow">
            <TopHead
              bookingDetail={{
                bookingId: bookingId,
                bookingDate: bookingDate,
                providerName: bookingDetail.providerName,
              }}
            />
            {/* attributes */}
            <div className="attributeSection">
              <h6 className="textheader">Service</h6>
              <h5>{bookingDetail?.mainService}</h5>
              <span>{bookingDetail?.serviceTypeName}</span>
              <KeyboardArrowDownIcon />

              {bookingDetail.hasProducts && (
                <>
                  <div
                    className="booking-products"
                    onClick={() =>
                      history.push({
                        pathname: "/products-detail",
                        state: bookingDetail.cartId,
                      })
                    }
                  >
                    <FAEText bold>Products</FAEText>
                    <FAEText className="arrow"> {">"} </FAEText>
                  </div>
                  <hr />
                </>
              )}

              {/* {bookingDetail.hasAttributes && (
          <>
            <div className="booking-notes">
              <FAEText bold>Attributes</FAEText>
              <KeyboardArrowDownIcon
                onClick={() =>
                  history.push({
                    pathname: "/attributes-details",
                    state: {
                      eventId: bookingDetail.id,
                      sessionId: sessionId,
                    },
                  })
                }
              />
            </div>
          </>
        )} */}
            </div>

            <div className="detailSection">
              <div className="detailItem">
                <img src="img/icon/celender.svg" alt="celender" />
                <h5>{moment(bookingDate).format("Do MMM YYYY")}</h5>
              </div>

              <div className="detailItem">
                <img src="img/icon/time.svg" alt="time" />
                <h5>{bookingTime}</h5>
              </div>

              <div className="detailItem">
                <img src="img/icon/duration.svg" alt="duration" />
                <h5>{bookingDetail?.bookingDuration} Minutes</h5>
              </div>

              <div className="detailItemPaid ">
                {/* <img src="img/icon/price.svg" alt="price" /> */}
                <h5> {bookingDetail?.currencySymbol + bookingDetail?.price}</h5>
                {bookingDetail?.paymentStatus.toLowerCase() === "paid" ? (
                  <img width="60px" height="15px" src="img/paid.png" />
                ) : (
                  <img width="60px" height="15px" src="img/unpaid.png" />
                )}
              </div>
            </div>

            {/* attributes */}
            <div className="attributeSection2">
              <h6 className="textheader">Service Venue</h6>
              <h5>
                {(bookingDetail.line1 ? bookingDetail.line1 + "," : "") +
                  (bookingDetail.townCity ? bookingDetail.townCity + "," : "") +
                  (bookingDetail.postalCode
                    ? bookingDetail.postalCode + ""
                    : "")}
              </h5>
            </div>

            {/* Session Section */}

            {bookingDetail.hasSession && (
              <div className="sessionSection">
                <span>Sessions</span>
                <ul className={sessionDetail.length > 15 && "large-ul"}>
                  {sessionDetail.map((session) => (
                    <li
                      key={session.id}
                      className={
                        session.isCompleted && session.isAllocated
                          ? "disabled"
                          : !session.isCompleted && session.isAllocated
                          ? "active"
                          : ""
                      }
                      onClick={() => handleSessionClick(session.id)}
                    >
                      {session.id}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* tabs section */}
            <div className="tabSection">
              <div
                className="tabItem"
                onClick={() =>
                  history.push({
                    pathname: "/customer-notes",
                    state: {
                      notes: bookingDetail.customerNotes,
                      bookingId: bookingDetail.id,
                      providerId: bookingDetail.providerId,
                      appDetails: bookingDetail,
                    },
                  })
                }
              >
                <img src="img/icon/note.svg" alt="note" />
                <span>Notes</span>
              </div>

              {bookingDetail.hasAttributes && (
                <div
                  className="tabItem"
                  onClick={() =>
                    history.push({
                      pathname: "/attributes-details",
                      state: {
                        eventId: bookingDetail.id,
                        sessionId: sessionId,
                      },
                    })
                  }
                >
                  <img src="img/icon/attribute.svg" alt="attribute" />
                  <span>Attribute</span>
                </div>
              )}

              <div
                className="tabItem"
                onClick={(e) => setisMessageBoxOpen(true)}
              >
                <img src="img/icon/chat.svg" alt="chat" />
                <span>Chat</span>
              </div>
              <div
                className="tabItem fae_call_btn"
                data-fae-id={bookingDetail.customerId}
                data-title={
                  bookingDetail.firstName + " " + bookingDetail.lastName
                }
              >
                <CallIcon sx={{ color: "#548DFF" }} />
                {/* <img src="img/icon/chat.svg" alt="chat" /> */}
                <span>Call</span>
              </div>
              <div
                className={
                  bookingDetail?.isConsentAccepted
                    ? "tabItem booking-consent-accepted"
                    : "tabItem booking-consent"
                }
                onClick={() =>
                  history.push({
                    pathname: "/consent-form",
                    state: {
                      bookingId: bookingId,
                      sessionId: sessionId,
                      cartId: bookingDetail.cartId,
                      serviceId: bookingDetail.serviceType,
                      bookingDetail: bookingDetail,
                    },
                  })
                }
              >
                <img src="img/icon/concent.svg" alt="profile" />
                <span>documents</span>
              </div>
              {currentSession?.isAllocated ? (
                <div
                  className="tabItem"
                  onClick={() =>
                    bookingDetail.hasCheckedIn
                      ? alert("Appointment checked in")
                      : handleModify()
                  }
                >
                  <img src="img/icon/modify.svg" alt="note" />
                  <span>Modify</span>
                </div>
              ) : (
                ""
              )}

              <div className="tabItem">
                <img src="img/icon/rebook.svg" alt="rebook" />
                <span>Rebook</span>
              </div>

              {/* <div className="tabItem" onClick={(e) => setisMessageBoxOpen(true)}>
          <img src="img/icon/location.svg" alt="chat" />
          <span>direction</span>
        </div> */}
            </div>

            <div className="lastSection">
              <FAEButton
                onClick={(e) => handleCheckIn(e.target.outerText)}
                className="detailsButton"
              >
                {!bookingDetail.hasCheckedIn
                  ? "Check In"
                  : !bookingDetail.isJobStarted
                  ? "StartJob"
                  : !bookingDetail.isCompleted
                  ? "Complete"
                  : "Job Completed"}
              </FAEButton>
            </div>

            <FAEDialogueBox
              title="Message"
              open={bookingDetail && isMessageBoxOpen}
              content={
                <MessageDialogue
                  details={{ ...bookingDetail, bookingId: bookingDetail.id }}
                  onClosed={(d) => handleClosed(d)}
                />
              }
              buttons={[
                {
                  label: "close",
                  onClick: () => setisMessageBoxOpen(false),
                },
              ]}
            />
          </div>
        </div>
      )}

      {!list &&
        !loading &&
        bookingHistory.map((detailHistory) => (
          <>
            <div className="subDetail" id={`Scroll` + detailHistory.id}>
              <div className="mainContent">
                <TopHead
                  bookingDetail={{
                    bookingId: detailHistory.id,
                    bookingDate: detailHistory.bookingDate,
                    providerName: detailHistory.providerName,
                  }}
                />
                {/* attributes */}
                <div className="attributeSection">
                  <h6 className="textheader">Service</h6>
                  <h5>{detailHistory?.mainService}</h5>
                  <span>{detailHistory?.serviceTypeName}</span>
                  <KeyboardArrowDownIcon />

                  {detailHistory.hasProducts && (
                    <>
                      <div
                        className="booking-products"
                        onClick={() =>
                          history.push({
                            pathname: "/products-detail",
                            state: detailHistory.cartId,
                          })
                        }
                      >
                        <FAEText bold>Products</FAEText>
                        <FAEText className="arrow"> {">"} </FAEText>
                      </div>
                      <hr />
                    </>
                  )}

                  {/* {detailHistory.hasAttributes && (
          <>
            <div className="booking-notes">
              <FAEText bold>Attributes</FAEText>
              <KeyboardArrowDownIcon
                onClick={() =>
                  history.push({
                    pathname: "/attributes-details",
                    state: {
                      eventId: detailHistory.id,
                      sessionId: sessionId,
                    },
                  })
                }
              />
            </div>
          </>
        )} */}
                </div>

                <div className="detailSection">
                  <div className="detailItem">
                    <img src="img/icon/celender.svg" alt="celender" />
                    <h5>
                      {moment(detailHistory.bookingDate).format("Do MMM YYYY")}
                    </h5>
                  </div>

                  <div className="detailItem">
                    <img src="img/icon/time.svg" alt="time" />
                    <h5>
                      {detailHistory.start?.split("T")[1] +
                        " to " +
                        detailHistory.end?.split("T")[1]}
                    </h5>
                  </div>

                  <div className="detailItem">
                    <img src="img/icon/duration.svg" alt="duration" />
                    <h5>{detailHistory?.bookingDuration} Minutes</h5>
                  </div>

                  <div className="detailItemPaid">
                    {/* <img src="img/icon/price.svg" alt="price" /> */}
                    <h5>
                      {" "}
                      {detailHistory?.currencySymbol + detailHistory?.price}
                    </h5>
                    {detailHistory?.paymentStatus.toLowerCase() === "paid" ? (
                      <img width="60px" height="15px" src="img/paid.png" />
                    ) : (
                      <img width="60px" height="15px" src="img/unpaid.png" />
                    )}
                  </div>
                </div>

                {/* attributes */}
                <div className="attributeSection2">
                  <h6 className="textheader">Service Venue</h6>
                  <h5>
                    {(detailHistory.line1 ? detailHistory.line1 + "," : "") +
                      (detailHistory.townCity
                        ? detailHistory.townCity + ","
                        : "") +
                      (detailHistory.postalCode
                        ? detailHistory.postalCode + ""
                        : "")}
                  </h5>
                </div>

                {/* Session Section */}

                {detailHistory.hasSession && (
                  <div className="sessionSection">
                    <span>Sessions</span>
                    <ul
                      className={
                        detailHistory.sessionsDetails.length > 15 && "large-ul"
                      }
                    >
                      {detailHistory.sessionsDetails.map((session) => (
                        <li
                          key={session.id}
                          className={
                            session.isCompleted && session.isAllocated
                              ? "disabled"
                              : !session.isCompleted && session.isAllocated
                              ? "active"
                              : ""
                          }
                          onClick={() => scrollIntoView(detailHistory.id)}
                        >
                          {session.id}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* tabs section */}
                <div className="tabSection">
                  <div
                    className="tabItem"
                    onClick={() =>
                      history.push({
                        pathname: "/customer-notes",
                        state: {
                          notes: detailHistory.customerNotes,
                          bookingId: detailHistory.id,
                          providerId: detailHistory.providerId,
                          appDetails: detailHistory,
                        },
                      })
                    }
                  >
                    <img src="img/icon/note.svg" alt="note" />
                    <span>Notes</span>
                  </div>

                  {detailHistory.hasAttributes && (
                    <div
                      className="tabItem"
                      onClick={() =>
                        history.push({
                          pathname: "/attributes-details",
                          state: {
                            eventId: detailHistory.id,
                            sessionId: sessionId,
                          },
                        })
                      }
                    >
                      <img src="img/icon/attribute.svg" alt="attribute" />
                      <span>Attribute</span>
                    </div>
                  )}

                  <div
                    className="tabItem"
                    onClick={(e) => setisMessageBoxOpen(true)}
                  >
                    <img src="img/icon/chat.svg" alt="chat" />
                    <span>Chat</span>
                  </div>

                  <div
                    className={
                      detailHistory.isConsentAccepted
                        ? "tabItem booking-consent-accepted"
                        : "tabItem booking-consent"
                    }
                    onClick={() =>
                      history.push({
                        pathname: "/consent-form",
                        state: {
                          bookingId: bookingId,
                          sessionId: sessionId,
                          cartId: detailHistory.cartId,
                          serviceId: detailHistory.serviceType,
                          bookingDetail: detailHistory,
                        },
                      })
                    }
                  >
                    <img src="img/icon/concent.svg" alt="profile" />
                    <span>documents</span>
                  </div>
                  {/* {currentSession.isAllocated ? (
                  <div className="tabItem" onClick={handleModify}>
                    <img src="img/icon/modify.svg" alt="note" />
                    <span>Modify</span>
                  </div>
                ) : (
                  ""
                )} */}

                  <div className="tabItem">
                    <img src="img/icon/rebook.svg" alt="rebook" />
                    <span>Rebook</span>
                  </div>

                  {/* <div className="tabItem" onClick={(e) => setisMessageBoxOpen(true)}>
          <img src="img/icon/location.svg" alt="chat" />
          <span>direction</span>
        </div> */}
                </div>

                <FAEDialogueBox
                  title="Message"
                  open={detailHistory && isMessageBoxOpen}
                  content={
                    <MessageDialogue
                      details={{
                        ...detailHistory,
                        bookingId: detailHistory.id,
                      }}
                      onClosed={(d) => handleClosed(d)}
                    />
                  }
                  buttons={[
                    {
                      label: "close",
                      onClick: () => setisMessageBoxOpen(false),
                    },
                  ]}
                />
              </div>
            </div>
          </>
        ))}

      {list &&
        !loading &&
        customerBookings.map((detailHistory) => (
          <>
            <div className="subDetail" id={`Scroll` + detailHistory.id}>
              <div className="mainContent">
                <TopHead
                  bookingDetail={{
                    bookingId: detailHistory.id,
                    bookingDate: detailHistory.bookingDate,
                    providerName: detailHistory.providerName,
                  }}
                />
                {/* attributes */}
                <div className="attributeSection">
                  <h6 className="textheader">Service</h6>
                  <h5>{detailHistory?.mainService}</h5>
                  <span>{detailHistory?.serviceTypeName}</span>
                  <KeyboardArrowDownIcon />

                  {detailHistory.hasProducts && (
                    <>
                      <div
                        className="booking-products"
                        onClick={() =>
                          history.push({
                            pathname: "/products-detail",
                            state: detailHistory.cartId,
                          })
                        }
                      >
                        <FAEText bold>Products</FAEText>
                        <FAEText className="arrow"> {">"} </FAEText>
                      </div>
                      <hr />
                    </>
                  )}

                  {/* {detailHistory.hasAttributes && (
          <>
            <div className="booking-notes">
              <FAEText bold>Attributes</FAEText>
              <KeyboardArrowDownIcon
                onClick={() =>
                  history.push({
                    pathname: "/attributes-details",
                    state: {
                      eventId: detailHistory.id,
                      sessionId: sessionId,
                    },
                  })
                }
              />
            </div>
          </>
        )} */}
                </div>

                <div className="detailSection">
                  <div className="detailItem">
                    <img src="img/icon/celender.svg" alt="celender" />
                    <h5>
                      {moment(detailHistory.bookingDate).format("Do MMM YYYY")}
                    </h5>
                  </div>

                  <div className="detailItem">
                    <img src="img/icon/time.svg" alt="time" />
                    <h5>
                      {detailHistory.start?.split("T")[1] +
                        " to " +
                        detailHistory.end?.split("T")[1]}
                    </h5>
                  </div>

                  <div className="detailItem">
                    <img src="img/icon/duration.svg" alt="duration" />
                    <h5>{detailHistory?.bookingDuration} Minutes</h5>
                  </div>

                  <div className="detailItem">
                    <img src="img/icon/price.svg" alt="price" />
                    <h5>
                      {" "}
                      {detailHistory?.currencySymbol + detailHistory?.price}
                    </h5>
                  </div>
                </div>

                {/* attributes */}
                <div className="attributeSection2">
                  <h6 className="textheader">Service Venue</h6>
                  <h5>
                    {(detailHistory.line1 ? detailHistory.line1 + "," : "") +
                      (detailHistory.townCity
                        ? detailHistory.townCity + ","
                        : "") +
                      (detailHistory.postalCode
                        ? detailHistory.postalCode + ""
                        : "")}
                  </h5>
                </div>

                {/* Session Section */}

                {detailHistory.hasSession && (
                  <div className="sessionSection">
                    <span>Sessions</span>
                    <ul
                      className={
                        detailHistory.sessionsDetails.length > 15 && "large-ul"
                      }
                    >
                      {detailHistory.sessionsDetails.map((session) => (
                        <li
                          key={session.id}
                          className={
                            session.isCompleted && session.isAllocated
                              ? "disabled"
                              : !session.isCompleted && session.isAllocated
                              ? "active"
                              : ""
                          }
                          onClick={() => scrollIntoView(detailHistory.id)}
                        >
                          {session.id}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* tabs section */}
                <div className="tabSection">
                  <div
                    className="tabItem"
                    onClick={() =>
                      history.push({
                        pathname: "/customer-notes",
                        state: {
                          notes: detailHistory.customerNotes,
                          bookingId: detailHistory.id,
                          providerId: detailHistory.providerId,
                          appDetails: detailHistory,
                        },
                      })
                    }
                  >
                    <img src="img/icon/note.svg" alt="note" />
                    <span>Notes</span>
                  </div>
                  {detailHistory.hasAttributes && (
                    <div
                      className="tabItem"
                      onClick={() =>
                        history.push({
                          pathname: "/attributes-details",
                          state: {
                            eventId: detailHistory.id,
                            sessionId: sessionId,
                          },
                        })
                      }
                    >
                      <img src="img/icon/attribute.svg" alt="attribute" />
                      <span>Attribute</span>
                    </div>
                  )}
                  <div
                    className="tabItem"
                    onClick={(e) => setisMessageBoxOpen(true)}
                  >
                    <img src="img/icon/chat.svg" alt="chat" />
                    <span>Chat</span>
                  </div>
                  <div
                    className="tabItem fae_call_btn"
                    data-fae-id={bookingDetail.customerId}
                    data-title={
                      bookingDetail.firstName + " " + bookingDetail.lastName
                    }
                  >
                    <img src="img/icon/chat.svg" alt="chat" />
                    <span>Call</span>
                  </div>

                  <div
                    className="tabItem"
                    onClick={(e) => setisMessageBoxOpen(true)}
                  >
                    <img src="img/icon/chat.svg" alt="chat" />
                    <span>Chat</span>
                  </div>

                  <div
                    className={
                      detailHistory.isConsentAccepted
                        ? "tabItem booking-consent-accepted"
                        : "tabItem booking-consent"
                    }
                    onClick={() =>
                      history.push({
                        pathname: "/consent-form",
                        state: {
                          bookingId: bookingId,
                          sessionId: sessionId,
                          cartId: detailHistory.cartId,
                          serviceId: detailHistory.serviceType,
                          bookingDetail: detailHistory,
                        },
                      })
                    }
                  >
                    <img src="img/icon/concent.svg" alt="profile" />
                    <span>documents</span>
                  </div>
                  {/* {currentSession.isAllocated ? (
                  <div className="tabItem" onClick={handleModify}>
                    <img src="img/icon/modify.svg" alt="note" />
                    <span>Modify</span>
                  </div>
                ) : (
                  ""
                )} */}

                  <div className="tabItem">
                    <img src="img/icon/rebook.svg" alt="rebook" />
                    <span>Rebook</span>
                  </div>

                  {/* <div className="tabItem" onClick={(e) => setisMessageBoxOpen(true)}>
          <img src="img/icon/location.svg" alt="chat" />
          <span>direction</span>
        </div> */}
                </div>

                <FAEDialogueBox
                  title="Message"
                  open={detailHistory && isMessageBoxOpen}
                  content={
                    <MessageDialogue
                      details={{
                        ...detailHistory,
                        bookingId: detailHistory.id,
                      }}
                      onClosed={(d) => handleClosed(d)}
                    />
                  }
                  buttons={[
                    {
                      label: "close",
                      onClick: () => setisMessageBoxOpen(false),
                    },
                  ]}
                />
              </div>
            </div>
          </>
        ))}
      {!loading &&
        customerBookings.length === 0 &&
        bookingDetail.length === 0 &&
        bookingHistory.length === 0 &&
        upcomingBookings.length === 0 && (
          <FAEText
            style={{
              fontSize: "17px",
              textAlign: "center",
              marginTop: "15%",
              color: "#787878",
            }}
          >
            No Record Found
          </FAEText>
        )}
      <ScrollButton />
    </div>
  );
};

export default BookingDetail;
