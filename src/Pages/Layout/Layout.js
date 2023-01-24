//libs
import { PlexaarFooter, PlexaarNavBar } from "@plexaar/components";
import React, { Fragment, useContext } from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

//src
import { UserContext } from "../../Contexts/userContext";
import history from "../../history";
import {
  getCookies,
  getFileSrcFromPublicFolder,
  removeCookies,
} from "../../utils";
import { UserPermissionsContext } from "../../Contexts/userPermissionsContext";
import SideBar from "../SideBar/SideBar";
import { useSelector } from "react-redux";
//scss
import "./Layout.scss";
import { FAEText } from "@plexaar/components/dist/stories/FAEText/FAEText";
import { FAEButton } from "@plexaar/components/dist/stories/FAEButton/FAEButton";

const Layout = ({ children }) => {
  const [userId, setUserId] = useContext(UserContext);
  const { screenStatus, setScreenStatus } = useContext(UserPermissionsContext);
  const messageCounts = useSelector(
    (state) =>
      state.state.conversations.length > 0 &&
      state.state.conversations.reduce((c, a) => c + a.counts, 0)
  );
  if (window.location.pathname.substring(0, 17) === "/calendar-webview") {
    return <>{children}</>;
  } else {
    return (
      <>
        {userId && (
          <PlexaarNavBar
            logo={getFileSrcFromPublicFolder("plexaar_logo.png")}
            logoWidth="125px"
            // logoClicked={() => history.push("/user-appointments")}
            style={{ paddingTop: "10px" }}
            signInClicked={() => history.push("/sign-in")}
            dropDownProps={
              userId && {
                label: `Welcome ${getCookies("customer_details").firstName}`,
                icon: <ArrowDropDownIcon />,
                list: [
                  // {
                  //   label: 'Switch Country',
                  //   icon: <SwitchAccountIcon />,
                  //   onClick: () => {history.push("/switch-country")}
                  // },
                  {
                    label: "Logout",
                    icon: <PowerSettingsNewIcon />,
                    onClick: () => {
                      history.push("/");
                      setUserId(null);
                      removeCookies("userId");
                      removeCookies("customer_details");
                      removeCookies("countryId");
                      setScreenStatus(null);
                    },
                  },
                ],
              }
            }
            userLoggedIn={userId && true}
          />
        )}
        <div style={{ minHeight: "92vh", display: "flex" }}>
          {userId && screenStatus >= 2 ? (
            <SideBar messageCounts={messageCounts} />
          ) : (
            ""
          )}
          {children}
        </div>
        <PlexaarFooter />
      </>
    );
  }
};

export default Layout;
