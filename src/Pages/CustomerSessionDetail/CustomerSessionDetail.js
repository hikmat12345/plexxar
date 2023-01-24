/* eslint-disable */
import React, { useState, useEffect, Children } from "react";
import {
  FAEButton,
  FAEDialogueBox,
  FAESelect,
  FAEText,
} from "@plexaar/components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { animateScroll as scroll } from "react-scroll";
import { FormControl, Select, MenuItem } from "@mui/material";
//src
import {
  GetAppointmentDetails,
  GetProviderAvailibility,
  GetAvailableSlots,
  UpdateBooking,
  GetProvidersByClinic,
} from "./action";
import Loader from "../Loader";
import { getWeekNumber } from "../../parsers";
import { getCookies, To12Hours, setCookies } from "../../utils";
import history from "../../history";
//styles
import "./CustomerSessionDetail.scss";
import "react-day-picker/lib/style.css";
import { useLocation } from "react-router-dom";
import { MessageDialogue } from "../Inbox/chat.component";
import TopProfile from "../AppointmentDetailPage/TopProfile";
import TopService from "../AppointmentDetailPage/TopService";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import moment from "moment";

const CustomerSessionDetail = () => {
  const location = useLocation();
  var {
    eventId,
    bookingId,
    sessionId,
    providerId,
    bookingDuration,
    isUpdated,
    mainService,
    bookingDetail,
    providerName,
  } = location.state;
  console.log(location);
  const [sessionsDetails, setSessionsDetails] = useState([]);
  const userId = getCookies("userId");
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [unavailability, setUnavailibility] = useState([]);
  const [availlableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [dateSelected, setDateSelected] = useState(new Date());
  const weekIndex = [0, 1, 2, 3, 4, 5, 6];
  const [isMessageBoxOpen, setisMessageBoxOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [availableProviders, setAvailableProviders] = useState("");
  const [slotLoader, setSlotLoader] = useState(false);
  const month = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  useEffect(() => {
    scroll.scrollTo(300);
    console.log("state", location.state);
    GetAppointmentDetails({
      eventId,
      sessionId,
      callback: (res) => setSessionsDetails(res.sessionsDetails),
    });

    GetProvidersByClinic({
      userId,
      callback: (res) => {
        let data = [];
        res.map((provider) =>
          data.push({
            label: provider.firstName + " " + provider.lastName,
            value: provider.id,
          })
        );
        setProviders(data);
        setSelectedProvider(providerId);
      },
    });
  }, []);

  useEffect(() => {
    if (selectedProvider === 0) {
      setUnavailibility([]);
    } else {
      selectedProvider !== "" &&
        GetProviderAvailibility({
          selectedProvider,
          callback: (res) =>
            setUnavailibility(
              weekIndex.filter(
                (x) =>
                  !res
                    .map((o) => {
                      return getWeekNumber(o);
                    })
                    .includes(x)
              )
            ),
        });
    }
    setAvailableSlots([]);
    setDateSelected(null);
  }, [selectedProvider]);
  const handleClosed = (data) => {
    console.log("handleClosed", data);
    setisMessageBoxOpen(false);
    history.push("/inbox", data.conversationId);
  };
  const handleSession = (date) => {
    setSlotLoader(true);
    var serviceVenu = bookingDetail.inclinic
      ? 2
      : bookingDetail.inhouse
      ? 1
      : 0;
    var CurrentDateTime = new Date();
    CurrentDateTime =
      CurrentDateTime.getFullYear() +
      "-" +
      month[CurrentDateTime.getMonth()] +
      "-" +
      (CurrentDateTime.getDate() < 10
        ? "0" + CurrentDateTime.getDate()
        : CurrentDateTime.getDate()) +
      "T" +
      (CurrentDateTime.getHours() < 10
        ? "0" + CurrentDateTime.getHours()
        : CurrentDateTime.getHours()) +
      ":" +
      (CurrentDateTime.getMinutes() < 10
        ? "0" + CurrentDateTime.getMinutes()
        : CurrentDateTime.getMinutes()) +
      ":" +
      (CurrentDateTime.getSeconds() < 10
        ? "0" + CurrentDateTime.getSeconds()
        : CurrentDateTime.getSeconds());
    setDateSelected(date);
    var Duration = bookingDuration;
    var bookingDate = new Date(date);
    bookingDate = bookingDate =
      bookingDate.getFullYear() +
      "-" +
      month[bookingDate.getMonth()] +
      "-" +
      (bookingDate.getDate() < 10
        ? "0" + bookingDate.getDate()
        : bookingDate.getDate());
    GetAvailableSlots({
      businessId: bookingDetail.businessId,
      bookingDate,
      serviceId: bookingDetail.serviceType,
      serviceVenu,
      Duration,
      CurrentDateTime,
      selectedProvider,
      callback: (res) => {
        if (res.code === 0) {
          setAvailableSlots(res?.timeSlots);
          setSlotLoader(false);
        } else {
          alert(res.message);
        }
        // res.code === 0 ? setAvailableSlots(res?.timeSlots) : alert(res.message);
      },
    });
  };
  const handleSlots = () => {
    var date = moment(dateSelected).format().substring(0, 10);
    var serviceVenu = bookingDetail.inclinic
      ? 2
      : bookingDetail.inhouse
      ? 1
      : 0;
    var startTime = selectedSlot.split("-")[0];
    var endTime = selectedSlot.split("-")[1];
    UpdateBooking({
      bookingId,
      customerId: bookingDetail.customerId,
      date,
      startTime,
      sessionId,
      availableProviders,
      endTime,
      latitude: bookingDetail.latitude,
      longitude: bookingDetail.longitude,
      serviceId: bookingDetail.serviceType,
      serviceVenu,
      duration: bookingDetail.bookingDuration,
      callback: (res) => {
        setContent(res.message);
        setOpen(true);
      },
    });
  };
  const isWeekday = (date) => {
    const day = date.getDay();
    if (unavailability.length === 0) {
      return day !== undefined;
    } else if (unavailability.length == 1) {
      return day !== parseInt(unavailability[0]);
    } else if (unavailability.length == 2) {
      return (
        day !== parseInt(unavailability[0]) &&
        day !== parseInt(unavailability[1])
      );
    } else if (unavailability.length == 3) {
      return (
        day !== parseInt(unavailability[0]) &&
        day !== parseInt(unavailability[1]) &&
        day !== parseInt(unavailability[2])
      );
    } else if (unavailability.length == 4) {
      return (
        day !== parseInt(unavailability[0]) &&
        day !== parseInt(unavailability[1]) &&
        day !== parseInt(unavailability[2]) &&
        day !== parseInt(unavailability[3])
      );
    } else if (unavailability.length == 5) {
      return (
        day !== parseInt(unavailability[0]) &&
        day !== parseInt(unavailability[1]) &&
        day !== parseInt(unavailability[2]) &&
        day !== parseInt(unavailability[3]) &&
        day !== parseInt(unavailability[4])
      );
    } else if (unavailability.length == 6) {
      return (
        day !== parseInt(unavailability[0]) &&
        day !== parseInt(unavailability[1]) &&
        day !== parseInt(unavailability[2]) &&
        day !== parseInt(unavailability[3]) &&
        day !== parseInt(unavailability[4]) &&
        day !== parseInt(unavailability[5])
      );
    }
  };

  return (
    <>
      <div className="sessionDetails">
        <TopProfile
          location={{
            bookingId: bookingId,
            sessionId: sessionId,
            bookingDate: bookingDetail.bookingDate,
          }}
        />
        <div className="session-top">
          <div className="topheaderParent">
            <div className="topHeader">
              <div className="topHeaderLeft">
                <img src="img/icon/profile.svg" alt="profile" />
                <FormControl
                  style={{ width: "150px" }}
                  className="provider-select-dropdown"
                >
                  <Select
                    // label="Provider"
                    variant="standard"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value={0}>
                      <FAEText> All Providers </FAEText>
                    </MenuItem>
                    {Children.toArray(
                      providers.map((valueObj) => {
                        const { value, label } = valueObj;
                        return (
                          <MenuItem value={value}>
                            <FAEText> {label}</FAEText>
                          </MenuItem>
                        );
                      })
                    )}
                  </Select>
                </FormControl>
                {/* <span>{providerName}</span>
                <span style={{ cursor: "pointer" }}>
                  <KeyboardArrowDown />{" "}
                </span> */}
              </div>
              <div className="topHeaderRight">
                <img src="img/icon/bookingid.svg" alt="profile" />
                <span>{bookingId}</span>
              </div>
            </div>
          </div>
          <TopService bookingDetail={bookingDetail} />
        </div>
        <div className="sessionDetailsSub">
          <div className="celendarDiv">
            {/* <FAEButton
              className="primary"
              onClick={() => setisMessageBoxOpen(true)}
            >
              Message
            </FAEButton> */}

            <DatePicker
              selected={dateSelected}
              value={dateSelected}
              onChange={(date) => handleSession(date)}
              minDate={new Date()}
              filterDate={isWeekday}
              inline
            />

            <div className="available-slots">
              <span className="timeText">Select Time</span>
              <ul className="color_design">
                {slotLoader && <Loader />}
                {availlableSlots.length !== 0 &&
                  !slotLoader &&
                  availlableSlots.map((obj, i) => (
                    <li>
                      <input
                        type="radio"
                        // hidden
                        name="availableFrom"
                        id={"radio" + i}
                        value={obj.timeStart + "-" + obj.timeEnd}
                        onChange={(e) => {
                          setSelectedSlot(e.target.value);
                          setAvailableProviders(obj.availableProviders);
                        }}
                      />
                      <label htmlFor={"radio" + i}>
                        {To12Hours(obj.timeStart) +
                          " - " +
                          To12Hours(obj.timeEnd)}
                      </label>
                    </li>
                  ))}
              </ul>
            </div>

            <FAEDialogueBox
              open={open}
              content={content}
              buttons={[
                {
                  label: "Ok",
                  onClick: () => {
                    setCookies(
                      "initialDate",
                      moment(dateSelected).format().substring(0, 10)
                    );
                    setOpen(false);
                    history.push("/user-appointments");
                  },
                },
              ]}
            />
            <FAEDialogueBox
              title="Message"
              open={location.state && isMessageBoxOpen}
              content={
                <MessageDialogue
                  details={{
                    ...location.state,
                    s: true,
                    mainService: mainService,
                  }}
                  onClosed={(d) => handleClosed(d)}
                />
              }
              buttons={[
                {
                  label: "close",
                  onClick: () => setisMessageBoxOpen(false),
                },
              ]}
            />
          </div>
        </div>

        <FAEButton
          className="edit-booking-confirm-btn"
          disabled={selectedSlot.length > 0 ? false : true}
          onClick={handleSlots}
        >
          Confirm Booking
        </FAEButton>
        <br />
      </div>
    </>
  );
};

export default CustomerSessionDetail;
