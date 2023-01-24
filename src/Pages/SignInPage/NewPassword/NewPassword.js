import { FAEText, FAETextField, FAEButton } from "@plexaar/components";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlexaarContainer from "../../PlexaarContainer";

//src
import { ForgetPassword } from "../actions";
import { objectIsEmpty } from "../../../utils";
import Loader from "../../Loader";
import history from "../../../history";

//scss
import "../SignInPage.scss";

const NewPassword = () => {
  const location = useLocation();
  const { email, code } = location.state;
  const [password, setPassword] = useState("");
  const [verifyCodeResponse, setVerifyCodeResponse] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!objectIsEmpty(verifyCodeResponse)) {
      const { statusCode, message } = verifyCodeResponse;
     if( statusCode !== 0){
      alert(message)
     }
     else{
       alert(message)
       history.push("/sign-in");
     }
    }
  }, [verifyCodeResponse]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    password === confirmPassword
      ? ForgetPassword({
          email,
          isReset: false,
          isVerifyCode: false,
          isUpdatePassword: true,
          password: password,
          resetCode: code,
          callback: (res) => {
            setVerifyCodeResponse(res);
            setLoading(false);
          },
        })
      : alert("password did not matched!");
    setLoading(false);
  };
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <FAEText subHeading bold>
            Set New Password
          </FAEText>
          <form className="reset-password">
            <FAETextField
              placeholder="Password"
              primary
              required
              value={password}
              type="password"
              getValue={setPassword}
              shadowBoxProps={{
                primary: true,
              }}
            />
            <FAETextField
              placeholder="Confirm Password"
              primary
              required
              value={confirmPassword}
              type="password"
              getValue={setConfirmPassword}
              shadowBoxProps={{
                primary: true,
              }}
            />
            <FAEButton
              className="fae--sign-in-page-form-button"
              onClick={handleSubmit}
            >
              Save
            </FAEButton>
          </form>
        </>
      )}
    </>
  );
};
export default PlexaarContainer(NewPassword);
