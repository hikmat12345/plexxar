import React from "react";
import moment from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

//src
import "./Top.scss";

export default function TopService({ bookingDetail }) {
  return (
    <>
      <div className="detailTOpParent">
        <div className="detailTop">
          <div className="serviceDiv">
            <span>
              Service <KeyboardArrowDownIcon />
            </span>
            <h5> {bookingDetail.mainService}</h5>
          </div>

          <div className="service">
            <div className="detailItem">
              <img src="img/icon/celender.svg" alt="celender" />
              <h5>{moment(bookingDetail.bookingDate).format("Do MMM YYYY")}</h5>
            </div>
          </div>

          <div className="service">
            <div className="detailItem">
              <img src="img/icon/time.svg" alt="celender" />
              <h5>
                {bookingDetail.start?.split("T")[1] +
                  " to " +
                  bookingDetail.end?.split("T")[1]}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
