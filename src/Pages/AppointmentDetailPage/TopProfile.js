/* eslint-disable  */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

//src
import "./Top.scss";
import history from "../../history";
import { setCookies } from "../../utils";
import { GetAppointmentDetails } from "./action";

export default function TopProfile(location) {
  const [eventDetail, setEventDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bookingId, sessionId, bookingDate } = location.location;
  console.log(location.location);
  useEffect(() => {
    setLoading(true);
    GetAppointmentDetails({
      bookingId,
      sessionId,
      callback: (res) => {
        setEventDetail(res);
        setLoading(false);
      },
    });
  }, []);

  const conversation = useSelector((state) =>
    state.state.conversations.find(
      (con) => location.state && con.job.jobId == location.state
    )
  );
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
                  setCookies("initialDate", bookingDate);
                  history.push("/user-appointments");
                }}
              />
              <div className="imgDiv">
                <img
                  onClick={() =>
                    history.push({
                      pathname: "/appointment-profile",
                      state: eventDetail,
                    })
                  }
                  src={eventDetail.customerImagePath ?? "img/meeting.png"}
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
