//libs
/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { FAETextField, FAEButton } from "@plexaar/components";

//src
import history from "../../history";
import { getCookies } from "../../utils";
import PlexaarContainer from "../PlexaarContainer";
import { getProviderServices, getAvailableDuration } from "./actions";
import Loader from "../Loader";

//scss
import "./ProviderServices.scss";

const ProviderServices = () => {
  const location = useLocation();
  console.log(location)
  const userId = getCookies("userId");
  const {
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
  const [providerServices, setProviderServices] = useState([]);
  const [searchServices, setSearchServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let services = [];
    setLoading(true);
    getProviderServices({
      providerId,
      callback: (res) => {
        // console.log("Re",res)
        setLoading(false);

        setAllservices(res);
        res.map((ob) => {
          ob.parent == 0 && services.push(ob);
        });
        setProviderServices(services);
      },
    });
  }, []);

  const handleServices = (
    id,
    duration,
    price,
    flatDiscount,
    hasProducts,
    hasSession
  ) => {
    var resourceId = providerId;
    getAvailableDuration({
      resourceId,
      startStr,
      callback: (availableDuration) => {
        let count = 0;
        allservices.map((ob) => {
          id == ob.parent && count++;
        });
        count > 0
          ? history.push({
              pathname: "/sub-services",
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
              },
            })
          : duration === 0 || availableDuration < duration
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
      },
    });
  };

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
      const result = filterItems(text, providerServices);
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
                handleServices(
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
        return providerServices.map((obj) => (
          <div className="services-container">
            <ul>
              <div
                className="services"
                key={obj.childId}
                onClick={() =>
                  handleServices(
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
        <h1>Provider Services</h1>
      </center>
      <FAETextField
        type="text"
        className="form-control search--field"
        placeholder="Search Services"
        value={value}
        onChange={(e) => filterFun(e.target.value)}
      />

      {loading && <Loader />}
      {!loading && servicesView()}
    </>
  );
};

export default PlexaarContainer(ProviderServices);
