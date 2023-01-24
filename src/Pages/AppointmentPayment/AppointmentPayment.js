/* eslint-disable */
import React, { useContext, useEffect, useState, Children } from "react";
import { useLocation } from "react-router-dom";
import { FAEText, FAECodeInput, FAEDialogueBox } from "@plexaar/components";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import PlexaarContainer from "../PlexaarContainer";

//src
import {
  GetCustomerPaymentCards,
  sendPaymentOtp,
  verifyPaymentOtp,
  ResendPaymentCode,
  CapturePayment,
} from "./action";
import { getFileSrcFromPublicFolder, setCookies } from "../../utils";
import history from "../../history";

//
import "./AppointmentPayment.scss";

const AppointmentPayment = () => {
  const locationData = useLocation();
  console.log(locationData);
  const { location, initialDate } = locationData.state;
  const { userCountryId } = useContext(CountryDetailContext);
  const [cardList, setCardList] = useState([]);
  const deleteIcon = getFileSrcFromPublicFolder("delete_icon.svg");
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [clickedId, setClickedCardId] = useState("");

  var customerAccount = location.customerAccount;

  useEffect(() => {
    GetCustomerPaymentCards({
      customerAccount,
      callback: (res) => setCardList(res),
    });
  }, []);

  const verifyPayment = () => {
    var customerAccount = location.customerAccount;
    var paymentAmount = location.paymentAmount;
    var bookingId = location.bookingId;
    var cartId = location.cartid;
    verifyPaymentOtp({
      customerAccount,
      code,
      callback: (res) => {
        res.code === 0
          ? CapturePayment({
              customerAccount,
              paymentAmount,
              bookingId,
              clickedId,
              cartId,
              userCountryId,
              callback: (res) => {
                if (res.code === 0) {
                  setCookies("initialDate", initialDate);
                  alert("success");
                  history.push("/user-appointments");
                } else {
                  alert("capture", res.message);
                }
              },
            })
          : alert("verify", res.message);
      },
    });
  };
  const handlePayment = (id) => {
    var customerAccount = location.customerAccount;
    sendPaymentOtp({
      customerAccount,
      callback: (res) => {
        //in case when sms is send
        setClickedCardId(id);
        setOpen(true);
      },
    });
  };
  console.log(location);
  return (
    <>
      <div className="fae--payment-details-page-main-container">
        <div className="fae--payment-details-heading-button-wrapper">
          <FAEText heading>Payment Details</FAEText>{" "}
          <FAEText
            onClick={() =>
              history.push({
                pathname: "/appointment-payment/add-card",
                state: {
                  customerAccount: location.customerAccount,
                  customerEmail: location.customerEmail,
                  customerFirstname: location.customerFirstname,
                  customerLastname: location.customerLastname,
                },
              })
            }
            className="fae--payment-details-add-button"
          >
            <span className="red-text bold">+</span> Add New Card
          </FAEText>
        </div>

        <div className="fae--payment-details-cards-wrapper">
          {Children.toArray(
            cardList.map((card) => {
              const {
                id,
                card: { last4, expMonth, expYear },
                customer,
              } = card;
              return (
                <div
                  onClick={() => handlePayment(id)}
                  className="fae--paymet-details-card-wrapper pointer"
                >
                  <div>
                    <FAEText className="fae--payment-details-card-bar">
                      {last4.padStart(16, "*")}
                    </FAEText>
                    <FAEText paragraph secondary>
                      Expires: {expMonth}/{expYear}
                    </FAEText>
                  </div>
                  <div className="fae--payment-card-unit-actions">
                    {/* {id === defaultCardId && (
                            <CheckCircleIcon style={{ color: "green" }} />
                          )} */}

                    {/* <img
                        className="fae--payment-details-action"
                        src={deleteIcon}
                        alt="delete_icon"
                        width="auto"
                        height="auto"
                        //   onClick={(e) => {
                        //     e.stopPropagation();
                        //     deleteCard({ id, email });
                        //   }}
                      /> */}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* )} */}
      </div>
      <FAEDialogueBox
        content={
          <div>
            <h4>Verify Payment</h4>
            <br />
            <FAECodeInput className="verify-code-red" getValue={setCode} />
          </div>
        }
        open={open}
        buttons={[
          {
            label: "Verify",
            onClick: () => {
              setOpen(false);
              verifyPayment();
            },
            className: "btn-alert",
          },
          {
            label: "Resend code",
            onClick: () => {
              ResendPaymentCode({
                customerAccount,
                callback: (res) => alert(res.message),
              });
            },
            className: "btn-alert",
          },
        ]}
      />
    </>
  );
};
export default PlexaarContainer(AppointmentPayment);
