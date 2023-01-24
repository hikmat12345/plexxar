//lib
import React from "react";
import { useLocation } from "react-router";
//src

import BookingDetail from "./Booking/BookingDetail";
import TopProfile from "./TopProfile";
import "./AppointmentDetail.scss";
import CustomerTopProfile from "./CustomerTopProfile";

const AppointmentDetail = () => {
  const location = useLocation();
  const { bookingId, sessionId, customerId, bookingDate, list } =
    location.state;

  return (
    <>
      <>
        <div className="detail">
          {!list && (
            <TopProfile
              location={{
                bookingId: bookingId,
                sessionId: sessionId,
                bookingDate: bookingDate,
              }}
            />
          )}
          {list && <CustomerTopProfile customerId={customerId} />}

          <BookingDetail
            location={{
              bookingId: bookingId,
              sessionId: sessionId,
              customerId: customerId,
              list: list,
            }}
          />
        </div>
      </>
    </>
  );
};

export default AppointmentDetail;
