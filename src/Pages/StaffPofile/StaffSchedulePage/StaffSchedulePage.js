//libs
/* eslint-disable no-unused-vars */
import {
  FAECheckBoxGroup,
  FAESelect,
  FAEText,
  FAEButton,
} from "@plexaar/components";
import React, { useContext, useEffect, useState } from "react";

//src
import { getCookies, objectIsEmpty } from "../../../utils";
import { getAvailability, saveAvailability } from "./actions";
import { UserContext } from "../../../Contexts/userContext";
import Loader from "../../Loader";
import scheduleArray from "./schedule_array.json";
import history from "../../../history";
import PlexaarContainer from "../../PlexaarContainer";
import { useLocation } from "react-router-dom";

//scss
import "./StaffSchedulePage.scss";

const StaffSchedulePage = () => {
  const location = useLocation();
  const { staffId } = location.state;
  const [userId] = useContext(UserContext);
  const isBusiness = false;
  const [loading, setLoading] = useState(true);
  const [availabilityArray, setAvailabilityArray] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDayAndTime, setSelectedDayAndTime] = useState([]);
  const [selectedBusinessDayAndTime, setSelectedBusinessDayAndTime] = useState(
    []
  );
  const [addAvailibilityResponse, setAddAvailibilityResponse] = useState({});
  const [disablearray, setDisableArray] = useState([]);

  useEffect(() => {
    if (!objectIsEmpty(addAvailibilityResponse)) {
      const { code, message } = addAvailibilityResponse;
      if (code !== 0) {
        alert(message);
      } else {
        // history.push('/your-staff')
      }
      setAddAvailibilityResponse({});
    }
  }, [addAvailibilityResponse]);

  useEffect(() => {
    getAvailability({
      staffId,
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
        setDisableArray(
          res.map((obj) => {
            return obj.isbusinessavailable ? false : true;
          })
        );
        setSelectedDayAndTime(
          res.map((obj) => {
            return {
              day: obj.day,
              isavailable: obj.isavailable,
              timefrom: obj.timefrom,
              timeto: obj.timeto,
            };
          })
        );
        // setselected bussiness time for showing business timeto and from,in values of select
        setSelectedBusinessDayAndTime(
          res.map((obj) => {
            return {
              day: obj.day,
              isavailable: obj.isavailable,
              timefrom: obj.businesstimefrom,
              timeto: obj.businesstimeto,
            };
          })
        );
        setLoading(false);
      },
    });
  }, [isBusiness, staffId]);

  useEffect(() => {
    setSelectedDayAndTime(
      availabilityArray.map((obj) => {
        return {
          day: obj.day,
          isavailable: obj.isavailable,
          timefrom: obj.timefrom,
          timeto: obj.timeto,
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
      staffId,
      selectedDayAndTime,
      callback: (res) => {
        setAddAvailibilityResponse(res);
        setLoading(false);
      },
    });
  };
  return (
    <>
      <FAEText subHeading bold>
        Your Schedule{" "}
      </FAEText>
      {loading && <Loader />}
      {!loading && (
        <div className="schedule--page-units-wrapper">
          {/* {getCookies("customer_details").isBusiness ?
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
                  <FAEText style={{ width: "300px" }}>{label}</FAEText>
                  <FAESelect
                    values={scheduleArray.filter((obj) => obj.label < "22:30")}
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
                  to
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
                      selectedDayAndTime.find((obj) => obj.day === label).timeto
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
          : */}
          <FAECheckBoxGroup
            style={{ color: "#548dff" }}
            values={availabilityArray.filter((ob) => ob.isbusinessavailable)}
            direction="vertical"
            alreadyCheckedValues={availableDays}
            getSelectedValues={(obj) => setAvailableDays(obj)}
            //disabled={disablearray[getCount(count)] }
            //disabled={availabilityArray.map((obj) =>  obj.isbusinessavailable ? false : true  )}
            renderOptions={(obj) => {
              const { label } = obj;
              return (
                <div className="schecdule--page-each-unit">
                  <FAEText style={{ width: "300px" }}>{label}</FAEText>
                  <FAESelect
                    values={scheduleArray.filter(
                      (obj) =>
                        (obj.label <=
                          selectedDayAndTime.find(
                            (selectedTime) => selectedTime.day === label
                          ).timeto) &
                        (obj.label >=
                          selectedDayAndTime.find(
                            (selectedTime) => selectedTime.day === label
                          ).timefrom)
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
                  to
                  <FAESelect
                    values={scheduleArray.filter(
                      (obj) =>
                        (obj.label >=
                          selectedDayAndTime.find(
                            (selectedTime) => selectedTime.day === label
                          ).timefrom) &
                        (obj.label <=
                          selectedDayAndTime.find(
                            (selectedTime) => selectedTime.day === label
                          ).timeto)
                    )}
                    primary
                    className="schedule--page-select"
                    value={
                      selectedDayAndTime.find((obj) => obj.day === label).timeto
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
          {/* } */}
          <FAEButton onClick={(e) => handleSubmit(e)}>Save</FAEButton>
        </div>
      )}
    </>
  );
};

export default PlexaarContainer(StaffSchedulePage);
