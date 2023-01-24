//libs
/* eslint-disable */
import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FAEText, FAEButton } from "@plexaar/components";

//srcq
import { getBookingByCustomerId } from "./actions";
import Loader from "../Loader";
import { getCookies } from "../../utils";
import history from "../../history";
import { useLocation } from "react-router-dom";
import PlexaarContainer from "../PlexaarContainer";

// style
import "./CustomerBooking.scss";

const CustomerBooking = () => {
  const location = useLocation();
  const { customerId } = location.state;
  const userId = getCookies("userId");
  const [customerBookings, setCustomerBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookingByCustomerId({
      userId,
      customerId,
      callback: (res) => {
        if (res && !res?.error) {
          setCustomerBookings(res?.customerBookingDetails);
          setLoading(false);
        } else {
          // alert("Some Data is Messing");
        }
      },
    });
  }, [userId]);

  // useEffect(() => {
  //   var scrollDiv = window.document.getElementById("Scroll7540");
  //   console.log(scrollDiv);
  //   scrollDiv !== null &&
  //     scrollDiv.scrollIntoView({ block: "start", behavior: "smooth" });
  // }, [loading]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="customer-container-flex">
          {customerBookings.map((booking, i) => (
            <div
              className="customer-container-div"
              id={`Scroll` + booking.bookingId}
            >
              <div className="customer-booking-container">
                <div className="booking-datetime">
                  <FAEText className="booking-date" tertiary>
                    {booking.bookingDate}
                  </FAEText>
                  <div className="booking-datetime-flex">
                    <FAEText className="booking-time">
                      {booking.start.split("T")[1] +
                        " to " +
                        booking.end.split("T")[1]}
                    </FAEText>
                  </div>
                </div>
                <div className="booking-detail">
                  <FAEText className="booking-service">
                    {booking.mainService} <br />
                  </FAEText>
                  <div>
                    <FAEText tertiary>
                      {booking.bookingDuration} Minutes
                    </FAEText>
                    <FAEText>{booking.currencySymbol + booking.price}</FAEText>
                  </div>
                </div>
                <hr />
                <br />

                {booking?.attributes.hasProducts && (
                  <>
                    <div
                      className="booking-products"
                      onClick={() => 
                        history.push({
                          pathname: "/products-detail",
                          state: booking?.attributes?.cartId,
                        })
                      }
                    >
                      <FAEText bold>Products</FAEText>
                      <FAEText className="arrow"> {">"} </FAEText>
                    </div>
                    <hr />
                  </>
                )}

                <div
                  className="booking-notes"
                  onClick={() =>
                    history.push({
                      pathname: "/customer-notes",
                      state: {
                        notes: booking?.customerNotes,
                        bookingId: booking?.bookingId,
                        providerId: booking?.providerId,
                      },
                    })
                  }
                >
                  <FAEText className="booking-notes-text">Notes</FAEText>
                  <FAEText className="arrow"> {">"} </FAEText>
                </div>
                <hr />
                <br />
                <div className="booking-consent-accepted-customer2">
                  <FAEText primary className="consent-btn">
                    Consent Form
                  </FAEText>
                  <FAEText primary>
                    {booking.isConsentAccepted ? "Accepted" : "Not Accepted"}
                  </FAEText>
                </div>
                <FAEButton
                  // onClick={(e) => handleCheckIn(e.target.outerText)}
                  className="booking-check-in"
                >
                  {!booking.hasCheckedIn
                    ? "Check In"
                    : !booking.isJobStarted
                    ? "StartJob"
                    : !booking.isCompleted
                    ? "Complete"
                    : "Job Completed"}
                </FAEButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PlexaarContainer(CustomerBooking);
