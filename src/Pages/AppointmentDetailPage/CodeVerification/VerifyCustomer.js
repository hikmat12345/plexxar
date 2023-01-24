import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FAECodeInput,
  FAEText,
  FAEButton,
  FAETextField,
  FAEShadowBox,
} from "@plexaar/components";
import Loader from "../../Loader";

//src
import {
  CancelBooking,
  SendEditBookingOTP,
  VerifyEditBookingOTP,
} from "../action";
import history from "../../../history";
import "./VerifyCustomer.scss";
import "../AppointmentDetail.scss";
import TopProfile from "../TopProfile";
import TopHead from "../TopHead";
import TopService from "../TopService";
import { setCookies } from "../../../utils";

const VerifyCustomer = () => {
  const location = useLocation();
  const [code, setCode] = useState("");
  const {
    bookingId,
    sessionId,
    bookingDate,
    providerName,
    customerId,
    customerMobile,
    bookingDetail,
  } = location.state;
  const [loading, setLoading] = useState(false);
  const [otpStatus, setOtpStatus] = useState(1);
  const [reason, setReason] = useState("");
  const sendOTP = () => {
    setLoading(true);
    SendEditBookingOTP({
      customerId,
      callback: (res) => {
        if (res.code === 0) {
          setOtpStatus(2);
        } else {
          alert(res.message);
        }
      },
    });
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  useEffect(() => {
    if (code.length === 6) {
      setLoading(true);

      VerifyEditBookingOTP({
        customerId,
        code,
        callback: (res) => {
          setLoading(false);
          res.code !== 0 ? alert(res.message) : setOtpStatus(3);
        },
      });
    }
  }, [code, customerId]);

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    CancelBooking({
      bookingId,
      customerId,
      reason,
      callback: (res) => {
        res.statusCode === 0 ? setOtpStatus(5) : alert(res.message);
      },
    });
  };
  return (
    <div className="code-verify-main">
      <TopProfile location={{ bookingId: bookingId, sessionId: sessionId, bookingDate: bookingDate }} />

      <div
        style={{
          width: "50%",
          margin: "50px auto",
        }}
      >
        <TopHead
          bookingDetail={{
            bookingId: bookingId,
            bookingDate: bookingDate,
            providerName: providerName,
          }}
        />
        {otpStatus > 3 && <TopService bookingDetail={bookingDetail} />}
        <FAEShadowBox primary>
          {loading && <Loader />}
          {!loading &&
            (otpStatus === 1 ? (
              <div className="send-otp-main">
                <FAEText>
                  In order to edit this booking you will need to provide OTP
                  code sent to the customers registered mobile to confirm
                  customers permission to edit booking.
                </FAEText>
                <br />
                <FAEText className="otp-send-to">
                  OTP code will be sent to:
                </FAEText>
                <FAEText className="mobile">
                  {customerMobile.split("-")[0] +
                    " *******" +
                    customerMobile.split("-")[1].slice(-3)}
                </FAEText>
                <br />
                <FAEButton onClick={sendOTP} className="send-otp-btn">
                  Send OTP code
                </FAEButton>
              </div>
            ) : otpStatus === 2 ? (
              <div className="verify-otp-container">
                <FAEText className="verify-head">
                  Please enter OTP code received on customer's mobile
                </FAEText>
                <FAECodeInput getValue={setCode} />
              </div>
            ) : otpStatus === 3 ? (
              <div className="verify-option">
                <FAEText>Would you like to</FAEText>
                <div className="verify-option-btn">
                  <FAEButton
                    onClick={() =>
                      history.push({
                        pathname: "/session-details",
                        state: location.state,
                      })
                    }
                  >
                    Edit the booking
                  </FAEButton>
                  <FAEButton onClick={() => setOtpStatus(4)}>
                    Cancel the booking
                  </FAEButton>
                </div>
              </div>
            ) : otpStatus === 4 ? (
              <div className="cancel-edit">
                <p>Reason of cancellation</p>
                <form
                  className="cancel-edit-form"
                  onSubmit={handleCancelSubmit}
                >
                  <FAETextField
                    value={reason}
                    getValue={(e) => setReason(e)}
                    required
                  />
                  <FAEButton>Cancel Booking</FAEButton>
                </form>
              </div>
            ) : (
              <div className="cancelled">
                <FAEText>
                  As requested your booking has been cancelled. You can find the
                  details of your booking in unscheduled. The job has been moved
                  to unscheduled jobs, you can go anytime to unscheduled jobs
                  and rebook.
                </FAEText>
                <br />
                <FAEText bold>
                  However if you wish to not rebook and would like a refund
                </FAEText>
                <br />
                <FAEText className="cursor" secondary>
                  Generate Gift Vouche
                </FAEText>
                <FAEText className="cursor" secondary>
                  Transfer amount to Wallet
                </FAEText>
                <FAEText
                  onClick={() => {
                    setCookies("initialDate", bookingDate);
                    history.push("/user-appointments");
                  }}
                  className="cursor"
                  secondary
                >
                  Refund amount to customers account
                </FAEText>
              </div>
            ))}
        </FAEShadowBox>
      </div>
    </div>
  );
};
export default VerifyCustomer;
