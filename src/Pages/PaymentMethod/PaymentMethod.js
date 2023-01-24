/* eslint-disable */
import { FAEText } from "@plexaar/components/dist/stories/FAEText/FAEText";
import React, { useEffect, useState } from "react";
import FaxOutlinedIcon from "@mui/icons-material/FaxOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//src
import "./PaymentMethod.scss";
import { FAESelect } from "@plexaar/components/dist/stories/FAESelect/FAESelect";
import { FAEButton } from "@plexaar/components/dist/stories/FAEButton/FAEButton";
import { FAEDialogueBox } from "@plexaar/components/dist/stories/FAEDialogueBox/FAEDialogueBox";
import { useLocation } from "react-router-dom";
import moment from "moment";
import Loader from "../Loader";
import { searchExistingAccount } from "../AddCustomerPage/actions";
import { Getinvoice, PlexaarCreateBooking, SendPaymentLink } from "./action";
import { setCookies } from "../../utils";
import history from "../../history";

export default function PaymentMethod() {
  const location = useLocation();
  const { salesOrderNumber, customerPhone } = location.state;
  const {
    bookingDate,
    bookingTime,
    currencySymbol,
    totalAmount,
    serviceName,
    numberOfSessions,
  } = location.state.summary;
  const {
    bookingId,
    cartId,
    providerId,
    customerId,
    customerAccount,
    customerEmail,
  } = location.state.location;
  console.log(location);
  const [open, setOpen] = useState(false);
  const [dateSelected, setDateSelected] = useState(
    new Date().setDate(new Date().getDate() + 1)
  );
  const [nextDate, setNextDate] = useState(
    moment(new Date(new Date().setDate(new Date().getDate() + 1))).format(
      "YYYY-MM-DDTHH:mm:ss"
    )
  );
  const [successOpen, setSuccessOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    searchExistingAccount({
      accountNumber: customerAccount,
      callback: (res) => console.log(res.result),
    });
  }, []);

  const handlePayByLink = () => {
    if (nextDate !== "") {
      setLoading(true);
      Getinvoice({
        salesOrderNumber,
        bookingId,
        cartId,
        customerId,
        providerId,
        callback: (res) => {
          if (res.code === 0) {
            PlexaarCreateBooking({
              numberOfSessions,
              totalAmount,
              providerId,
              customerId,
              cartId,
              chargeId: "External link",
              callback: (res) => {
                setContent(res.message);
                if (res.code === 0) {
                  SendPaymentLink({
                    bookingId: res.bookingId,
                    customerId,
                    nextDate,
                    callback: (res) => {
                      res.code === 0
                        ? setSuccessOpen(true)
                        : alert(res.message);
                      setLoading(false);
                    },
                  });
                } else {
                  alert(res.message);
                }
              },
            });
          } else alert(res.message);
        },
      });
    }
  };

  const handleCash = () => {
    setLoading(true);
    Getinvoice({
      salesOrderNumber,
      bookingId,
      cartId,
      customerId,
      providerId,
      callback: (res) => {
        if (res.code === 0) {
          PlexaarCreateBooking({
            numberOfSessions,
            totalAmount,
            providerId,
            customerId,
            cartId,
            chargeId: "cash",
            callback: (res) => {
              setContent(res.message);
              if (res.code === 0) {
                setSuccessOpen(true);
                setLoading(false);
              } else {
                alert(res.message);
              }
            },
          });
        } else alert(res.message);
      },
    });
    // setLoading(false)
  };
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="payment-method-main">
          <div className="payment-method-head">
            <FAEText className="payment-main-service">{serviceName}</FAEText>
            <div className="service-line">
              <FAEText>{serviceName}</FAEText>
              <FAEText className="payment-price">
                {currencySymbol + "" + totalAmount}
              </FAEText>
            </div>
            <FAEText className="payment-date">
              {bookingDate} | {bookingTime}
            </FAEText>
          </div>

          <div className="payment-method-option">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <div className="pay-via">
                  <FaxOutlinedIcon color="primary" />{" "}
                  <FAEText className="cursor">Pay By Terminal</FAEText>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <div className="pay-via">
                  <InsertLinkOutlinedIcon color="primary" />{" "}
                  <FAEText className="cursor">Pay By Link</FAEText>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="pay-via-link-main">
                  <FAEText>A payment link will be sent to customer on</FAEText>
                  <FAEText bold>{customerPhone}</FAEText>
                  <FAEText bold>{customerEmail}</FAEText>
                  <div className="submit-via-link">
                    <FAEText className="link-valid-till">
                      Link will be valid till{" "}
                      {nextDate !== ""
                        ? moment(nextDate).format("Do MMM YYYY LTS")
                        : ""}
                    </FAEText>
                    <FAESelect
                      // label="Select Hours"
                      //   isRequired
                      values={[
                        {
                          label: "Next 24 Hours",
                          value: 1,
                        },
                        {
                          label: "Next 48 Hours",
                          value: 2,
                        },
                        {
                          label: "Next 72 Hours",
                          value: 3,
                        },
                        {
                          label: "Custom",
                          value: 0,
                        },
                      ]}
                      value={1}
                      getSelectedValue={(value) => {
                        if (value == 0) {
                          setOpen(true);
                        } else {
                          {
                            setNextDate(
                              moment(
                                new Date(
                                  new Date().setDate(
                                    new Date().getDate() + value
                                  )
                                )
                              ).format("YYYY-MM-DDTHH:mm:ss")
                            );
                          }
                        }
                      }}
                    />
                  </div>
                  <FAEButton
                    onClick={() => {
                      nextDate !== "" && handlePayByLink();
                    }}
                  >
                    Send Payment Link
                  </FAEButton>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <div className="pay-via">
                  <LocalAtmOutlinedIcon color="primary" />{" "}
                  <FAEText className="cursor">Cash</FAEText>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <FAEButton className="cash-btn" onClick={handleCash}>
                  Pay by Cash
                </FAEButton>
              </AccordionDetails>
            </Accordion>
          </div>
          <FAEDialogueBox
            open={open}
            content={
              <>
                <DatePicker
                  selected={dateSelected}
                  value={dateSelected}
                  onChange={(date) => setDateSelected(date)}
                  minDate={
                    new Date(new Date().setDate(new Date().getDate() + 1))
                  }
                  // filterDate={isWeekday}
                  inline
                />
              </>
            }
            buttons={[
              {
                label: "Ok",
                onClick: () => {
                  setOpen(false);
                  setNextDate(
                    moment(new Date(dateSelected)).format("YYYY-MM-DDTHH:mm:ss")
                  );
                },
              },
            ]}
          />

          <FAEDialogueBox
            open={successOpen}
            content={content}
            buttons={[
              {
                label: "Ok",
                onClick: () => {
                  setSuccessOpen(false);
                  var initialDate = moment(bookingDate).format("YYYY-MM-DD");
                  setCookies("initialDate", initialDate);
                  history.push("/user-appointments");
                },
              },
            ]}
          />
        </div>
      )}
    </>
  );
}
