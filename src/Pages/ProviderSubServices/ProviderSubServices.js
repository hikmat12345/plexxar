//libs
/* eslint-disable */
import React, { Children, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { FAETextField } from "@plexaar/components";

//src
import history from "../../history";
import { getCookies } from "../../utils";
import PlexaarContainer from "../PlexaarContainer";
import { getProviderServices, getAvailableDuration } from "./actions";
import Loader from "../Loader";

//scss
import "./ProviderSubServices.scss";

const ProviderSubServices = () => {
  const location = useLocation();
  const userId = getCookies("userId");
  const {
    serviceId,
    providerId,
    customerId,
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
  } = location.state;
  const [allservices, setAllservices] = useState([]);
  const [SubServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchServices, setSearchServices] = useState([]);

  useEffect(() => {
    setLoading(true);
    getProviderServices({
      providerId,
      callback: (res) => {
        setLoading(false);
        setAllservices(res);
        let sub_services = [];
        res.map((ob) => {
          serviceId == ob.parent && sub_services.push(ob);
        });
        setSubServices(sub_services);
      },
    });
  }, []);

  const handleServiceClick = (
    id,
    duration,
    price,
    flatDiscount,
    hasProducts,
    hasSession
  ) => {
    var resourceId = location.state.providerId;
    getAvailableDuration({
      resourceId,
      startStr,
      callback: (availableDuration) => {
        let count = 0;
        allservices.map((ob) => {
          id == ob.serviceId && count++;
        });
        if (count > 0) {
          let sub_services = [];
          allservices.map((ob) => {
            id == ob.serviceId && sub_services.push(ob);
          });
          setSubServices(sub_services);
        } else {
          duration == 0 || availableDuration < duration
            ? alert("Provider is not available or duration time is 0 ")
            : hasSession
            ? history.push({
                pathname: "/booking-session",
                state: {
                  serviceId: id,
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
                },
              })
            : history.push({
                pathname: "/service-attribute",
                state: {
                  serviceId: id,
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
                  noOfSession: 0,
                },
              });
        }
      },
    });
  };

  // Code For sub Category Search
  const [value, setValue] = useState("");

  function filterItems(needle, heystack) {
    var query = needle.toLowerCase();
    return heystack.filter(function (item) {
      return item.name.toLowerCase().indexOf(query) >= 0;
    });
  }

  const filterFun = (text) => {
    setValue(text);
    if (text !== "") {
      const result = filterItems(text, SubServices);
      setSearchServices(result);
    } else {
      setSearchServices([]);
    }
  };

  useEffect(() => {
    servicesView();
  }, [searchServices]);

  const servicesView = () => {
    if (searchServices.length > 0) {
      return searchServices.map((obj) => (
        <div className="services-container">
          <ul>
            <div
              className="services"
              key={obj.childId}
              onClick={() =>
                handleServiceClick(
                  obj.childId,
                  obj.duration,
                  obj.maxPrice,
                  obj.flatDiscount,
                  obj.hasProducts,
                  obj.hasSession
                )
              }
            >
              <li className="service-name">{obj.name}</li>
              <p className="arrow"> {">"} </p>
            </div>
          </ul>
        </div>
      ));
    } else {
      if (value.length > 0) {
        return;
      } else {
        return SubServices.map((obj) => (
          <div className="services-container">
            <ul>
              <div
                className="services"
                key={obj.childId}
                onClick={() =>
                  handleServiceClick(
                    obj.childId,
                    obj.duration,
                    obj.maxPrice,
                    obj.flatDiscount,
                    obj.hasProducts,
                    obj.hasSession
                  )
                }
              >
                <li className="service-name">{obj.name}</li>
                <p className="arrow"> {">"} </p>
              </div>
            </ul>
          </div>
        ));
      }
    }
  };
  return (
    <>
      <center>
        <h1>Sub Services</h1>
      </center>
      <FAETextField
        type="text"
        className="form-control search--field"
        placeholder="Search Sub Services"
        value={value}
        onChange={(e) => filterFun(e.target.value)}
      />

      {loading && <Loader />}
      {!loading && servicesView()}
      {/* {SubServices.map((obj) => (
        <div className="services-container">
          <ul>
            <div
              className="services"
              key={obj.childId}
              onClick={() =>
                handleServiceClick(
                  obj.childId,
                  obj.duration,
                  obj.maxPrice,
                  obj.flatDiscount,
                  obj.hasProducts,
                  obj.hasSession
                )
              }
            >
              <li className="service-name">{obj.name}</li>
              <p className="arrow"> {">"} </p>
            </div>
          </ul>
        </div>
      ))} */}
    </>
  );
};

export default PlexaarContainer(ProviderSubServices);
