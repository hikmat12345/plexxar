//libs
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Cards from "react-credit-cards";
import {
  FAEText,
  FAEButton,
  FAEShadowBox,
  FAEDialogueBox,
} from "@plexaar/components";
//src
import history from "../../history";
//sass
import "./AddPaymentCard.scss";
import PlexaarContainer from "../PlexaarContainer";
import { CreatePaymentMethod, saveCardData } from "./action";
import "react-credit-cards/es/styles-compiled.css";

const AddPaymentCard = () => {
  document.title = `Plexaar | Add Card`;
  const location = useLocation();
  console.log(location);
  const [cvc, setCvc] = useState("");
  const [expiry, setExpiry] = useState("");
  const [expiryShow, setExpiryShow] = useState("");
  const [focus, setFocus] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("GB");
  const [postCode, setPostCode] = useState("");
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const handleInputChange = (e) => {
    if (e.target.name === "name") {
      setFocus("name");
      setName(e.target.value.toUpperCase());
    } else if (e.target.name === "number") {
      if (e.target.value.replace(/\s/g, "").length <= 16) {
        if (
          e.target.value.replace(/\s/g, "").length % 4 === 0 &&
          e.nativeEvent.inputType === "insertText"
        ) {
          setFocus("number");
          setNumber(e.target.value + " ");
          console.log(e.target.value + " ");
        } else {
          setFocus("number");
          setNumber(e.target.value);
        }
      } else {
        alert("not more then 16 digits!");
        console.log(e.target.value.replace(/\s/g, "").substring(0, 16));
      }
    } else if (e.target.name === "expiry") {
      setFocus("expiry");
      setExpiryShow(e.target.value);
      setExpiry(
        e.target.value.split("-")[1] + "/" + e.target.value.split("-")[0]
      );
    } else if (e.target.name === "cvc") {
      setCvc(e.target.value);
      setFocus("cvc");
    }
  };

  const handleBillingAddress = (e) => {
    if (e.target.name === "address") {
      setAddress(e.target.value);
    } else if (e.target.name === "address_line") {
      setAddressLine(e.target.value);
    } else if (e.target.name === "city") {
      setCity(e.target.value);
    } else if (e.target.name === "state") {
      setState(e.target.value);
    } else if (e.target.name === "country") {
      setCountry(e.target.value);
    } else if (e.target.name === "post_code") {
      setPostCode(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var cardNumber = number.replace(/\s/g, "").substring(0, 16);
    var expMonth = parseInt(expiry.split("/")[0]);
    var expYear = parseInt(expiry.split("/")[1]);
    var customerEmail = location.state.customerEmail;
    var customerFirstname = location.state.customerFirstname;
    var customerLastname = location.state.customerLastname;
    var customerAccount = location.state.customerAccount;
    var customerName = customerFirstname + " " + customerLastname;

    CreatePaymentMethod({
      cardNumber,
      name,
      expMonth,
      expYear,
      cvc,
      address,
      addressLine,
      city,
      country,
      state,
      postCode,
      customerEmail,
      customerName,
      callback: (res) => {
        const { code, paymentMethodId, message } = res;
        if (code !== 0) {
          setContent(message);
          setOpen(true);
        } else {
          saveCardData({
            paymentMethodId,
            customerFirstname,
            customerLastname,
            customerAccount,
            callback: (res) => {
              if (res.code === 0) {
                setContent(res.message);
                setOpen(true);
                history.goBack();
              } else {
                setContent(res.message);
                setOpen(true);
              }
            },
          });
        }
      },
    });
  };
  console.log(location);
  return (
    <>
      <div className="PaymentForm">
        <Cards
          cvc={cvc}
          expiry={expiry}
          focused={focus}
          name={name}
          number={number}
          callback={(e) => console.log("ee: ", e)}
        />
        <br />
        <form className="card-detail-form" onSubmit={handleSubmit}>
          <FAEText subHeading className="card-heading">
            Credit Card
          </FAEText>
          <div className="card-detail-container">
            <label>Card Number</label>
            <FAEShadowBox padding>
              <input
                type="tel"
                name="number"
                placeholder="Card Number"
                className="card-input-field"
                value={number}
                required
                onChange={handleInputChange}
              />
            </FAEShadowBox>
            <label>Card Holder</label>
            <FAEShadowBox padding>
              <input
                type="text"
                name="name"
                placeholder="Card Holder"
                className="card-input-field"
                value={name}
                required
                onChange={handleInputChange}
              />
            </FAEShadowBox>
            <label>Expiry Month/Year</label>
            <FAEShadowBox padding>
              <input
                type="month"
                name="expiry"
                placeholder="Expiry Month/Year"
                className="card-input-field"
                value={expiryShow}
                onChange={handleInputChange}
                required
                min="2015-03"
                max="2030-05"
              />
            </FAEShadowBox>
            <label>CVC</label>
            <FAEShadowBox padding>
              <input
                type="number"
                name="cvc"
                placeholder="CVC"
                className="card-input-field"
                value={cvc}
                onChange={handleInputChange}
                required
                min="100"
                max="999"
              />
            </FAEShadowBox>
          </div>
          <br />
          <FAEText subHeading className="card-heading">
            Billing Address
          </FAEText>
          <div className="card-detail-container">
            <label>Address</label>
            <FAEShadowBox padding>
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="card-input-field"
                value={address}
                onChange={handleBillingAddress}
              />
            </FAEShadowBox>
            <label>Address line 2</label>
            <FAEShadowBox padding>
              <input
                type="text"
                name="address_line"
                placeholder="Address Line 2"
                className="card-input-field"
                value={addressLine}
                onChange={handleBillingAddress}
              />
            </FAEShadowBox>
            <div className="billing-detail">
              <div>
                <label>City</label>
                <FAEShadowBox padding>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="card-input-field"
                    value={city}
                    onChange={handleBillingAddress}
                  />
                </FAEShadowBox>
              </div>
              <div>
                <label>State</label>
                <FAEShadowBox padding>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="card-input-field"
                    value={state}
                    onChange={handleBillingAddress}
                  />
                </FAEShadowBox>
              </div>
            </div>
            <div className="billing-detail">
              <div>
                <label>Country</label>
                <FAEShadowBox padding>
                  <select
                    defaultValue="GB"
                    onChange={(e) => setCountry(e.target.value)}
                    className="card-input-field"
                  >
                    <option value="PK">Pakistan</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United State Of America</option>
                    <option value="SA">Saudi Arabia</option>
                  </select>
                </FAEShadowBox>
              </div>
              <div>
                <label>Post Code</label>
                <FAEShadowBox padding>
                  <input
                    type="text"
                    name="post_code"
                    placeholder="Post Code"
                    className="card-input-field"
                    value={postCode}
                    onChange={handleBillingAddress}
                  />
                </FAEShadowBox>
              </div>
            </div>
          </div>
          <br />
          <FAEButton type="submit">Submit</FAEButton>
        </form>
      </div>
      <FAEDialogueBox
        open={open}
        content={content}
        buttons={[
          {
            label: "Ok",
            onClick: () => {
              setOpen(false);
            },
          },
        ]}
      />
    </>
  );
};
export default PlexaarContainer(AddPaymentCard);
