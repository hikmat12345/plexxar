import React, { useState } from "react";
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
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import { FAEDialogueBox } from "@plexaar/components";

//src
import history from "../../history";
import "./RightSideBar.scss";
const RightSideBar = (props) => {
  const { selectedEvent } = props;
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const handleEdit = () => {
    // console.log("sele", selectedEvent);
    if (selectedEvent.eventId !== 0) {
      history.push({
        pathname: "/appointment-detail",
        state: {
          bookingId: selectedEvent.eventId,
          sessionId: selectedEvent.sessionId,
          customerId: selectedEvent.customerId,
        },
      });
    } else {
      setContent("Please Select Any Event First");
      setOpen(true);
    }
  };
  return (
    <>
      <div className="right-sidebar">
        <div className="right-sidebar-icon" onClick={() => console.log("")}>
          <LibraryBooksOutlinedIcon />
          {/* style={{ fill: '#0072ea' }} for color */}
          <span>Bookings</span>
        </div>
        <div onClick={() => console.log("")}>
          <ContentCopyOutlinedIcon />
          <span>Copy</span>
        </div>
        <div onClick={() => console.log("")}>
          <CropOutlinedIcon />
          <span>Cut</span>
        </div>
        <div onClick={() => console.log("")}>
          <DeleteForeverOutlinedIcon />
          <span>Delete</span>
        </div>
        <div onClick={handleEdit}>
          <EditOutlinedIcon />
          <span>Edit</span>
        </div>
        <div onClick={() => console.log("")}>
          <PrintOutlinedIcon />
          <span>Print</span>
        </div>
        <div onClick={() => console.log("")}>
          <CheckOutlinedIcon />
          <span>Complete</span>
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
