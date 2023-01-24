//libs
/* eslint-disable no-unused-vars */
import {
  FAESelect,
  FAEButton,
  FAETextField,
  FAERadioGroup,
  FAECheckBoxGroup,
} from "@plexaar/components";
import React, { Children, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
//src
import history from "../../history";
import { getCookies, getUniqueData } from "../../utils";
import PlexaarContainer from "../PlexaarContainer";
import {
  getServiceAttributes,
  addAppointment,
  SessionBooking,
} from "./actions";

//scss
import "./ServiceAttribute.scss";
import Loader from "../Loader";

const ServiceAttribute = () => {
  const location = useLocation();
  const userId = getCookies("userId");
  const [serviceAttribute, setServiceAttributes] = useState([]);
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
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
    var serviceId = location.state.serviceId;
    getServiceAttributes({
      serviceId,
      callback: (res) => {
        setServiceAttributes(res);
        setLoading(false);
      },
    });
  }, [location.state.serviceId]);

  const handleForm = (e) => {
    e.preventDefault();
    var date = new Date(location.state.startStr);
    var endtime = new Date(date.getTime() + location.state.duration * 60000);
    var custID = location.state.customerId;
    var providerId = parseInt(location.state.providerId);
    var providerEmail = location.state.providerEmail;
    var customerAccount = location.state.customerAccount;
    var bookingdate = location.state.startStr;
    var isfreeConsultation = location.state.isfreeConsultation;
    var serviceId = location.state.serviceId;
    var duration = location.state.duration;
    var price = location.state.price;
    var flatDiscount = location.state.flatDiscount;
    var noOfSession = location.state.noOfSession;
    var enddate =
      endtime.getFullYear() +
      "-" +
      month[endtime.getMonth()] +
      "-" +
      (endtime.getDate() < 10 ? "0" + endtime.getDate() : endtime.getDate()) +
      "T" +
      (endtime.getHours() < 10
        ? "0" + endtime.getHours()
        : endtime.getHours()) +
      ":" +
      (endtime.getMinutes() < 10
        ? "0" + endtime.getMinutes()
        : endtime.getMinutes()) +
      ":" +
      (endtime.getSeconds() < 10
        ? "0" + endtime.getSeconds()
        : endtime.getSeconds());

    addAppointment({
      custID,
      providerId,
      providerEmail,
      bookingdate,
      isfreeConsultation,
      serviceId,
      duration,
      price,
      flatDiscount,
      enddate,
      notes,
      noOfSession,
      userId,
      form,
      callback: (res) => {
        if (res.code === 0) {
          var bookingId = res.bookingId;
          var cartId = res.cartId;
          if (noOfSession !== 0) {
            SessionBooking({ cartId, noOfSession });
          }
          location.state.hasProducts
            ? history.push({
                pathname: "/product-page",
                state: {
                  cartId: cartId,
                  customerId: location.state.customerId,
                  serviceId: serviceId,
                  providerId: providerId,
                  bookingId: bookingId,
                  price: price,
                  isfreeConsultation: isfreeConsultation,
                  customerAccount: customerAccount,
                  customerEmail: location.state.customerEmail,
                  customerFirstname: location.state.customerFirstname,
                  customerLastname: location.state.customerLastname,
                },
              })
            : history.push({
                pathname: "/appointment-summary",
                state: {
                  customerAccount: customerAccount,
                  customerEmail: location.state.customerEmail,
                  customerFirstname: location.state.customerFirstname,
                  customerLastname: location.state.customerLastname,
                  paymentAmount: location.state.price,
                  customerId: location.state.customerId,
                  providerId,
                  bookingId,
                  cartId,
                },
              });
        } else alert(res.message);
      },
    });
  };
  console.log(location);
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <center>
            <h1>Service Attributes</h1>
          </center>
          <FAETextField
            label="Notes"
            placeholder="Type your answer here..."
            getValue={(value) => {
              setNotes(value);
            }}
            value={notes}
            primary
          />
          <div className="service-attributes-list-container">
            {serviceAttribute &&
              serviceAttribute.map((obj) => (
                <div key={obj.attributeKey}>
                  {obj.attributeTypeName.replace(/\s/g, "").toUpperCase() ===
                    "TEXTBOX" && (
                    <FAETextField
                      label={obj.attributeKey}
                      placeholder="Type your answer here..."
                      getValue={(value) => {
                        setForm(
                          getUniqueData(
                            [{ id: obj.attributeID, value: value }, ...form],
                            "id"
                          )
                        );
                      }}
                      //value={textValue.value}
                      primary
                    />
                  )}
                  {(obj.attributeTypeName.replace(/\s/g, "").toUpperCase() ===
                    "SELECT" ||
                    obj.attributeTypeName.replace(/\s/g, "").toUpperCase() ===
                      "PROFESSION") && (
                    <FAESelect
                      label={obj.attributeKey}
                      values={[
                        { label: "None", value: "" },
                        ...obj.options.map((option) => {
                          return { label: option.value, value: option.value };
                        }),
                      ]}
                      getSelectedValue={(value) => {
                        setForm(
                          getUniqueData(
                            [{ id: obj.attributeID, value: value }, ...form],
                            "id"
                          )
                        );
                      }}
                      primary
                    />
                  )}
                  {obj.attributeTypeName.replace(/\s/g, "").toUpperCase() ===
                    "RADIOBUTTON" && (
                    <FAERadioGroup
                      label={obj.attributeKey}
                      values={[
                        // { label: "None", value: "" },
                        ...obj.options.map((option) => {
                          return { label: option.value, value: option.value };
                        }),
                      ]}
                      getSelectedValue={(value) => {
                        setForm(
                          getUniqueData(
                            [{ id: obj.attributeID, value: value }, ...form],
                            "id"
                          )
                        );
                      }}
                      primary
                    />
                  )}
                  {obj.attributeTypeName.replace(/\s/g, "").toUpperCase() ===
                    "CHECKBOX" && (
                    <FAECheckBoxGroup
                      label={obj.attributeKey}
                      values={[
                        ...obj.options.map((option) => {
                          return { label: option.value, value: option.value };
                        }),
                      ]}
                      getSelectedValues={(value) => {
                        setForm(
                          getUniqueData(
                            [
                              { id: obj.attributeID, value: value.toString() },
                              ...form,
                            ],
                            "id"
                          )
                        );
                      }}
                      primary
                    />
                  )}
                </div>
              ))}
            <br />
            <FAEButton onClick={handleForm}>Save</FAEButton>
          </div>
        </>
      )}
    </>
  );
};

export default PlexaarContainer(ServiceAttribute);
