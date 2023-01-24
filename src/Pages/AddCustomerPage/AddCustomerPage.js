//libs
/* eslint-disable */
import {
  FAEPhoneInput,
  FAEText,
  FAETextField,
  FAEButton,
  FAEDialogueBox,
  FAEAvatar,
  FAEShadowBox,
} from "@plexaar/components";
import { FAESelect } from "@plexaar/components/dist/stories/FAESelect/FAESelect";
import React, { Children, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Modal } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { animateScroll as scroll } from "react-scroll";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

//src
import { CountryDetailContext } from "../../Contexts/countryDetailContext";
import history from "../../history";
import { getCookies, objectIsEmpty, setCookies, To12Hours } from "../../utils";
import PlexaarContainer from "../PlexaarContainer";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  saveClient,
  serachClient,
  getAvailableDuration,
  addProviderBreakTime,
  searchExistingAccount,
} from "./actions";
import Loader from "../Loader";

//scss
import "./AddCustomerPage.scss";
import "../AppointmentDetailPage/Top.scss";
import { scrollToTop } from "react-scroll/modules/mixins/animate-scroll";
import moment from "moment";

const AddCustomerPage = () => {
  const location = useLocation();
  const { date, startTime, providerName } = location.state;
  const userId = getCookies("userId");
  const { businessId, isBusiness } = getCookies("customer_details");
  const { userCountryId, userCountry } = useContext(CountryDetailContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isExpertState, setIsExpertState] = useState(true);
  const [isconsultation, setIsConsultation] = useState(false);
  const [registeredCustomer, setRegisteredCustomer] = useState([]);
  const [saveClientResponse, setSaveClientResponse] = useState({});
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [modal, setModal] = useState(false);
  const [breaktime, setBreakTime] = useState("15");
  const [breaktimeDescription, setBreakTimeDescription] = useState("");
  const [breaktimeTitle, setBreakTimeTitle] = useState("");
  const [maxTime, setMaxTime] = useState(60);
  const [loading, setLoading] = useState(false);
  const [emailField, setEmailField] = useState(0);
  const [allFields, setAllFields] = useState(0);
  // useEffect(() => {
  //   scroll.scrollToTop();
  // }, [
  //   email.length == 0,
  //   firstName.length == 0,
  //   lastName.length == 0,
  //   phoneNumber.length == 0,
  // ]);
  useEffect(() => {
    var resourceId = location.state.providerId;
    var startStr = location.state.startStr;
    getAvailableDuration({
      resourceId,
      startStr,
      callback: (res) => setMaxTime(parseInt(res)),
    });
  }, []);
  useEffect(() => {
    if (!objectIsEmpty(saveClientResponse)) {
      const { code, message, response } = saveClientResponse;
      if (code !== 0) {
        alert(message);
        // to redirectPath /customer-exist for approval
        // if (code === 5) {
        //   history.push({
        //     pathname: "/customer-exist",
        //     state: {
        //       email,
        //       phoneNumber,
        //       customer: response[0],
        //       // previousDataPathName: location.pathname,
        //       previousData: location.state,
        //       isfreeConsultation: isconsultation,
        //       isExpert: response[0].isExpert,
        //     },
        //   });
        // }
      } else if (code === 0) {
        if (response[0].isExpert) {
          history.push({
            pathname: "/verify-new-customer",
            state: {
              customerId: response[0].id,
              providerId: location.state.providerId,
              providerEmail: location.state.providerEmail,
              providerAccount: location.state.accountNumber,
              customerAccount: response[0].accountNumber,
              customerEmail: response[0].email,
              customerFirstname: response[0].firstName,
              customerLastname: response[0].lastName,
              startStr: location.state.startStr,
              startTime: location.state.startTime,
              isfreeConsultation: isconsultation,
              isExpert: response[0].isExpert,
            },
          });
        } else
          history.push({
            pathname: "/provider-services",
            state: {
              customerId: response[0].id,
              providerId: location.state.providerId,
              providerEmail: location.state.providerEmail,
              providerAccount: location.state.accountNumber,
              customerAccount: response[0].accountNumber,
              customerEmail: response[0].email,
              customerFirstname: response[0].firstName,
              customerLastname: response[0].lastName,
              startStr: location.state.startStr,
              startTime: location.state.startTime,
              isfreeConsultation: isconsultation,
              isExpert: response[0].isExpert,
            },
          });
      } else {
        setOpen(true);
        setContent(message);
      }
      setSaveClientResponse({});
    }
  }, [saveClientResponse]);

  // useEffect(() => {
  //   serachClient({
  //     firstName,
  //     lastName,
  //     phoneNumber,
  //     email,
  //     businessId: isBusiness ? userId : businessId,
  //     callback: (res) => {
  //       setRegisteredCustomer(res);
  //       if (res.length > 0) {
  //         scroll.scrollTo(300);
  //       }
  //     },
  //   });
  // }, [businessId, email, lastName, phoneNumber, firstName, isBusiness, userId]);

  const searchPhone = () => {
    const searchObject = {
      phoneNumber: phoneNumber,
      businessId: isBusiness ? userId : businessId,
      email: "",
    };
    serachClient({
      searchObject,
      callback: (res) => {
        const { code, isAccountExist, accountNumber, result } = res;
        if (code === 2) {
          if (isAccountExist) {
            searchExistingAccount({
              accountNumber,
              callback: (res) => {
                const { code, result } = res;
                if (code === 0) {
                  history.push({
                    pathname: "/customer-exist",
                    state: {
                      email,
                      phoneNumber,
                      customer: result,
                      previousData: location.state,
                      isfreeConsultation: isconsultation,
                      isExpert: result.isExpert,
                    },
                  });
                }
              },
            });
          } else {
            setEmailField(1);
          }
        } else if (code === 0) {
          if (result.length === 0) {
            setEmailField(1);
          } else {
            setRegisteredCustomer(result);
          }
        }
      },
    });
  };
  const searchEmail = () => {
    const searchObject = {
      phoneNumber: "",
      businessId: isBusiness ? userId : businessId,
      email: email,
    };
    serachClient({
      searchObject,
      callback: (res) => {
        const { code, isAccountExist, accountNumber, result } = res;
        if (code === 2) {
          if (isAccountExist) {
            searchExistingAccount({
              accountNumber,
              callback: (res) => {
                const { code, result } = res;
                if (code === 0) {
                  history.push({
                    pathname: "/customer-exist",
                    state: {
                      email,
                      phoneNumber,
                      customer: result,
                      previousData: location.state,
                      isfreeConsultation: isconsultation,
                      isExpert: result.isExpert,
                    },
                  });
                }
              },
            });
          } else {
            setAllFields(1);
          }
        } else if (code === 0) {
          if (res.length === 0) {
            setAllFields(1);
          } else {
            setRegisteredCustomer(result);
          }
        }
      },
    });
  };
  const handleModal = () => {
    var providerId = location.state.providerId;
    var date = location.state.startStr;
    var startTime = location.state.startTime;
    if (breaktime < 15 || breaktime > maxTime) {
      alert("provider duration is less then your breaktime or less then 15");
    } else
      addProviderBreakTime({
        providerId,
        date,
        startTime,
        breaktime,
        breaktimeDescription,
        breaktimeTitle,
        callback: (res) => {
          if (res.code === 0) {
            alert(res.message);
            setCookies("initialDate", date);
            history.push("/user-appointments");
          } else alert(res.message);
        },
      });
  };
  console.log(location);
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    saveClient({
      email,
      phoneNumber,
      userCountryId,
      firstName,
      lastName,
      isExpertState,
      businessId: isBusiness ? userId : businessId,
      callback: (res) => setSaveClientResponse(res),
    });
    setLoading(false);
  };

  return (
    <div className="add-client-container">
      <div className="add-client-main">
        <ArrowBackIosIcon
          color="primary"
          className="cursor"
          onClick={() => {
            setCookies("initialDate", date);
            history.push("/user-appointments");
          }}
        />
        {loading && <Loader />}
        {!loading && (
          <>
            <div className="add-client-top-menu">
              <div className="detailTOpParent">
                <div className="detailTop">
                  <div className="serviceDiv">
                    <span>
                      Provider Name <KeyboardArrowDownIcon />
                    </span>
                    <h5> {providerName}</h5>
                  </div>

                  <div className="service">
                    <div className="detailItem">
                      <img src="img/icon/celender.svg" alt="celender" />
                      <h5>{moment(date).format("Do MMM YYYY")}</h5>
                    </div>
                  </div>

                  <div className="service">
                    <div className="detailItem">
                      <img src="img/icon/time.svg" alt="celender" />
                      <h5>{To12Hours(startTime)}</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="Select-type">
                <FAESelect
                  label="Consultation Type"
                  isRequired
                  values={[
                    {
                      label: "Create Booking",
                      value: false,
                    },
                    {
                      label: "Free Consultation",
                      value: true,
                    },
                    {
                      label: "Add Break",
                      value: "break",
                    },
                  ]}
                  value={isconsultation}
                  getSelectedValue={(value) => {
                    if (value == "break") {
                      setIsConsultation("break");
                      setModal(true);
                    } else {
                      setIsConsultation(value);
                    }
                  }}
                />
                <FAESelect
                  label="Client Type"
                  values={[
                    {
                      label: "Private Client",
                      value: false,
                    },
                    {
                      label: "Expert Client",
                      value: true,
                    },
                  ]}
                  value={isExpertState}
                  getSelectedValue={(e) => setIsExpertState(e)}
                />
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="fae--add-client-page-form-wrapper"
            >
              <div className="add-client-save">
                <label className="label-detail">Client Detail</label>
                <AutorenewIcon
                  color="primary"
                  className="cursor"
                  onClick={() => {
                    setEmailField(0);
                    setAllFields(0);
                    setEmail("");
                    setPhoneNumber("");
                    setFirstName("");
                    setLastName("");
                    setRegisteredCustomer([]);
                  }}
                />
                {allFields === 1 && (
                  <FAEButton className="fae--add-client-page-form-button">
                    Add Client
                  </FAEButton>
                )}
              </div>
              <div className="add-client-detail">
                <div className="customer-detail">
                  <div className="customer-search">
                    <div style={{ width: "90%" }}>
                      <FAEPhoneInput
                        // primary
                        required
                        className="customer-input"
                        defaultCountry={userCountry.toLowerCase()}
                        disableAreaCodes
                        value={phoneNumber}
                        getValue={(value) => setPhoneNumber(value)}
                        // shadowBoxProps={{
                        //   primary: true,
                        // }}
                      />
                    </div>
                    <div>
                      {emailField === 0 && (
                        <ArrowCircleRightIcon
                          color="primary"
                          className="pointer"
                          fontSize="large"
                          onClick={() => searchPhone()}
                        />
                      )}
                    </div>
                  </div>
                  {emailField === 1 && (
                    <div className="customer-search">
                      <div style={{ width: "90%" }}>
                        <FAETextField
                          placeholder="Email"
                          className="customer-input"
                          // primary
                          required
                          type="email"
                          value={email}
                          getValue={setEmail}
                          // shadowBoxProps={{
                          //   primary: true,
                          // }}
                        />
                      </div>
                      <div>
                        {allFields === 0 && (
                          <ArrowCircleRightIcon
                            color="primary"
                            className="pointer"
                            fontSize="large"
                            onClick={() => searchEmail()}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {allFields === 1 && (
                    <>
                      <div style={{ width: "90%" }}>
                        <FAETextField
                          placeholder="First Name"
                          className="customer-input"
                          required
                          type="text"
                          getValue={setFirstName}
                          // shadowBoxProps={{
                          //   primary: true,
                          // }}
                          value={firstName}
                        />
                      </div>
                      <div style={{ width: "90%" }}>
                        <FAETextField
                          placeholder="Last Name"
                          className="customer-input"
                          required
                          type="text"
                          value={lastName}
                          getValue={setLastName}
                        />
                      </div>
                    </>
                  )}
                </div>
                {registeredCustomer.length !== 0 && <hr className="line" />}
                {Children.toArray(
                  registeredCustomer.map((customer) => {
                    const {
                      firstName,
                      email,
                      id,
                      accountNumber,
                      mobile,
                      lastName,
                      isExpert,
                    } = customer;
                    return (
                      <div
                        className="pointer customer-list"
                        // padding
                        onClick={() =>
                          // isExpert
                          // ? history.push({
                          //   pathname: "/verify-new-customer",
                          //   state: {
                          //     customerId: id,
                          //     providerId: location.state.providerId,
                          //     providerEmail: location.state.providerEmail,
                          //     providerAccount: location.state.accountNumber,
                          //     customerAccount: accountNumber,
                          //     customerEmail: email,
                          //     customerFirstname: firstName,
                          //     customerLastname: lastName,
                          //     startStr: location.state.startStr,
                          //     startTime: location.state.startTime,
                          //     isfreeConsultation: isconsultation,
                          //     isExpert: isExpert,
                          //   },
                          // })
                          // :
                          history.push({
                            pathname: "/provider-services",
                            state: {
                              customerId: id,
                              providerId: location.state.providerId,
                              providerEmail: location.state.providerEmail,
                              providerAccount: location.state.accountNumber,
                              customerAccount: accountNumber,
                              customerEmail: email,
                              customerFirstname: firstName,
                              customerLastname: lastName,
                              startStr: location.state.startStr,
                              startTime: location.state.startTime,
                              isfreeConsultation: isconsultation,
                              isExpert: isExpert,
                            },
                          })
                        }
                      >
                        <div className="add-customer-page-customer-unit">
                          <FAEAvatar size="small" />
                          <div className="add-customer-page-customer-details">
                            <h5 className="customer-name">
                              {firstName ?? ""} {lastName ?? ""}
                            </h5>
                            <FAEText className="gray-text-color">
                              Account ID: {accountNumber ?? ""}
                            </FAEText>
                            <FAEText className="gray-text-color">
                              {email ?? ""}
                            </FAEText>
                            <FAEText className="gray-text-color">
                              {mobile ?? ""}
                            </FAEText>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </form>

            <FAEDialogueBox
              open={open}
              content={content}
              buttons={[
                {
                  label: "Ok",
                  onClick: () => {
                    setOpen(false);
                    setFirstName(firstName);
                    setLastName(lastName + " ");
                  },
                },
              ]}
            />

            <Modal
              className="modal-container"
              open={modal}
              onClose={() => {
                setModal(false);
              }}
            >
              <Box className="modal-box">
                <p className="modal-text">Break Time</p>
                <input
                  type="number"
                  className="modal-input"
                  value={breaktime}
                  min="15"
                  max={maxTime}
                  onChange={(e) => {
                    setBreakTime(e.target.value);
                    // if (parseInt(e.target.value) > maxTime) setBreakTime(maxTime);
                    // else if (parseInt(e.target.value) < 15) setBreakTime(15);
                    // else setBreakTime(e.target.value);
                  }}
                />
                <br />
                <FAESelect
                  label="Select Break Time"
                  values={[
                    {
                      label: "15",
                      value: "15",
                    },
                    {
                      label: "30",
                      value: "30",
                    },
                    {
                      label: "60",
                      value: "60",
                    },
                  ]}
                  value={breaktime}
                  getSelectedValue={(e) => setBreakTime(e)}
                />
                <FAETextField
                  placeholder="Break Title"
                  value={breaktimeTitle}
                  getValue={(e) => setBreakTimeTitle(e)}
                />
                <FAETextField
                  placeholder="Description"
                  value={breaktimeDescription}
                  getValue={(e) => setBreakTimeDescription(e)}
                />
                <div className="modal-btn">
                  <FAEButton
                    className="modal-btn-1"
                    onClick={() => {
                      setIsConsultation(false);
                      setModal(false);
                    }}
                  >
                    Cancel
                  </FAEButton>
                  <FAEButton onClick={handleModal}>Save</FAEButton>
                </div>
              </Box>
            </Modal>
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
        )}
      </div>
    </div>
  );
};

export default AddCustomerPage;
