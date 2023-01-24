/* eslint-disable*/
import React, { useState } from "react";
import { useLocation } from "react-router";
import history from "../../../history";

import {
  FAEPhoneInput,
  FAECodeInput,
  FAEText,
  FAETextField,
  FAEButton,
} from "@plexaar/components";
import PlexaarContainer from "../../PlexaarContainer";
import { MailOutline, PhoneAndroid, PersonOutline } from "@mui/icons-material";

// csss
import "./CustomerExist.scss";

// import Action
import { VerifyAccount, SendCodeToPhoneEmail, VerifyCode } from "./actions";
import Loader from "../../Loader";
import { getCookies } from "../../../utils";

const CustomerExist = () => {
  const location = useLocation();
  // path Disstructed
  const {
    email,
    phoneNumber,
    previousData,
    customer,
    isfreeConsultation,
    isExpert,
  } = location.state;

  const isEmailverified = customer?.isEmailVerified;
  const isMobileverified = customer?.isMobileVerified;
  const isAccountVerified = true;

  const userId = getCookies("userId");
  const { isBusiness } = getCookies("customer_details");
  const [code, setCode] = useState("");
  const [active, setActive] = useState(
    isAccountVerified === true
      ? "account"
      : isEmailverified === true
      ? "email"
      : isMobileverified != true
      ? "mobile"
      : ""
  );
  const [emailval, setEmail] = useState(customer?.email);
  const [phone, setPhone] = useState(customer?.mobile);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Account Verification Funstion
  const SendVerifyAccount = (e) => {
    e.preventDefault();
    setLoading(true);
    VerifyAccount({
      userId,
      isBusiness,
      account,
      callback: (res) => {
        setLoading(false);
        if (res.code === 4 && res.error) {
          alert(res.message); // Show Return Mesasge
          setAccount(""); // Empty accountValue
        } else {
          // redirect To Path Provider-services
          reidrectToServices();
        }
      },
    });
  };

  const reidrectToServices = () => {
    history.push({
      pathname: "/provider-services",
      state: {
        customerId: customer?.id,
        providerId: previousData?.providerId,
        providerEmail: previousData?.providerEmail,
        providerAccount: previousData?.accountNumber,
        customerAccount: customer?.accountNumber,
        customerEmail: customer?.email,
        customerFirstname: customer?.firstName,
        customerLastname: customer?.lastName,
        startStr: previousData?.startStr,
        startTime: previousData?.startTime,
        isfreeConsultation: isfreeConsultation,
        isExpert: isExpert,
      },
    });
  };

  // Send Verification Code to Phone // Email
  const SendVerificationCode = (e) => {
    e.preventDefault();
    setLoading(true);

    SendCodeToPhoneEmail({
      customerId: customer?.id,
      email: active === "email" ? emailval : "",
      mobile: active === "mobile" ? phone : "",
      isEmail: active === "email" ? true : false,
      callback: (res) => {
        setLoading(false);
        if (res.code === 0 && res.message === "success") {
          active === "email"
            ? alert("Verification Code Sended Check Your Email")
            : alert("Verification Code Sended Check Your Phone");
          setPhone("");
          setEmail("");
          setShowCode(true);
        } else {
          alert(res.message);
        }
        // reidrectToServices();
      },
    });
  };

  // verifying Verification Code
  const VerificationOfCode = (e) => {
    e.preventDefault();
    VerifyCode({
      userId: customer?.id,
      userOTP: code,
      callback: (res) => {
        setLoading(false);
        if (res && res.code === 0) {
          alert("Verification Successful");
          // redirect To Path Provider-services
          VerifyAccount({
            userId,
            isBusiness,
            account: res?.accountNumber,
            callback: (res) => {
              setLoading(false);
              if (res.code === 4 && res.error) {
                alert(res.message); // Show Return Mesasge
              } else {
                // redirect To Path Provider-services
                reidrectToServices();
              }
            },
          });
        } else {
          alert("Invalid Verification Code");
        }
      },
    });
  };
  return (
    <>
      {loading && <Loader />}
      <div className="customer-exist-container">
        {/* Send Verification Code Section */}

        <div className="verification-container">
          <FAEText bold className="verify-heading">
            Verify details below to add Customer
          </FAEText>

          <div className="verif-icon-section">
            <FAEText className="verify-heading-blue">
              Choose Verification Method
            </FAEText>

            <div className="verif-icon-item-section">
              <div
                className={`verif-icon-item ${
                  active === "account" ? "active" : ""
                }`}
                onClick={(e) => {
                  setActive("account");
                }}
              >
                <PersonOutline />
                <FAEText bold className="icon-text">
                  Account No{" "}
                </FAEText>
              </div>

              <div
                className={`verif-icon-item ${
                  active === "email" ? "active" : ""
                }`}
                onClick={(e) => {
                  setActive("email");
                }}
              >
                <MailOutline />
                <FAEText bold className="icon-text">
                  Email{" "}
                </FAEText>
              </div>

              <div
                className={`verif-icon-item ${
                  active === "mobile" ? "active" : ""
                }`}
                onClick={(e) => {
                  setActive("mobile");
                }}
              >
                <PhoneAndroid />
                <FAEText bold className="icon-text">
                  Mobile {}
                </FAEText>
              </div>
            </div>
            {active === "email" && !isEmailverified ? (
              <spna style={{ color: "red", fontSize: "12px" }}>
                Your Email is Not Verirfied
              </spna>
            ) : active === "mobile" && !isMobileverified ? (
              <spna style={{ color: "red", fontSize: "12px" }}>
                Your Mobile is Not Verirfied
              </spna>
            ) : (
              ""
            )}
          </div>

          {/* input fields */}
          <div className="verify-input-section">
            <form>
              {active == "mobile" ? (
                <FAEPhoneInput
                  disabled
                  required
                  value={customer?.mobile}
                  getValue={(value) => setPhone(value)}
                  shadowBoxProps={{
                    primary: true,
                  }}
                />
              ) : active == "email" ? (
                <FAETextField
                  disabled
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={customer?.email}
                  getValue={(value) => setEmail(value)}
                />
              ) : (
                <FAETextField
                  primary
                  type="number"
                  className="form-control"
                  placeholder="Enter Account Number"
                  value={account}
                  getValue={(value) => setAccount(value)}
                />
              )}

              {active == "account" ? (
                // for Varificaion Of Account No
                <FAEButton
                  className="btn-code"
                  onClick={(e) => {
                    SendVerifyAccount(e);
                  }}
                >
                  Verify
                </FAEButton>
              ) : active === "email" && !isEmailverified ? (
                <FAEButton
                  disabled={true}
                  className="btn-code disabled-btn"
                  onClick={(e) => {
                    SendVerificationCode(e);
                  }}
                >
                  Send Code
                </FAEButton>
              ) : active === "mobile" && !isMobileverified ? (
                <FAEButton
                  disabled={true}
                  className="btn-code disabled-btn"
                  onClick={(e) => {
                    SendVerificationCode(e);
                  }}
                >
                  Send Code
                </FAEButton>
              ) : (
                // send verification Code via email Or PhoneNumber
                <FAEButton
                  className="btn-code"
                  onClick={(e) => {
                    SendVerificationCode(e);
                  }}
                >
                  Send Code
                </FAEButton>
              )}
            </form>
          </div>
        </div>

        {active !== "account" && showCode ? (
          <div className="verification-code">
            <FAEText bold className="verify-heading">
              Verify details below to add Customer{" "}
            </FAEText>

            <FAECodeInput getValue={setCode} />
            <FAEButton
              className="btn-code"
              onClick={(e) => {
                VerificationOfCode(e);
              }}
            >
              Verify
            </FAEButton>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default PlexaarContainer(CustomerExist);
