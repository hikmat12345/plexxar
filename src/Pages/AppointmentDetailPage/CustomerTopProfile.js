/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Contexts/userContext";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

//src
import "./Top.scss";
import history from "../../history";
import { getBookingByCustomerId } from "./action";

export default function CustomerTopProfile({ customerId }) {
  const [eventDetail, setEventDetail] = useState([]);
  const [userId, setUserId] = useContext(UserContext);
  useEffect(() => {
    getBookingByCustomerId({
      userId,
      customerId,
      callback: (res) => {
        setEventDetail(res?.getCustomerProfile);
      },
    });
  }, [customerId, userId]);

  return (
    <div className="topProfileParent">
      <div className="topProfile">
        <div className="topProfileSub">
          <div className="TopSection">
            <div className="item">
              <ArrowBackIosIcon
                color="primary"
                className="cursor"
                onClick={() => {
                  history.goBack();
                }}
              />
              <div className="imgDiv">
                <img
                  //   onClick={() =>
                  //     history.push({
                  //       pathname: "/appointment-profile",
                  //       state: eventDetail,
                  //     })
                  //   }
                  src={eventDetail?.customerImagePath ?? "img/default_dp.png"}
                  alt=""
                  width="20"
                />
              </div>

              <div className="text-item">
                <h3>
                  {eventDetail?.customerName}
                  {/* {eventDetail?.lastName} */}
                </h3>
                <span>Account ID : {eventDetail?.accountNumber}</span>
                {/* <span>Booking ID : {bookingId}</span> */}
              </div>
            </div>

            <div className="createBooking">
              <img src="img/icon/create.svg" alt="create" />
              <span>create booking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
