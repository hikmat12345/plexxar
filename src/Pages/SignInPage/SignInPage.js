//libs
/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import {
  FAETextField,
  FAEButton,
  FAEText,
  FAERadioGroup,
  FAEPhoneInput,
  FAEDialogueBox,
} from "@plexaar/components";

//src
import {
  getFileSrcFromPublicFolder,
  objectIsEmpty,
  setCookies,
  validateInput,
} from "../../utils";
import history from "../../history";
import { signIn, ForgetPassword } from "./actions";
import { UserPermissionsContext } from "../../Contexts/userPermissionsContext";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import { UserContext } from "../../Contexts/userContext";
import PlexaarContainer from "../PlexaarContainer";
import Loader from "../Loader";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

//scss
import "./SignInPage.scss";
import { SocketService } from "../../Services/SocketService";
import { useDispatch } from "react-redux";
import SideNotification from "../MyComponent/SideNotification";
import MobileView from "../TempMobileView/MobileView";

const SignInPage = () => {
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useContext(UserContext);
  const { userCountryId, setUserCountryId } = useContext(CountryDetailContext);
  const { getUserPermissions } = useContext(UserPermissionsContext);
  document.title = "Plexaar | Sign In";
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [loginVia, setLoginVia] = useState("account");
  const [loading, setLoading] = useState(false);
  const [signInFormResponse, setSignInFormResponse] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const [passwordEye, setPasswordEye] = useState(true);
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
  const redirectToStaff = (status, id) => {
    return status < 3
      ? history.push({
          pathname: "/staff-user-status",
          state: {
            userId: id,
          },
        })
      : status === 3
      ? history.push("/user-appointments")
      : "";
  };

  useEffect(() => {
    if (!objectIsEmpty(signInFormResponse)) {
      const signInSuccesful = (customer) => {
        const { id, countryId, isBusiness, authToken } = customer;
        setCookies("userId", id);
        setCookies("customer_details", customer);
        setCookies("countryId", countryId);
        setUserCountryId(countryId);
        setUserId(id);
        SocketService.init(dispatch);
        if (isBusiness) {
          getUserPermissions({
            userId: id,
            callback: (res) => redirectTo(res, id),
          });
        } else {
          setCookies("staffAuth", authToken);
          setCookies("staffDetail", customer);
          getUserPermissions({
            userId: id,
            callback: (res) => redirectToStaff(res, id),
          });
        }
        if (window.initScript) {
          window.initScript(customer);
        }
      };
      const { code, message, result } = signInFormResponse;
      code === 3
        ? history.push({
            pathname: "/verify-account",
            state: { email: result.email, mobile: result.mobile },
          })
        : code !== 0
        ? alert(message)
        : signInSuccesful(result);
      setSignInFormResponse({});
    }
  }, [
    signInFormResponse,
    email,
    account,
    phone,
    setUserId,
    getUserPermissions,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    signIn({
      email,
      account,
      phone,
      password,
      callback: (res) => {
        setSignInFormResponse(res);
        setLoading(false);
      },
    });
  };

  const handleClickShowPassword = () => {
    setPasswordEye(!passwordEye);
    passwordType === "password"
      ? setPasswordType("text")
      : setPasswordType("password");
  };

  if (window.screen.width <= 768) {
    return <MobileView />;
  } else {
    return (
      <div className="sign-in-page-main">
        <SideNotification />
        {loading && <Loader />}
        {!loading && (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="fae--sign-in-page-form-wrapper"
          >
            <img src={getFileSrcFromPublicFolder("/plexaar_logo.png")} />
            <FAERadioGroup
              values={[
                { label: "Account Number", value: "account" },
                { label: "Email", value: "email" },
                { label: "Phone Number", value: "phone" },
              ]}
              value={loginVia}
              getSelectedValue={(e) => {
                setLoginVia(e);
                setPassword("");
                setEmail("");
                setAccount("");
                setPhone("");
              }}
              className="sign-in-login-via"
            />
            {loginVia === "account" ? (
              <FAETextField
                placeholder="Account Number"
                primary
                required
                type="number"
                value={account}
                getValue={setAccount}
                shadowBoxProps={{
                  primary: true,
                }}
              />
            ) : loginVia === "email" ? (
              <FAETextField
                placeholder="Email"
                primary
                required
                type="email"
                value={email}
                getValue={setEmail}
                shadowBoxProps={{
                  primary: true,
                }}
              />
            ) : (
              <FAEPhoneInput
                primary
                required
                value={phone}
                getValue={(value) => setPhone(value)}
                shadowBoxProps={{
                  primary: true,
                }}
              />
            )}
            <FAETextField
              placeholder="Password"
              primary
              required
              value={password}
              type={passwordType}
              getValue={setPassword}
              shadowBoxProps={{
                primary: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {passwordEye ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <FAEText
                onClick={() => setOpen(true)}
                style={{ cursor: "pointer" }}
                secondary
              >
                Forgot Password?
              </FAEText>
            </div>
            <FAEButton className="fae--sign-in-page-form-button">
              Sign In
            </FAEButton>
            <div className="sign-in-page-register-redirection">
              <FAEText tertiary>Don’t have an Account?</FAEText>
              <FAEText
                onClick={() => history.push("/sign-up")}
                bold
                className="pointer"
                secondary
              >
                Register
              </FAEText>
            </div>
          </form>
        )}
        <FAEDialogueBox
          open={open}
          content={
            <>
              <FAEText bold>Please Enter Your Email</FAEText>
              <br />
              <FAETextField
                placeholder="Email"
                value={email}
                type="email"
                getValue={setEmail}
                error={(value) =>
                  value !== "" &&
                  !validateInput(
                    "^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]",
                    value
                  )
                }
                errorMessage="Email is not valid"
              />
            </>
          }
          buttons={[
            {
              label: "Send Code",
              onClick: () => {
                email === ""
                  ? alert("fill email field")
                  : ForgetPassword({
                      email,
                      isReset: true,
                      isVerifyCode: false,
                      isUpdatePassword: false,
                      password: "",
                      resetCode: "",
                      callback: (res) => {
                        res.statusCode === 0
                          ? history.push({
                              pathname: "/code-verification",
                              state: {
                                email: email,
                                activationCode: res.activationCode,
                              },
                            })
                          : alert(res.message);
                      },
                    });
              },
            },
          ]}
        />
      </div>
    );
  }
};

export default SignInPage;
