import React from "react";
//src
import "./Top.scss";

export default function TopHead({ bookingDetail }) {
  const { bookingId, providerName } = bookingDetail;
  return (
    <>
      <div className="topheaderParent">
        <div className="topHeader">
          {/* <ArrowBackIosIcon
            color="primary"
            onClick={() => {
              setCookies("initialDate", bookingDate);
              history.push("/user-appointments");
            }}
          /> */}
          <div className="topHeaderLeft">
            <img src="img/icon/profile.svg" alt="profile" />
            <span>{providerName}</span>
          </div>
          <div className="topHeaderRight">
            <img src="img/icon/bookingid.svg" alt="profile" />
            <span>{bookingId}</span>
          </div>
        </div>
      </div>
    </>
  );
}
