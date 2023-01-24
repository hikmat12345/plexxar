//lib
/* eslint-disable */
import React, { useEffect, useContext, useState } from "react";
import { FAEText, FAEButton, FAEShadowBox } from "@plexaar/components";

//src
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import { GetServiceSession } from "./action";
import "./BookingSession.scss";
import { useLocation } from "react-router-dom";
import history from "../../history";
import PlexaarContainer from "../PlexaarContainer";

const BookingSession = () => {
  const { userCountryId } = useContext(CountryDetailContext);
  const [serviceSessions, setServiceSession] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const location = useLocation();
  const {
    serviceId,
    customerId,
    providerId,
    providerEmail,
    providerAccount,
    customerAccount,
    customerEmail,
    customerFirstname,
    customerLastname,
    startStr,
    startTime,
    isfreeConsultation,
    isExpert,
    duration,
    flatDiscount,
    price,
    hasProducts,
  } = location.state;

  useEffect(() => {
    GetServiceSession({
      serviceId,
      userCountryId,
      callback: (res) => setServiceSession(res),
    });
  }, [userCountryId]);

  const handleSessionButton = (id) => {
    var selected = document.getElementsByClassName(
      "booking-select-session-btn"
    );
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].innerHTML == id) {
        setSelectedSession(id);
        selected[i].style.backgroundColor = "#548DFF";
      } else selected[i].style.backgroundColor = "#b5b7bb";
    }
  };

  const handleSubmit = () => {
    selectedSession !== ""
      ? history.push({
          pathname: "/service-attribute",
          state: {
            serviceId: serviceId,
            customerId: customerId,
            providerId: providerId,
            providerEmail: providerEmail,
            providerAccount: providerAccount,
            customerAccount: customerAccount,
            customerEmail: customerEmail,
            customerFirstname: customerFirstname,
            customerLastname: customerLastname,
            startStr: startStr,
            startTime: startTime,
            isfreeConsultation: isfreeConsultation,
            isExpert: isExpert,
            duration: duration,
            flatDiscount: flatDiscount,
            price: price,
            hasProducts: hasProducts,
            noOfSession: selectedSession,
          },
        })
      : alert("Please Select atleast one session");
  };
  console.log(location);
  return (
    <div className="booking-session-container">
      <FAEText className="booking-session-header" subHeading>
        Booking Session
      </FAEText>
      <br />
      <FAEShadowBox primary>
        <table>
          <thead>
            <tr>
              <th>No of Session</th>
              <th>Price Per Session</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {serviceSessions.map((session) => (
              <tr key={session.id}>
                <td>
                  <FAEButton
                    className="booking-select-session-btn"
                    onClick={() => handleSessionButton(session.id)}
                  >
                    {session.id}
                  </FAEButton>
                </td>
                <td>
                  <FAEText>
                    {session.currencySymbol + session.pricePerSession}
                  </FAEText>
                </td>
                <td>
                  <div className="session-total">
                    <FAEText
                      className={
                        session.discountedPrice > 0 ? "line-through" : ""
                      }
                    >
                      {session.currencySymbol + session.actualPrice}
                    </FAEText>
                    {session.discountedPrice > 0 ? (
                      <FAEText>
                        {session.currencySymbol + session.discountedPrice}
                      </FAEText>
                    ) : (
                      ""
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FAEShadowBox>
      <br />
      <FAEButton className="booking-session-submit-btn" onClick={handleSubmit}>
        Next
      </FAEButton>
    </div>
  );
};
export default PlexaarContainer(BookingSession);
