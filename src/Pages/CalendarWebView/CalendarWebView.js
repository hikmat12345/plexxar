//libs
/* eslint-disable */
import React, { createRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import scrollGridPlugin from "@fullcalendar/scrollgrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FAEText } from "@plexaar/components";
import moment from "moment";

//src
import {
  getEventByDate,
  getProviderEventByDate,
  getProviders,
  getAvailability,
  getAvailableDuration,
  getBreakTime,
  getProviderDetail,
  getProviderBreakTime,
  getProvidersDescription,
} from "./action";

import ProviderTab from "./ProviderTab";

//scss
import "./CalendarWebView.scss";

const CalendarWebView = () => {
  const calendarRef = createRef();
  const [resources, setResources] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [slotMinTime, setSlotMinTime] = useState("06:00");
  const [slotMaxTime, setSlotMaxTime] = useState("23:00");
  const weekIndex = [6, 0, 1, 2, 3, 4, 5];
  const dayIndex = [1, 2, 3, 4, 5, 6, 0];

  const initialDate = new URLSearchParams(window.location.search).get("date");
  const urlId = new URLSearchParams(window.location.search).get("id");
  const urlIsBusiness = new URLSearchParams(window.location.search).get(
    "isBusiness"
  );
  const urlDate = new URLSearchParams(window.location.search).get("date");
  const urlTimeStamp = new URLSearchParams(window.location.search).get(
    "time_stamp"
  );

  useEffect(() => {
    const setToday = new Date(urlDate);
    const today = weekIndex[setToday.getDay()];
    getAvailability({
      urlId,
      urlIsBusiness,
      callback: (res) =>
        res[today].isavailable &&
        (setSlotMinTime(res[today].timefrom),
        setSlotMaxTime(res[today].timeto)),
      // if(res[today].isavailable) {
      //   var x = res[today].timeto

      //   setSlotMinTime(res[today].timefrom)
      //   setSlotMaxTime(
      //     parseInt(x.split(":")[0]) < 10
      //       ? "0" + (parseInt(x.split(":")[0]) + 1)
      //       : parseInt(x.split(":")[0]) + 1 + ":" + x.split(":")[1]
      //   );
      // }
    });
  }, [urlDate]);

  useEffect(() => {
    var eventdata = [];
    urlIsBusiness === "true"
      ? getProviders({
          urlId,
          callback: (res) => {
            let resourcedata = [];
            const setToday = new Date(urlDate);
            const today = weekIndex[setToday.getDay()]; // use UTC day instead
            res.map(
              ({
                id,
                firstName,
                lastName,
                email,
                isActive,
                accountNumber,
                imagePath,
                getAvailability,
              }) => {
                getAvailability[today].isavailable &&
                  resourcedata.push({
                    id: id,
                    title: firstName, // `${firstName ?? ""} ${lastName ?? ""}`,
                    email: email,
                    isActive,
                    accountNumber: accountNumber,
                    imagePath: imagePath,
                    businessHours: {
                      startTime: getAvailability[today].timefrom,
                      endTime: getAvailability[today].timeto,
                      daysOfWeek: [dayIndex[today]],
                    },
                  });
                // setSlotMinTime(getAvailability[today].timefrom);
                // setSlotMaxTime(getAvailability[today].timeto);
              }
            );
            if (resourcedata.length === 0) {
              var selected = document.getElementsByClassName(
                "fc-timegrid-slot-lane"
              );
              for (let i = 0; i < selected.length; i++) {
                selected[i].style.backgroundColor = "#BFBFBF";
              }
            } else setResources(resourcedata);
          },
        })
      : getProviderDetail({
          urlId,
          callback: (res) => {
            let resourcedata = [];
            const setToday = new Date(urlDate);
            const today = weekIndex[setToday.getDay()];
            res.map(
              ({
                id,
                firstName,
                lastName,
                isActive,
                email,
                accountNumber,
                imagePath,
                getAvailability,
              }) => {
                resourcedata.push({
                  id: urlId,
                  title: `${firstName ?? ""} ${lastName ?? ""}`,
                  email: email,
                  isActive,
                  accountNumber: accountNumber,
                  imagePath: imagePath,
                  businessHours: {
                    startTime: getAvailability[today].isavailable
                      ? getAvailability[today].timefrom
                      : "11:00",
                    endTime: getAvailability[today].isavailable
                      ? getAvailability[today].timeto
                      : "11:00",
                    daysOfWeek: [dayIndex[today]],
                  },
                });
                // setSlotMinTime(getAvailability[today].timefrom);
                // setSlotMaxTime(getAvailability[today].timeto);
              }
            );
            setResources(resourcedata);
          },
        });
    // urlIsBusiness === "true"
    //   ? getBreakTime({
    //       urlId,
    //       callback: (result) => {
    //         result.map((ob) =>
    //           eventdata.push({
    //             id: ob.id,
    //             resourceId: ob.userId,
    //             title: "break",
    //             description: "break...",
    //             start:
    //               ob.unAvailabilityDate.split("T")[0] +
    //               "T" +
    //               ob.timeFrom +
    //               ":00",
    //             end:
    //               ob.unAvailabilityDate.split("T")[0] + "T" + ob.timeTo + ":00",
    //             color: "#cdcdcd",
    //             isBreak: 1,
    //           })
    //         );
    //       },
    //     })
    //   : getProviderBreakTime({
    //       urlId,
    //       callback: (result) => {
    //         result.map((ob) =>
    //           eventdata.push({
    //             id: ob.id,
    //             resourceId: ob.userId,
    //             title: "break",
    //             description: "break...",
    //             start:
    //               ob.unAvailabilityDate.split("T")[0] +
    //               "T" +
    //               ob.timeFrom +
    //               ":00",
    //             end:
    //               ob.unAvailabilityDate.split("T")[0] + "T" + ob.timeTo + ":00",
    //             color: "#cdcdcd",
    //             isBreak: 1,
    //           })
    //         );
    //       },
    //     });

    setTimeout(() => {
      urlIsBusiness === "true"
        ? getEventByDate({
            urlId,
            urlDate,
            callback: (res) => {
              res.map((obj) =>
                eventdata.push({
                  id: obj.id,
                  resourceId: parseInt(obj.resourceId),
                  title: !obj.isBreak
                    ? obj.customerName + " - " + obj.serviceType
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
          })
        : getProviderEventByDate({
            urlId,
            urlDate,
            callback: (res) => {
              res.map((obj) =>
                eventdata.push({
                  id: obj.id,
                  resourceId: parseInt(obj.resourceId),
                  title: !obj.isBreak
                    ? obj.customerName + " - " + obj.serviceType
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
    }, 500);
  }, [urlId]);

  function setSlotInfo(resourceId, title, datetime) {
    var startStr = datetime.substring(0, 19);
    getAvailableDuration({
      resourceId,
      startStr,
      callback: (res) =>
        window.Android.setSlotInfo(
          parseInt(res),
          parseInt(resourceId),
          resources.find((a) => a.id === parseInt(resourceId)).isActive,
          title,
          startStr
        ),
    });
  }

  function setAppointmentInfo(id, resourceId, isBreak, sessionId) {
    window.Android.setAppointmentInfo(
      parseInt(id),
      resources.find((a) => a.id === parseInt(resourceId)).isActive,
      isBreak,
      sessionId
    );
  }

  const handleEventResize = (e) => {
    const isBreak = e?.event?._def?.extendedProps?.isBreak;
    const publicId = e?.event?._def?.publicId;

    const { startStr, endStr } = e?.event;
    const startCon = moment(
      startStr.split("T")[0] + " " + startStr.split("T")[1]
    );
    const endCon = moment(endStr.split("T")[0] + " " + endStr.split("T")[1]);

    var differenceInMs = endCon.diff(startCon); // diff yields milliseconds
    var duration = moment.duration(differenceInMs); // moment.duration accepts ms
    var differenceInMinutes = duration.asMinutes();

    if (isBreak === 1) {
      // is Break
      const title = e?.event?._def?.title;
      const description = e?.event?._def?.extendedProps?.description;
      e.revert();
    } else {
      e.revert();
    }
  };

  return (
    <>
      <FullCalendar
        schedulerLicenseKey="0216257263-fcs-1626084820" //CC-Attribution-NonCommercial-NoDerivatives
        initialView="resourceTimeGridDay"
        initialDate={initialDate}
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
        headerToolbar={false}
        select={(e) => {
          const {
            resource: { id, title },
            startStr,
          } = e;
          setSlotInfo(id, title, startStr);
        }}
        eventClick={(e) => {
          setAppointmentInfo(
            e.event._def.publicId,
            e.event._def.resourceIds[0],
            e.event._def.extendedProps.isBreak,
            e.event._def.extendedProps.sessionId
          );
        }}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        businessHours={true}
        selectable={true}
        resources={resources}
        events={eventList}
        eventResize={(e) => handleEventResize(e)}
        editable={true}
        //expandRows={true}
        longPressDelay="600"
        //resourceAreaWidth="2%"
        //rerenderDelay={1}
        selectLongPressDelay="600"
        eventLongPressDelay="600"
        selectConstraint="businessHours"
        eventConstraint="businessHours"
        slotDuration="00:15:00"
        height="100vh"
        //slotLabelInterval={{hours: 1}}
        slotMinTime={
          // slotMinTime.split(":")[1] === "30"
          // ? (slotMinTime.split(":")[0] + "00")
          // : slotMinTime
          (slotMinTime.split(":")[1] === "00"
            ? slotMinTime.split(":")[0] - 1 < 10
              ? "0" + slotMinTime.split(":")[0] - 1
              : slotMinTime.split(":")[0] - 1
            : slotMinTime.split(":")[0]) +
          ":" +
          (slotMinTime.split(":")[1] === "00" ? "30" : "00")
        }
        slotMaxTime={slotMaxTime}
        dayMinWidth={92}
        //datesAboveResources
        allDaySlot={false}
        eventContent={(info) => {
          return (
            <>
              <div style={{ fontSize: "11px" }}>
                <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {info.event._def.title.split("-")[0]}
                </p>
                {info.event._def.extendedProps.isBreak === 0 && (
                  <p style={{ fontSize: "11px" }}>
                    {info.event._def.extendedProps.description}
                  </p>
                )}
                <p style={{ fontSize: "11px" }}>{info.timeText}</p>
              </div>
            </>
          );
        }}
        resourceLabelContent={(info) => <ProviderTab providerInfo={info} />}
      />
    </>
  );
};

export default CalendarWebView;
