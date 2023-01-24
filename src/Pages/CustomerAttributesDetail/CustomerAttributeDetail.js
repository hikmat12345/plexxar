import React, { useState, useEffect } from "react";
import PlexaarContainer from "../PlexaarContainer";
import { FAEText } from "@plexaar/components/dist/stories/FAEText/FAEText";

//src
import { GetAppointmentDetails } from "./action";
import "./CustomerAttributeDetail.scss";
import { useLocation } from "react-router-dom";

const CustomerAttributeDetail = () => {
  const location = useLocation();
  const { eventId, sessionId } = location.state;
  const [attributesDetail, setAttributesDetail] = useState([]);

  useEffect(() => {
    GetAppointmentDetails({
      eventId,
      sessionId,
      callback: (res) => setAttributesDetail(res.attributes),
    });
  }, [eventId, sessionId]);
  return (
    <>
      {attributesDetail.map((obj) => (
        <div className="booking-detail">
          <FAEText className="booking-service" bold>
            {obj.attributeKey}
          </FAEText>
          <FAEText tertiary>{obj.attributeValue}</FAEText>
        </div>
      ))}
    </>
  );
};

export default PlexaarContainer(CustomerAttributeDetail);
