//libs
/* eslint-disable */
import React, { useState, useEffect } from "react";
import { FAECodeInput, FAEText } from "@plexaar/components";
import { useLocation } from "react-router-dom";

//src
import { objectIsEmpty } from "../../../utils";
import history from "../../../history";
import { ForgetPassword } from "../actions";
import Loader from "../../Loader";
import PlexaarContainer from "../../PlexaarContainer";

//scss
import "../SignInPage.scss";

const PasswordVerifyCode = () => {
  const [code, setCode] = useState("");
  const [verifyCodeResponse, setVerifyCodeResponse] = useState({});
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const {
    state: { email, activationCode },
  } = location;

  useEffect(() => {
    if (code.length === 6) {
      setLoading(true);
        ForgetPassword({
          email,
          isReset: false,
          isVerifyCode: true,
          isUpdatePassword: false,
          password: "",
          resetCode: code,
          callback: (res) => {
            setVerifyCodeResponse(res);
            setLoading(false);
          },
        });
    }
  }, [code, email]);

  useEffect(() => {
    if (!objectIsEmpty(verifyCodeResponse)) {
      const { statusCode, message } = verifyCodeResponse;
      statusCode !== 0 ? alert(message) : history.push({
        pathname: "/reset-password",
        state: {
          code : code,
          email: email,
        }
      });
      setVerifyCodeResponse({});
    }
  }, [verifyCodeResponse]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="verify--code-input-wrapper">
          <FAEText subHeading bold>
            Verify Account
          </FAEText>
          <FAECodeInput getValue={setCode} />
        </div>
      )}
    </>
  );
};

export default PlexaarContainer(PasswordVerifyCode);
