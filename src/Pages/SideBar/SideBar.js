//libs
import React from "react";
import { FAEText } from "@plexaar/components";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import GroupIcon from "@mui/icons-material/Group";

//src
import history from "../../history";
import { getCookies } from "../../utils";

//scss
import "./SideBar.scss";
import { EmailOutlined } from "@mui/icons-material";

const SideBar = ({ messageCounts = 0 }) => {
  const { isBusiness, id } = getCookies("customer_details");
  return (
    <>
      <div className="side-bar-main-container">
        <FAEText
          onClick={() => history.push("/user-appointments")}
          className="side-bar-each-unit pointer"
        >
          <DateRangeOutlinedIcon /> Bookings
        </FAEText>

        {isBusiness && (
          <FAEText
            onClick={() =>
              history.push({
                pathname: "/your-staff",
                state: { next: history.location.pathname, from: "sidebar" },
              })
            }
            className="side-bar-each-unit pointer"
          >
            <GroupsOutlinedIcon /> Staff
          </FAEText>
        )}
        <FAEText
          onClick={() => history.push("/customer-list")}
          className="side-bar-each-unit pointer"
        >
          <GroupIcon /> Customers
        </FAEText>
        <FAEText
          onClick={() =>
            history.push({
              pathname: "/your-services",
              state: { next: "/your-services", userId: id },
            })
          }
          className="side-bar-each-unit pointer"
        >
          <HandymanOutlinedIcon /> Services
        </FAEText>

        <FAEText
          onClick={() =>
            history.push({
              pathname: "/your-schedule",
              state: { next: "/schedule", userId: id },
            })
          }
          className="side-bar-each-unit pointer"
        >
          <AddBusinessOutlinedIcon /> Schedule
        </FAEText>

        <FAEText className="side-bar-each-unit pointer">
          <BusinessCenterOutlinedIcon /> Admin
        </FAEText>

        <FAEText className="side-bar-each-unit pointer">
          <AttachMoneyRoundedIcon /> Earnings
        </FAEText>
        <FAEText
          onClick={() => history.push("/inbox")}
          className="side-bar-each-unit pointer"
        >
          <EmailOutlined /> Inbox{" "}
          {messageCounts > 0 ? (
            <span className="badge badge-success">{messageCounts}</span>
          ) : (
            ""
          )}
        </FAEText>
      </div>
    </>
  );
};

export default SideBar;
