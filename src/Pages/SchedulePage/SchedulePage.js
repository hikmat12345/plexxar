//libs
/* eslint-disable */
import {
  FAECheckBoxGroup,
  FAESelect,
  FAEText,
  FAEButton,
} from "@plexaar/components";
import React, { useContext, useEffect, useState } from "react";

//src
import {
  getCookies,
  getFileSrcFromPublicFolder,
  objectIsEmpty,
} from "../../utils";
import { getAvailability, saveAvailability } from "./actions";
import { UserContext } from "../../Contexts/userContext";
import Loader from "../Loader";
import scheduleArray from "./schedule_array.json";
import history from "../../history";
import PlexaarContainer from "../PlexaarContainer";

//scss
import "./SchedulePage.scss";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { staffScheduleArray } from "./scheduleParser";

const SchedulePage = () => {
  const location = useLocation();
  const { userId, next } = location.state;
  const isBusiness =
    next === "/staff-user-status" || next === "/staff-onboard"
      ? false
      : getCookies("customer_details").isBusiness;
  const [loading, setLoading] = useState(true);
  const [availabilityArray, setAvailabilityArray] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDayAndTime, setSelectedDayAndTime] = useState([]);
  const [staffSelectedDayAndTime, setStaffSelectedDayAndTime] = useState([]);
  const [addAvailibilityResponse, setAddAvailibilityResponse] = useState({});
  const [disablearray, setDisableArray] = useState([]);

  useEffect(() => {
    if (!objectIsEmpty(addAvailibilityResponse)) {
      const { code, message } = addAvailibilityResponse;
      if (code !== 0) {
        alert(message);
      } else {
        next === "/staff-user-status" ||
        next === "/user-status" ||
        next === "/staff-onboard"
          ? history.push({
              pathname: next,
              state: { userId },
            })
          : history.push("/user-appointments");
      }
      setAddAvailibilityResponse({});
    }
  }, [addAvailibilityResponse]);

  useEffect(() => {
    getAvailability({
      userId,
      isBusiness,
      callback: (res) => {
        setAvailabilityArray(
          res.map((obj) => {
            return { label: obj.day, value: obj.day, ...obj };
          })
        );
        setAvailableDays(
          res.map((obj) => {
            return obj.isavailable ? obj.day : "";
          })
        );
        // setDisableArray(
        //   res.map((obj) => {
        //     return obj.isbusinessavailable ? false : true;
        //   })
        // );
        setSelectedDayAndTime(
          res.map((obj) => {
            return {
              day: obj.day,
              isavailable: obj.isavailable,
              timefrom: obj.timefrom,
              timeto: obj.timeto,
              businesstimefrom: obj.businesstimefrom,
              businesstimeto: obj.businesstimeto,
            };
          })
        );
        setLoading(false);
      },
    });
  }, [isBusiness, userId]);

  useEffect(() => {
    setSelectedDayAndTime(
      availabilityArray.map((obj) => {
        return {
          day: obj.day,
          isavailable: obj.isavailable,
          timefrom: obj.timefrom,
          timeto: obj.timeto,
          businesstimefrom: obj.businesstimefrom,
          businesstimeto: obj.businesstimeto,
        };
      })
    );
  }, [availabilityArray]);

  useEffect(() => {
    setSelectedDayAndTime(
      selectedDayAndTime.map((obj) => {
        return {
          day: obj.day,
          isavailable: availableDays.some((day) => day === obj.day),
          timefrom: obj.timefrom,
          timeto: obj.timeto,
          businesstimefrom: obj.businesstimefrom,
          businesstimeto: obj.businesstimeto,
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableDays]);

  const updateTime = ({ day, time, action }) => {
    console.log(day, time, action);
    setSelectedDayAndTime(
      selectedDayAndTime.map((obj) =>
        day === obj.day
          ? action === "startTime"
            ? time > obj.timeto
              ? {
                  ...obj,
                  timefrom: time,
                  timeto: scheduleArray.find((obj) => obj.label > time).label,
                }
              : { ...obj, timefrom: time }
            : { ...obj, timeto: time }
          : obj
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    saveAvailability({
      userId,
      selectedDayAndTime,
      isBusiness,
      callback: (res) => {
        setAddAvailibilityResponse(res);
        setLoading(false);
      },
    });
  };
  return (
    <div className="schedule-page-main">
      <div className="schedule-page-inside">
        {/* <img src={getFileSrcFromPublicFolder("/plexaar_logo.png")} /> */}
        <FAEText subHeading bold style={{ marginTop: "15px" }}>
          Your Schedule{" "}
        </FAEText>
        {loading && <Loader />}
        {!loading && (
          <div className="schedule--page-units-wrapper">
            {isBusiness ? (
              <FAECheckBoxGroup
                style={{ color: "#548dff" }}
                values={availabilityArray}
                direction="vertical"
                alreadyCheckedValues={availableDays}
                getSelectedValues={(obj) => setAvailableDays(obj)}
                renderOptions={(obj) => {
                  const { label } = obj;
                  return (
                    <div className="schecdule--page-each-unit">
                      <FAEText style={{ width: "300px", textAlign: "left" }}>
                        {label}
                      </FAEText>
                      {/* <div className="each-unit-inside"> */}
                      <FAESelect
                        values={scheduleArray.filter(
                          (obj) => obj.label < "23:30"
                        )}
                        primary
                        className="schedule--page-select"
                        value={
                          selectedDayAndTime.find((obj) => obj.day === label)
                            .timefrom
                        }
                        getSelectedValue={(value) =>
                          updateTime({
                            day: label,
                            time: value,
                            action: "startTime",
                          })
                        }
                      />
                      -
                      <FAESelect
                        values={scheduleArray.filter(
                          (obj) =>
                            obj.label >
                            selectedDayAndTime.find(
                              (selectedTime) => selectedTime.day === label
                            ).timefrom
                        )}
                        primary
                        className="schedule--page-select"
                        value={
                          selectedDayAndTime.find((obj) => obj.day === label)
                            .timeto
                        }
                        getSelectedValue={(value) =>
                          updateTime({
                            day: label,
                            time: value,
                            action: "endTime",
                          })
                        }
                      />
                      {/* </  div> */}
                    </div>
                  );
                }}
              />
            ) : (
              <FAECheckBoxGroup
                style={{ color: "#548dff" }}
                values={availabilityArray.filter(
                  (ob) => ob.isbusinessavailable
                )}
                direction="vertical"
                alreadyCheckedValues={availableDays}
                getSelectedValues={(obj) => setAvailableDays(obj)}
                //disabled={availabilityArray.map((obj) =>  obj.isbusinessavailable ? false : true  )}
                renderOptions={(obj) => {
                  const { label } = obj;
                  return (
                    <div className="schecdule--page-each-unit">
                      <FAEText style={{ width: "300px", textAlign: "left" }}>
                        {label}
                      </FAEText>
                      <FAESelect
                        values={scheduleArray.filter(
                          (obj) =>
                            (obj.label <=
                              selectedDayAndTime.find(
                                (selectedTime) => selectedTime.day === label
                              ).businesstimeto) &
                            (obj.label >=
                              selectedDayAndTime.find(
                                (selectedTime) => selectedTime.day === label
                              ).businesstimefrom)
                        )}
                        primary
                        className="schedule--page-select"
                        value={
                          selectedDayAndTime.find((obj) => obj.day === label)
                            .timefrom
                        }
                        getSelectedValue={(value) =>
                          updateTime({
                            day: label,
                            time: value,
                            action: "startTime",
                          })
                        }
                      />
                      -
                      <FAESelect
                        values={scheduleArray.filter(
                          (obj) =>
                            obj.label >=
                              selectedDayAndTime.find(
                                (selectedTime) => selectedTime.day === label
                              ).businesstimefrom &&
                            obj.label <=
                              selectedDayAndTime.find(
                                (selectedTime) => selectedTime.day === label
                              ).businesstimeto
                          //replace businesstimeto with timeto for staff
                        )}
                        primary
                        className="schedule--page-select"
                        value={
                          selectedDayAndTime.find((obj) => obj.day === label)
                            .timeto
                        }
                        getSelectedValue={(value) =>
                          updateTime({
                            day: label,
                            time: value,
                            action: "endTime",
                          })
                        }
                      />
                    </div>
                  );
                }}
              />
            )}
            <FAEButton onClick={(e) => handleSubmit(e)}>Save</FAEButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
