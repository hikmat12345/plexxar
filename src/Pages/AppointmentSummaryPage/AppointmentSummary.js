//lib
/* eslint-disable  */
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FAEText,
  FAEShadowBox,
  FAEButton,
  FAEDialogueBox,
  FAERadioGroup,
} from "@plexaar/components";

//src
import "./AppointmentSummary.scss";
import PlexaarContainer from "../PlexaarContainer";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import Loader from "../Loader";
import history from "../../history";
import {
  Getinvoice,
  GetSummary,
  PlexaarCod,
  PlexaarCreateBooking,
  SalesOrder,
} from "./action";
import { setCookies } from "../../utils";

const AppointmentSummary = () => {
  const location = useLocation();
  const {
    customerId,
    cartId,
    providerId,
    customerAccount,
    isfreeConsultation,
    bookingId,
  } = location.state;
  const { userCountryId } = useContext(CountryDetailContext);
  const [summary, setSummary] = useState([]);
  const [open, setOpen] = useState(false);
  const [payVia, setPayVia] = useState("");
  const [productDetails, setProductDetails] = useState([]);
  const [salesOrderNumber, setSalesOrderNumber] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(true);
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
    GetSummary({
      customerId,
      cartId,
      userCountryId,
      callback: (res) => {
        setSummary(res);
        setProductDetails(res.productDetails);
        setLoading(false);
      },
    });
    SalesOrder({
      bookingId,
      cartId,
      customerId,
      callback: (res) => {
        if (res.code === 0) {
          setSalesOrderNumber(res?.salesOrders?.salesOrderNumber);
          setCustomerPhone(res?.salesOrders?.phone);
        } else {
          console.log(res.message);
        }
      },
    });
  }, [userCountryId]);

  const createBookingAPI = () => {
    PlexaarCreateBooking({
      numberOfSessions: summary.numberOfSessions,
      paymentAmount: summary.totalAmount,
      providerId,
      customerId,
      cartId,
      callback: (res) => {
        var initialDate = new Date(summary.bookingDate);
        initialDate =
          initialDate.getFullYear() +
          "-" +
          month[initialDate.getMonth()] +
          "-" +
          (initialDate.getDate() < 10
            ? "0" + initialDate.getDate()
            : initialDate.getDate());

        if (res.code === 0) {
          setCookies("initialDate", initialDate);
          history.push("/user-appointments");
        } else alert(res.message);
      },
    });

    // PlexaarCod({
    //   bookingId,
    //   customerAccount,
    //   isfreeConsultation,
    //   userCountryId,
    //   numberOfSessions: summary.numberOfSessions,
    //   paymentAmount: summary.totalAmount,
    //   providerId,
    //   customerId,
    //   cartId,
    //   callback: (res) => {
    //     var initialDate = new Date(summary.bookingDate);
    //     initialDate =
    //       initialDate.getFullYear() +
    //       "-" +
    //       month[initialDate.getMonth()] +
    //       "-" +
    //       (initialDate.getDate() < 10
    //         ? "0" + initialDate.getDate()
    //         : initialDate.getDate());

    //     if (res.code === 0) {
    //       setCookies("initialDate", initialDate);
    //       history.push("/user-appointments");
    //     } else alert(res.message);
    //   },
    // });
  };
  const handleConfirmBooking = () => {
    if (userCountryId === 171) {
      Getinvoice({
        salesOrderNumber,
        bookingId,
        cartId,
        customerId,
        providerId,
        callback: (res) =>
          res.code === 0 ? createBookingAPI() : alert(res.message),
      });
    } else {
      history.push({
        pathname: "/payment-method",
        state: {
          location: location.state,
          summary,
          salesOrderNumber,
          customerPhone,
        },
      });
    }
    // history.push({
    //   pathname: "/payment-method",
    //   state: {
    //     location: location.state,
    //     summary,
    //   },
    // });
    // userCountryId === 171 ? createBookingAPI() : setOpen(true);
  };
  const handleCheckout = () => {
    let initialDate = new Date(summary.bookingDate);
    initialDate =
      initialDate.getFullYear() +
      "-" +
      month[initialDate.getMonth()] +
      "-" +
      (initialDate.getDate() < 10
        ? "0" + initialDate.getDate()
        : initialDate.getDate());
    payVia === "cash"
      ? createBookingAPI()
      : history.push({
          pathname: "/appointment-payment",
          state: {
            location: location.state,
            initialDate: initialDate,
          },
        });
  };
  console.log(location);
  return (
    <>
      <FAEShadowBox primary>
        <div className="summary-main-container">
          <br />
          <FAEText subHeading className="align-center">
            Product Summary
          </FAEText>
          <br />
          <hr />
          {loading && <Loader />}
          {!loading && (
            <>
              <FAEText className="align-center">
                <span style={{ color: "#548DFF" }}>Service</span> Detail
              </FAEText>
              <FAEShadowBox primary>
                <div className="summary-service-detail">
                  <div>
                    <FAEText>Service Name</FAEText>
                    <div>
                      <FAEText bold>{summary.serviceName}</FAEText>
                      <FAEText bold>
                        {summary.currencySymbol + summary.price}
                      </FAEText>
                    </div>
                    <hr />
                    {summary.hasSession && (
                      <>
                        <FAEText>Number Of Sessions</FAEText>
                        <div>
                          <FAEText bold>{summary.numberOfSessions}</FAEText>
                        </div>
                      </>
                    )}
                    <hr />
                    <FAEText>Date and Time</FAEText>
                    <div>
                      <FAEText bold>{summary.bookingDate}</FAEText>
                      <FAEText bold>{summary.bookingTime}</FAEText>
                    </div>
                    <hr />
                    <FAEText>Address</FAEText>
                    <FAEText bold className="summary-address">
                      {summary.address}
                    </FAEText>
                  </div>
                </div>
              </FAEShadowBox>
              <br />
              {productDetails?.length > 0 && (
                <>
                  <FAEText className="align-center">
                    <span style={{ color: "#548DFF" }}>Service</span> Products
                  </FAEText>
                  <FAEShadowBox primary>
                    <div className="summary-product-detail">
                      {productDetails.map((obj) => (
                        <div>
                          <FAEText>
                            {obj.productName} ({obj.quantity})
                          </FAEText>
                          <FAEText>{obj.currencySymbol + obj.price}</FAEText>
                        </div>
                      ))}
                    </div>
                  </FAEShadowBox>
                </>
              )}
              <br />
              <FAEText className="align-center">
                <span style={{ color: "#548DFF" }}>Payment</span> Detail
              </FAEText>
              <FAEShadowBox primary>
                <div className="summary-product-detail">
                  <div>
                    <FAEText>Price</FAEText>
                    <FAEText>
                      {summary.currencySymbol + summary.actualPrice}
                    </FAEText>
                  </div>
                  <div>
                    <FAEText>Discount</FAEText>
                    <FAEText>
                      {summary.currencySymbol + summary.discount}
                    </FAEText>
                  </div>
                  <hr />
                  <div>
                    <FAEText>Pay Now</FAEText>
                    <FAEText>
                      {summary.currencySymbol + summary.totalAmount}
                    </FAEText>
                  </div>
                </div>
              </FAEShadowBox>
            </>
          )}
        </div>
      </FAEShadowBox>
      <FAEButton
        className="summary-confirm-booking-btn"
        onClick={handleConfirmBooking}
      >
        Confirm Booking
      </FAEButton>
      <FAEDialogueBox
        open={open}
        content={
          <div>
            <h4>Payment Method</h4>
            <p>Select Payment method</p>
            <br />
            <FAERadioGroup
              values={[
                { label: "cash", value: "cash" },
                { label: "card", value: "card" },
              ]}
              value={payVia}
              getSelectedValue={(e) => setPayVia(e)}
              primary
            />
          </div>
        }
        buttons={[
          {
            label: "Cancel",
            onClick: () => {
              setOpen(false);
            },
            className: "btn-alert",
          },
          {
            label: "Proceed",
            onClick: () => {
              payVia != "" && setOpen(false);
              handleCheckout();
            },
            className: "btn-alert",
          },
        ]}
      />
    </>
  );
};

export default PlexaarContainer(AppointmentSummary);
