//libs
/* eslint-disable */
import React, { createRef, useEffect, useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import scrollGridPlugin from "@fullcalendar/scrollgrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { Tooltip } from "@mui/material";
import {
  FAESelect,
  FAEText,
  FAETextField,
  FAEButton,
  FAEDialogueBox,
} from "@plexaar/components";
import { Modal } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

// Sweet Alert
import swal from "sweetalert";
import moment from "moment";

//src
import {
  getAvailability,
  getGeoLocation,
  getEventByDate,
  GetBreakInfo,
  EditBreakTime,
  DeleteProviderBreak,
  getProvidersDescription,
  getProviders,
  GetSubBusiness,
  SwitchAccount,
} from "./actions";
import { getCookies, removeCookies, setCookies } from "../../utils";
import { UserContext } from "../../Contexts/userContext";
import { getWeekLong, getWeekNumber, getWeekNumberIndex } from "./utils";
import { resourceParser, resourceUnavailablityParser } from "../../parsers";
import ProviderTab from "./ProviderTab";
//scss
import "./UserAppointmentsCalendar.scss";
import history from "../../history";
import RightSideBar from "../RightSideBar/RightSideBar";
import { FAEShadowBox } from "@plexaar/components/dist/stories/FAEShadowBox/FAEShadowBox";

const UserAppointmentsCalendar = () => {
  const [userId, setUserId] = useContext(UserContext);
  const isBusiness = getCookies("customer_details").isBusiness;
  const businessId = getCookies("customer_details").businessId;
  const ProviderId = isBusiness ? parseInt(userId) : businessId;
  const location = useLocation();
  const calendarRef = createRef();
  const [renderDate, setRenderDate] = useState("");
  var initialDate =
    getCookies("initialDate") === "undefined" ||
    getCookies("initialDate") === undefined
      ? new Date().toISOString().substring(0, 10)
      : getCookies("initialDate");
  const [providersList, setProvidersList] = useState([]);
  //const [unavailability, setUnavailability] = useState([]);
  const [resources, setResources] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [modal, setModal] = useState(false);
  const [breakId, setBreakId] = useState("");
  const [breaktime, setBreakTime] = useState("15");
  const [breaktimeTitle, setBreakTimeTitle] = useState("");
  const [breaktimeDescription, setBreakTimeDescription] = useState("");
  const [maxTime, setMaxTime] = useState(60);
  const [slotMinTime, setSlotMinTime] = useState("06:00");
  const [slotMaxTime, setSlotMaxTime] = useState("23:00");
  const [breakInfo, setBreakInfo] = useState([]);
  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [content, setContent] = useState("");
  const [selectedEvent, setSelectedEvent] = useState({
    eventId: 0,
    sessionId: 0,
    customerId: 0,
  });
  const [subBusinesses, setSubBusinesses] = useState([]);
  const weekIndex = [6, 0, 1, 2, 3, 4, 5];
  const dayIndex = [1, 2, 3, 4, 5, 6, 0];
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
    // alert(initialDate);
    initialDate =
      getCookies("initialDate") === "undefined" ||
      getCookies("initialDate") === undefined
        ? new Date().toISOString().substring(0, 10)
        : getCookies("initialDate");

    setTimeout(() => {
      removeCookies("initialDate");
    }, 1000);
  }, [initialDate]);

  useEffect(() => {
    if (isBusiness) {
      GetSubBusiness({
        userId,
        callback: (res) => setSubBusinesses(res),
      });
    }
    getProvidersDescription({
      ProviderId,
      callback: (res) => setSlotMinTime(res.startTime),
    });
  }, [userId]);

  useEffect(() => {
    getProviders({
      ProviderId,
      callback: (res) => {
        let resourcedata = [];
        setProvidersList(res);
        const setToday = new Date(initialDate);
        const today = weekIndex[setToday.getDay()];
        res.map(
          ({
            id,
            firstName,
            lastName,
            email,
            accountNumber,
            imagePath,
            getAvailability,
          }) => {
            isBusiness
              ? getAvailability[today].isavailable &&
                resourcedata.push({
                  id: id,
                  title: `${firstName ?? ""} ${lastName ?? ""}`,
                  email: email,
                  accountNumber: accountNumber,
                  imagePath: imagePath,
                  businessHours: {
                    startTime: getAvailability[today].timefrom,
                    endTime: getAvailability[today].timeto,
                    daysOfWeek: [dayIndex[today]],
                  },
                })
              : id === parseInt(userId) &&
                getAvailability[today].isavailable &&
                resourcedata.push({
                  id: id,
                  title: `${firstName ?? ""} ${lastName ?? ""}`,
                  email: email,
                  accountNumber: accountNumber,
                  imagePath: imagePath,
                  businessHours: {
                    startTime: getAvailability[today].timefrom,
                    endTime: getAvailability[today].timeto,
                    daysOfWeek: [dayIndex[today]],
                  },
                });
          }
        );
        setResources(resourcedata);
      },
    });
  }, [userId]);

  const handleSelect = (e) => {
    if (e.view.type.toLocaleLowerCase() === "daygridmonth") {
      calendarRef.current.getApi().changeView("resourceTimeGridDay", e.dateStr);
    }
  };

  const renderEvent = async (e) => {
    var eventdata = [];
    let resourcedata = [];
    var today = getWeekLong(e.start.toString()?.split(" ")[0]);
    var dayNumber = getWeekNumber(today);
    getAvailability({
      ProviderId,
      isBusiness,
      callback: (res) =>
        res[dayNumber].isavailable &&
        (setSlotMinTime(
          isBusiness ? res[dayNumber].businesstimefrom : res[dayNumber].timefrom
        ),
        setSlotMaxTime(
          isBusiness ? res[dayNumber].businesstimeto : res[dayNumber].timeto
        )),
    });
    if (e.view.type === "resourceTimeGridDay") {
      providersList.map(
        ({
          id,
          firstName,
          lastName,
          email,
          accountNumber,
          imagePath,
          getAvailability,
        }) => {
          isBusiness
            ? getAvailability[dayNumber].isavailable &&
              resourcedata.push({
                id: id,
                title: `${firstName ?? ""} ${lastName ?? ""}`,
                email: email,
                accountNumber: accountNumber,
                imagePath: imagePath,
                businessHours: {
                  startTime: getAvailability[dayNumber].timefrom,
                  endTime: getAvailability[dayNumber].timeto,
                  daysOfWeek: [getWeekNumberIndex(today)],
                },
              })
            : id === parseInt(userId) &&
              getAvailability[dayNumber].isavailable &&
              resourcedata.push({
                id: id,
                title: `${firstName ?? ""} ${lastName ?? ""}`,
                email: email,
                accountNumber: accountNumber,
                imagePath: imagePath,
                businessHours: {
                  startTime: getAvailability[dayNumber].timefrom,
                  endTime: getAvailability[dayNumber].timeto,
                  daysOfWeek: [getWeekNumberIndex(today)],
                },
              });
        }
      );
      setResources(resourcedata);
    } else {
      setResources(resourceParser(providersList));
    }
    var date = e.startStr?.split("T")[0];
    setRenderDate(e.startStr?.split("T")[0]);
    getEventByDate({
      ProviderId,
      date,
      callback: (res) => {
        res.map((obj) =>
          eventdata.push({
            id: obj.id,
            resourceId: parseInt(obj.resourceId),
            title: !obj.isBreak
              ? obj.customerName + "-" + obj.serviceType
              : obj.title,
            description: obj.serviceType,
            start: obj.start,
            end: obj.end,
            color: obj.color,
            sessionId: obj.sessionId,
            customerId: obj.customerId,
            isBreak: obj.isBreak ? 1 : 0,
          })
        );
        setEventList(eventdata);
      },
    });
  };
  const handleEventClick = (e) => {
    var bookingDate = moment(new Date(e.view.currentStart))
      .format()
      .substring(0, 10);
    if (e.event._def.extendedProps.isBreak === 0) {
      if (e.jsEvent.detail === 2) {
        history.push({
          pathname: "/appointment-detail",
          state: {
            bookingId: e.event._def.publicId,
            sessionId: e.event._def.extendedProps.sessionId,
            customerId: e.event._def.extendedProps.customerId,
            bookingDate: bookingDate,
            list: false,
          },
        });
      }
      var selected = document.getElementsByClassName("fc-selected-event");
      if (selected.length !== 0) {
        if (e.event._def.publicId === selectedEvent.eventId) {
          selected[0].classList.remove("fc-selected-event");
          setSelectedEvent({ eventId: 0, sessionId: 0, customerId: 0 });
        } else {
          selected[0].classList.remove("fc-selected-event");
          e.el.classList.add("fc-selected-event");
          setSelectedEvent({
            eventId: e.event._def.publicId,
            sessionId: e.event._def.extendedProps.sessionId,
            customerId: e.event._def.extendedProps.customerId,
          });
        }
      } else {
        setSelectedEvent({
          eventId: e.event._def.publicId,
          sessionId: e.event._def.extendedProps.sessionId,
          customerId: e.event._def.extendedProps.customerId,
        });
        e.el.classList.add("fc-selected-event");
      }
    } else {
      var breakId = e.event._def.publicId;
      setBreakId(breakId);
      GetBreakInfo({
        breakId,
        callback: (res) => {
          setBreakInfo(res);
          setMaxTime(res.availDuration);
          setBreakTimeDescription(res.breakDescription);
          setBreakTimeTitle(res.breakTitle);
          setBreakTime(res.breakDuration);
          setModal(true);
        },
      });
    }
  };
  const handleDeleteBreak = (e) => {
    DeleteProviderBreak({
      breakId,
      callback: (res) => {
        setModal(false);
        setContent(res.message);
        setOpen(true);
      },
    });
  };
  const handleModal = () => {
    if (parseInt(breaktime) > maxTime) {
      setContent("Break time exceed then provider duration");
      setModal(false);
      setOpen(true);
    } else if (parseInt(breaktime) < 15) {
      setContent("Break time can't be less then 15");
      setModal(false);
      setOpen(true);
    } else {
      var breakId = breakInfo.id;
      EditBreakTime({
        breakId,
        breaktime,
        title: breaktimeTitle,
        description: breaktimeDescription,
        callback: (res) => {
          setModal(false);
          setContent(res.message);
          setOpen(true);
        },
      });
    }
  };
  const handleEventResize = (e) => {
    const isBreak = e?.event?._def?.extendedProps?.isBreak;
    const publicId = e?.event?._def?.publicId;

    if (isBreak === 1) {
      // is Break
      const title = e?.event?._def?.title;
      const description = e?.event?._def?.extendedProps?.description;

      const { startStr, endStr } = e?.event;
      const startCon = moment(
        startStr?.split("T")[0] + " " + startStr?.split("T")[1]
      );
      const endCon = moment(
        endStr?.split("T")[0] + " " + endStr?.split("T")[1]
      );

      var differenceInMs = endCon.diff(startCon); // diff yields milliseconds
      var duration = moment.duration(differenceInMs); // moment.duration accepts ms
      var differenceInMinutes = duration.asMinutes();

      swal({
        title: "Are you sure To Increase Time?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("Event Upadtes soon", {
            icon: "success",
          });
          EditBreakTime({
            breakId: parseInt(publicId),
            breaktime: differenceInMinutes,
            description,
            title,
            callback: (res) => {
              if (!res.error) {
                swal(res.message, {
                  icon: "success",
                });
              } else {
                // if error in  api response
                swal(res.message, {
                  icon: "error",
                });
                e.revert();
              }
            },
          });
        } else {
          swal("Your imaginary file is safe!");
          e.revert();
        }
      });
    } else {
      const { startStr, endStr } = e?.event;
      const startCon = moment(
        startStr?.split("T")[0] + " " + startStr?.split("T")[1]
      );
      const endCon = moment(
        endStr?.split("T")[0] + " " + endStr?.split("T")[1]
      );

      var differenceInMs = endCon.diff(startCon); // diff yields milliseconds
      var duration = moment.duration(differenceInMs); // moment.duration accepts ms
      var differenceInMinutes = duration.asMinutes();
      e.revert();
    }
  };
  const switchAccount = (accountswitchid) => {
    SwitchAccount({
      accountswitchid,
      callback: (res) => {
        const { id } = res;
        setCookies("userId", id);
        setCookies("customer_details", res);
        setUserId(id);
        // setCookies("initialDate", initialDate);
        window.location.reload(false);
      },
    });
  };
  return (
    <>
      <FullCalendar
        schedulerLicenseKey="0216257263-fcs-1626084820"
        initialView="resourceTimeGridDay"
        ref={calendarRef}
        plugins={[
          interactionPlugin,
          resourceTimeGridPlugin,
          scrollGridPlugin,
          dayGridPlugin,
        ]}
        dayHeaderContent={(info) => <FAEText>{info.text}</FAEText>}
        slotLabelContent={(info) => <FAEText>{info.text}</FAEText>}
        eventDrop={(e) => {
          e.revert();
        }}
        headerToolbar={{
          left: "dateChange,filter, today",
          center: "prevWeek,prev,title,next,nextWeek",
          //right:"resourceTimelineMonth,resourceTimelineWeek,resourceTimelineDay, resourceTimeGridDay, resourceTimeGridFourDay, dayGridMonth",
          right: "resourceTimeGridDay, resourceTimeGridFourDay, dayGridMonth",
        }}
        customButtons={{
          prevWeek: {
            icon: "fc-icon-chevrons-left",
            text: "Previous Month",
            themeIcon: "seek-prev",
            click: function (e) {
              const current = new Date(
                calendarRef.current._calendarApi.currentDataManager.data.currentDate
              );
              current.setDate(current.getDate() - 7);
              calendarRef.current.getApi().gotoDate(current);
            },
          },
          nextWeek: {
            icon: "fc-icon-chevrons-right",
            text: "Next Week",
            click: function (e) {
              const current = new Date(
                calendarRef.current._calendarApi.currentDataManager.data.currentDate
              );
              current.setDate(current.getDate() + 7);
              calendarRef.current.getApi().gotoDate(current);
            },
          },
          dateChange: {
            text: (
              <>
                <input
                  type="date"
                  className="date-pick"
                  id="clickMe"
                  onChange={(e) =>
                    e.target.value !== ""
                      ? calendarRef.current.getApi().gotoDate(e.target.value)
                      : console.log("clear")
                  }
                />
                <Tooltip title="Go to Date">
                  <DateRangeOutlinedIcon />
                </Tooltip>
              </>
            ),
            click: function (e) {
              document.getElementById("clickMe").showPicker();
            },
          },
          filter: {
            text: (
              <>
                <Tooltip title="Switch MultiBusiness">
                  <FilterAltOutlinedIcon />
                </Tooltip>
              </>
            ),
            click: function (e) {
              setOpenFilter(true);
            },
          },
        }}
        views={{
          resourceTimeGridFourDay: {
            type: "resourceTimeGrid",
            duration: { days: 7 },
            buttonText: "week",
          },
          resourceTimeGridDay: {
            titleFormat: {
              weekday: "long",
              day: "2-digit",
              month: "short",
              year: "numeric",
            },
          },
        }}
        select={async (e) => {
          const {
            resource: { id, title },
            startStr,
          } = e;
          var currentTime;
          await getGeoLocation({
            callback: (res) => {
              currentTime = res;
            },
          });
          var startTime = new Date(startStr);
          startTime =
            startTime.getFullYear() +
            "-" +
            month[startTime.getMonth()] +
            "-" +
            (startTime.getDate() < 10
              ? "0" + startTime.getDate()
              : startTime.getDate()) +
            "T" +
            (startTime.getHours() < 10
              ? "0" + startTime.getHours()
              : startTime.getHours()) +
            ":" +
            (startTime.getMinutes() < 10
              ? "0" + startTime.getMinutes()
              : startTime.getMinutes()) +
            ":" +
            (startTime.getSeconds() < 10
              ? "0" + startTime.getSeconds()
              : startTime.getSeconds());

          if (new Date(startStr).getTime() < new Date(currentTime).getTime()) {
            alert("you can't book Appointment on previous days");
          } else {
            history.push({
              pathname: "/add-client",
              state: {
                providerId: id,
                providerName: title,
                providerEmail: e.resource.extendedProps.email,
                accountNumber: e.resource.extendedProps.accountNumber,
                startStr: startTime,
                startTime: `${startStr?.split("T")[1]?.split(":")[0]}:${
                  startStr?.split("T")[1]?.split(":")[1]
                }`,
                date: startStr?.split("T")[0],
              },
            });
          }
        }}
        initialDate={initialDate}
        datesSet={renderEvent}
        //hiddenDays={unavailability}
        businessHours={true}
        selectable={true}
        resources={resources}
        events={eventList}
        editable={true}
        eventClick={handleEventClick}
        eventResize={(e) => handleEventResize(e)}
        selectConstraint="businessHours"
        eventConstraint="businessHours"
        slotDuration="00:15:00"
        slotMinTime={
          (slotMinTime?.split(":")[1] === "00"
            ? slotMinTime?.split(":")[0] - 1 < 10
              ? "0" + slotMinTime?.split(":")[0] - 1
              : slotMinTime?.split(":")[0] - 1
            : slotMinTime?.split(":")[0]) +
          ":" +
          (slotMinTime?.split(":")[1] === "00" ? "30" : "00")
        }
        slotMaxTime={slotMaxTime}
        dateClick={handleSelect}
        dayMinWidth={200}
        //slotLabelInterval={{hours: 1}}
        //datesAboveResources
        allDaySlot={false}
        eventContent={(info) => {
          return (
            <>
              <div>
                <p>{info.event._def.title?.split("-")[0]}</p>
                {info.event._def.extendedProps.isBreak === 0 && (
                  <p>{info.event._def.extendedProps.description}</p>
                )}
                <p>{info.timeText}</p>
                {/* <p>{info.event._def.title?.split("-")[0]}</p>
            <p>{info.event._def.title?.split("-")[1]}</p> */}
              </div>
            </>
          );
        }}
        resourceLabelContent={(info) => <ProviderTab providerInfo={info} />}
      />

      <Modal
        className="modal-container"
        open={modal}
        onClose={() => {
          setModal(false);
        }}
      >
        <Box className="modal-box">
          <p className="modal-text">Break Time</p>
          <input
            type="number"
            className="modal-input"
            value={breaktime}
            min="15"
            max={maxTime}
            onChange={(e) => setBreakTime(e.target.value)}
          />
          <br />
          <FAESelect
            label="Select Break Time"
            values={[
              {
                label: "15",
                value: "15",
              },
              {
                label: "30",
                value: "30",
              },
              {
                label: "60",
                value: "60",
              },
            ]}
            value={breaktime}
            getSelectedValue={(e) => setBreakTime(e)}
          />
          <FAETextField
            placeholder="Title"
            value={breaktimeTitle}
            getValue={(e) => setBreakTimeTitle(e)}
          />
          <FAETextField
            placeholder="Description"
            value={breaktimeDescription}
            getValue={(e) => setBreakTimeDescription(e)}
          />
          <div className="modal-btn">
            <FAEButton onClick={handleDeleteBreak}>Delete </FAEButton>
            <FAEButton
              onClick={() => {
                setModal(false);
              }}
            >
              Cancel
            </FAEButton>
            <FAEButton onClick={handleModal}>Save</FAEButton>
          </div>
        </Box>
      </Modal>

      <FAEDialogueBox
        open={open}
        content={content}
        buttons={[
          {
            label: "Ok",
            onClick: () => {
              setOpen(false);
              let eventdata = [];
              let date = renderDate;
              getEventByDate({
                ProviderId,
                date,
                callback: (res) => {
                  res.map((obj) =>
                    eventdata.push({
                      id: obj.id,
                      resourceId: parseInt(obj.resourceId),
                      title: !obj.isBreak
                        ? obj.customerName + "-" + obj.serviceType
                        : obj.title,
                      description: obj.serviceType,
                      start: obj.start,
                      end: obj.end,
                      color: obj.color,
                      sessionId: obj.sessionId,
                      isBreak: obj.isBreak ? 1 : 0,
                    })
                  );
                  setEventList(eventdata);
                },
              });
              // window.location.reload(false);
            },
          },
        ]}
      />
      <Modal
        className="filter-modal-container"
        open={openFilter}
        onClose={() => {
          setOpenFilter(false);
        }}
      >
        <Box className="modal-box">
          <p className="modal-text">Switch Business</p>
          <br />
          {subBusinesses.length > 0 &&
            subBusinesses.map((sub) => (
              <>
                <FAEShadowBox primary padding>
                  <FAEText
                    className="sub-business-names"
                    onClick={() => {
                      setOpenFilter(false);
                      switchAccount(sub.accountNumber);
                    }}
                  >
                    {sub.businessName}
                  </FAEText>
                </FAEShadowBox>{" "}
                <br />
              </>
            ))}
        </Box>
      </Modal>
      <RightSideBar selectedEvent={selectedEvent} />
    </>
  );
};

export default UserAppointmentsCalendar;
