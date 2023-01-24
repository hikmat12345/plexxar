import React, { useState } from "react";
/* eslint-disable no-unused-vars */
// import {
//     ListAltOutlinedIcon,
//     ContentCopyOutlinedIcon,
//     CropOutlinedIcon,
//     DeleteForeverOutlinedIcon,
//     EditOutlinedIcon,
//     PrintOutlinedIcon,
//     CheckOutlinedIcon
// } from "@mui/icons-material"
import CropOutlinedIcon from "@mui/icons-material/CropOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { FAEDialogueBox } from "@plexaar/components";

//src
import history from "../../../history";
import "./RightSideBar.scss";
const RightSideBar = (props) => {
  const { staffId } = props;
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  return (
    <>
      <div className="staff-right-sidebar">
        <div
          className="staff-right-sidebar-icon"
          onClick={() => console.log("")}
        >
          <PermIdentityOutlinedIcon style={{ fill: "#ffffff" }} />
          {/* style={{ fill: '#0072ea' }} for color */}
          <span
            onClick={() =>
              history.push({
                pathname: "/staff-profile",
                state: { staffId: staffId },
              })
            }
          >
            Profile
          </span>
        </div>
        <div
          onClick={() =>
            history.push({
              pathname: "/staff-services",
              state: { staffId: staffId },
            })
          }
        >
          <HandymanOutlinedIcon style={{ fill: "#ffffff" }} />
          <span>Services</span>
        </div>
        <div
          onClick={() =>
            history.push({
              pathname: "/staff-schedule",
              state: { staffId: staffId },
            })
          }
        >
          <AddBusinessOutlinedIcon style={{ fill: "#ffffff" }} />
          <span>Schedule</span>
        </div>
        <div
          onClick={() =>
            history.push({
              pathname: "/staff-working-addresses",
              state: { staffId: staffId },
            })
          }
        >
          <LocationOnOutlinedIcon style={{ fill: "#ffffff" }} />
          <span>Address</span>
        </div>
      </div>

      <FAEDialogueBox
        open={open}
        content={content}
        buttons={[
          {
            label: "Ok",
            onClick: () => {
              setOpen(false);
            },
          },
        ]}
      />
    </>
  );
};
export default RightSideBar;
