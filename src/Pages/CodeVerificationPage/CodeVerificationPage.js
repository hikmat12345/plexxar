//libs
/* eslint-disable  */
import React, { useState, useEffect, useContext } from "react";
import { FAECodeInput, FAEText } from "@plexaar/components";
import { useLocation } from "react-router-dom";
import { useTimer } from "react-timer-hook";
//src
import {
  getFileSrcFromPublicFolder,
  objectIsEmpty,
  setCookies,
} from "../../utils";
import history from "../../history";
import { ResendCode, verifyCode } from "./actions";
import Loader from "../Loader";
import PlexaarContainer from "../PlexaarContainer";

//context
import { UserPermissionsContext } from "../../Contexts/userPermissionsContext";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import { UserContext } from "../../Contexts/userContext";

//scss
import "./CodeVerificationPage.scss";
import { FAEButton } from "@plexaar/components/dist/stories/FAEButton/FAEButton";
import { SocketService } from "../../Services/SocketService";
import { useDispatch } from "react-redux";
import SideNotification from "../MyComponent/SideNotification";

const CodeVerificationPage = () => {
  const [smsCode, setSmsCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [verifyCodeResponse, setVerifyCodeResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useContext(UserContext);
  const { userCountryId, setUserCountryId } = useContext(CountryDetailContext);
  const { getUserPermissions } = useContext(UserPermissionsContext);
  const time = new Date();
  const [resend, setResend] = useState(false);
  time.setSeconds(time.getSeconds() + 59);
  const location = useLocation();
  const {
    state: { email, mobile },
  } = location;

  // useEffect(() => {
  //   if (code.length === 6) {
  //     setLoading(true);
  //     verifyCode({
  //       code,
  //       email,
  //       callback: (res) => {
  //         setVerifyCodeResponse(res);
  //         setLoading(false);
  //       },
  //     });
  //   }
  // }, [code, email]);
  const dispatch = useDispatch();
  const redirectTo = (status, id) => {
    return status === 0
      ? history.push({
          pathname: "/update-profile",
          state: { userId: id, next: "/user-status1" },
        })
      : status === 1
      ? history.push("/user-status")
      : status === 2
      ? history.push("/user-status") ///welcome-onboard
      : status === 3
      ? history.push("/user-appointments")
      : "";
  };
  useEffect(() => {
    if (!objectIsEmpty(verifyCodeResponse)) {
      const signInSuccesful = (customer) => {
        const { id, countryId } = customer;
        setCookies("userId", id);
        setCookies("customer_details", customer);
        setCookies("countryId", countryId);
        setUserCountryId(countryId);
        setUserId(id);
        SocketService.init(dispatch);
        getUserPermissions({
          userId: id,
          callback: (res) => redirectTo(res, id),
        });
        if (window.initScript) {
          window.initScript(customer);
        }
      };
      const { code, message, result } = verifyCodeResponse;
      code !== 0 ? alert(message) : signInSuccesful(result);
      setVerifyCodeResponse({});
    }
  }, [verifyCodeResponse]);

  const VerifyCodeAPI = () => {
    setLoading(true);
    verifyCode({
      smsCode,
      emailCode,
      email,
      mobile,
      callback: (res) => {
        setVerifyCodeResponse(res);
        setLoading(false);
      },
    });
  };

  const ResendCodeAPI = () => {
    setLoading(true);
    ResendCode({
      email,
      mobile,
      callback: (res) => {
        if (res.code === 0) {
          alert("code resent to your mobile and email successfully!");
        } else {
          alert(res.message);
        }
      },
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  function MyTimer({ expiryTimestamp }) {
    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({
      expiryTimestamp,
      onExpire: () => console.warn("onExpire called"),
    });

    console.log("se", seconds);
    const setIt = (time) => {
      return time < 10 ? "0" + time : time;
    };
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "15px" }}>
          {seconds == 0 ? (
            <FAEButton
              onClick={() => {
                ResendCodeAPI();
                const time = new Date();
                time.setSeconds(time.getSeconds() + 9);
                restart(time);
                setResend(true);
              }}
             className='resend-code'
            >
              Resend
            </FAEButton>
          ) : (
            <FAEButton>
              <span>{setIt(minutes)}</span>:<span>{setIt(seconds)}</span>
            </FAEButton>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="verify--code-main">
      <SideNotification />
      {loading && <Loader />}
      {!loading && (
        <div className="verify--code-input-wrapper">
          <img src={getFileSrcFromPublicFolder("/plexaar_logo.png")} />
          <FAEText className="verification-text gray-text-color">
            Verification code send to{"  "}
            <span className="black-text-color"> {email}</span>{" "}
          </FAEText>
          <FAECodeInput getValue={setEmailCode} />
          <br />
          <FAEText className="verification-text gray-text-color">
            Verification code send to{" "}
            <span className="black-text-color"> {mobile}</span>{" "}
          </FAEText>
          <FAECodeInput getValue={setSmsCode} />

          <div className="verify-code-btn">
            <MyTimer expiryTimestamp={resend ? time : new Date()} />
            <FAEButton onClick={VerifyCodeAPI}>Verify</FAEButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeVerificationPage;
