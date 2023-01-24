//libs
/* eslint-disable */
import { FAELoading } from "@plexaar/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";

//src
import NotFound from "../NotFound";
import RadioQuestions from "./RadioQuestions";
import DocQuestions from "./DocQuestions";
import TextQuestions from "./TextQuestions";
import CheckBoxQuestions from "./CheckBoxQuestions";
import SelectQuestions from "./SelectQuestions";
import LabelQuestions from "./LabelQuestions";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GirlIcon from "@mui/icons-material/Girl";
import BoyIcon from "@mui/icons-material/Boy";
import { FAEDialogueBox, FAEText, FAEButton } from "@plexaar/components";
import { getFileSrcFromPublicFolder, getUniqueData } from "../../utils";

//css
import "./QuestionsAnswers.scss";
import history from "../../history";
import { useLocation } from "react-router-dom";
import {
  GetConsentForm,
  SaveConsent,
  SaveSignatureConsent,
  UpdatePersonalInfo,
} from "./actions";
import { Button, TextField } from "@mui/material";
import { UserContext } from "../../Contexts/userContext";
import moment from "moment";

const loaderImage = getFileSrcFromPublicFolder("loader.webm");

const QuestionsAnswers = (props) => {
  const [userId, setUserId] = useContext(UserContext);
  const location = useLocation();
  const { bookingId, sessionId, cartId, serviceId, bookingDetail } =
    location.state;
  const [questionsList, setQuestionsList] = useState([]);
  const [allList, setAllList] = useState({});
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataFound, setDataFound] = useState("");
  const [answers, setAnswers] = useState([]);
  const [subAnswers, setSubAnswers] = useState([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [signOpen, setSignOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
  });
  const signRef = useRef();

  useEffect(() => {
    setLoading(true);
    setQuestionsList([]);
    setAnswers([]);
    setSubAnswers([]);
    GetConsentForm({
      serviceId,
      bookingId,
      sessionId,
      callback: (res) => {
        if (res.statusCode === 0) {
          let answerslist = [];
          let subAnswerslist = [];
          setLoading(false);
          setAllList(res);
          setCustomerForm({
            firstName: res.firstName,
            lastName: res.lastName,
            gender: res.gender,
            dob: res.dob,
          });
          setSignature(res.signatureUrl !== null ? res.signatureUrl : "");
          setQuestionsList(res.questionList);
          res.questionList.map((question) => {
            answerslist.push({
              questionId: question.id,
              answer: question.answer,
            });
            if (question.hasSubQsuestions) {
              question.optionList.map((sub) => {
                sub.subQuestionList[0] &&
                  answerslist.push({
                    questionId: sub.subQuestionList[0].id,
                    answer: sub.subQuestionList[0].answer,
                  });
              });
            }
          });
          setAnswers(answerslist);
          // setSubAnswers(subAnswerslist);
          // setAllAnswered(res.answeredsteps);
          setDataFound(true);
          // setTotalSteps(res.totalsteps);
        } else {
          setLoading(false);
          setDataFound(false);
          setQuestionsList([]);
        }
      },
    });
  }, []);
  console.log(location);
  // useEffect(() => {
  //   if (subAnswers.length !== 0) {
  //     setSubAnswersFinal(
  //       getUniqueData(subAnswers, "questionId").reduce((acc, curr) =>
  //         acc.subAnswersList.concat(curr.subAnswersList)
  //       )
  //     );
  //   }
  // }, [subAnswers.length]); //subAnswers
  const handleSubmit = () => {
    setLoading(true);

    //update customer profile
    UpdatePersonalInfo({
      customerId: bookingDetail.customerId,
      customerForm,
      customerEmail: bookingDetail.customerEmail,
      callback: (res) => console.log(res),
    });

    let final = [];
    if (subAnswers.length > 0) {
      subAnswers.map(
        (ans) =>
          // final.push()
          (final = [
            { questionId: ans[0].questionId, answer: ans[0].answer },
          ].concat(answers))
      );
    } else {
      final = answers;
    }
    final = getUniqueData(final, "questionId");
    var momentdate = moment().format();
    var consentDate = momentdate.split("T")[0];
    var consentTime = momentdate.split("T")[1].substring(0, 5);
    signature !== ""
      ? SaveConsent({
          cartId,
          bookingId,
          sessionId,
          customerId: bookingDetail.customerId,
          signatureImageUrl: signature,
          consentDate,
          consentTime,
          final,
          callback: (res) => {
            const { statusCode, message } = res;
            if (statusCode === 0) {
              setContent(message);
              setOpen(true);
            } else {
              alert(message);
            }
          },
        })
      : alert("sign the consent first");
    setLoading(false);
  };

  function dataURLtoFile(dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    var filename =
      "signature" + Math.floor(Math.random() * 999) + "." + mime.split("/")[1];
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  return (
    <>
      {dataFound === false && <p className="no-question">No questions found</p>}
      {/* <NotFound message={"No questions found"} /> */}
      {dataFound && (
        <>
          <div className="consent-form-main">
            <div className="topProfile">
              <div className="topProfileSub">
                <div className="TopSection">
                  <div className="item">
                    <div className="imgDiv">
                      <img
                        onClick={() =>
                          history.push({
                            pathname: "/appointment-profile",
                            state: bookingDetail,
                          })
                        }
                        src={
                          bookingDetail.customerImagePath ?? "img/meeting.png"
                        }
                        alt=""
                        width="20"
                      />
                    </div>

                    <div className="text-item">
                      <h3>
                        {bookingDetail?.customerName}
                        {/* {eventDetail?.lastName} */}
                      </h3>
                      <span>Account ID :{bookingDetail?.accountNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="top-consent-container">
              <div className="top-consent-detail">
                <div className="consent-row">
                  <div className="consent-name">
                    <div className="name-head">
                      <FAEText>First name</FAEText>
                      <KeyboardArrowDownIcon
                        color="primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          document.getElementById("firstName").focus();
                        }}
                      />
                    </div>
                    <TextField
                      id="firstName"
                      // label="Standard"
                      variant="standard"
                      disabled={allList.firstName === "" ? false : true}
                      value={customerForm.firstName}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          firstName: e.target.value,
                        })
                      }

                      // onFocus={() => {
                      //   document.getElementById(
                      //     "firstName"
                      //   ).style.borderBottom = "1px solid blue";
                      // }}
                    />
                    {/* <FAEText>{allList?.firstName}</FAEText> */}
                  </div>
                  <div className="consent-name">
                    <div className="name-head">
                      <FAEText>DOB</FAEText>
                      <KeyboardArrowDownIcon
                        color="primary"
                        style={{ cursor: "pointer" }}
                        // onClick={() => {
                        //   document.getElementById("dob").focus();
                        // }}
                      />
                    </div>
                    <TextField
                      id="dob"
                      type="date"
                      variant="standard"
                      disabled={allList.dob === "" ? false : true}
                      value={customerForm.dob}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          dob: e.target.value,
                        })
                      }
                      // onFocus={() => {
                      //   document.getElementById("dob").style.borderBottom =
                      //     "1px solid blue";
                      // }}
                    />
                  </div>
                </div>
                <div className="consent-row">
                  <div className="consent-name">
                    <div className="name-head">
                      <FAEText>Last name</FAEText>
                      <KeyboardArrowDownIcon
                        color="primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          document.getElementById("lastName").focus();
                        }}
                      />
                    </div>
                    <TextField
                      id="lastName"
                      // label="Standard"
                      variant="standard"
                      disabled={allList.lastName === "" ? false : true}
                      value={customerForm.lastName}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="consent-name">
                    <FAEText style={{ marginBottom: "7px" }} secondary>
                      Gender
                    </FAEText>
                    <div className="customer-gender-main">
                      <div className="gender">
                        <BoyIcon
                          onClick={() =>
                            allList.gender === "" &&
                            setCustomerForm({ ...customerForm, gender: "male" })
                          }
                          className={`round-gender-icon ${
                            customerForm.gender.toLowerCase() === "male"
                              ? "primary-backColor"
                              : "secondary-backColor"
                          }`}
                        />{" "}
                        <FAEText>Male</FAEText>
                      </div>
                      <div className="gender">
                        <GirlIcon
                          onClick={() =>
                            allList.gender === "" &&
                            setCustomerForm({
                              ...customerForm,
                              gender: "female",
                            })
                          }
                          className={`round-gender-icon ${
                            customerForm.gender.toLowerCase() === "female"
                              ? "primary-backColor"
                              : "secondary-backColor"
                          }`}
                        />{" "}
                        <FAEText>Female</FAEText>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loading && (
              <FAELoading
                loaderImage={loaderImage}
                type="video"
                height="200px"
              />
            )}
            {!loading && (
              <div className="consent-questions">
                <div
                  style={{ width: "100%" }}
                  className="section-padding container"
                >
                  <div className="questions-answers-main-container">
                    {dataFound === true && (
                      <>
                        {questionsList.map((question) => (
                          <>
                            {(question.type === "SELECT" ||
                              question.type === "PROFESSION") && (
                              <SelectQuestions
                                question={question}
                                callback={(answer) =>
                                  setAnswers([answer, ...answers])
                                }
                                subQuestionsAnswers={(answers) =>
                                  setSubAnswers([answers, ...subAnswers])
                                }
                              />
                            )}
                            {question.type === "RADIO" && (
                              <RadioQuestions
                                question={question}
                                callback={(answer) =>
                                  setAnswers([answer, ...answers])
                                }
                                subQuestionsAnswers={(answers) =>
                                  setSubAnswers([answers, ...subAnswers])
                                }
                              />
                            )}
                            {question.type === "DOC" && (
                              <DocQuestions
                                question={question}
                                callback={(answer) =>
                                  setAnswers([answer, ...answers])
                                }
                              />
                            )}
                            {question.type === "TEXT" && (
                              <TextQuestions
                                question={question}
                                callback={(answer) =>
                                  setAnswers([answer, ...answers])
                                }
                              />
                            )}
                            {question.type === "CHECKBOX" && (
                              <CheckBoxQuestions
                                question={question}
                                callback={(answer) =>
                                  setAnswers([answer, ...answers])
                                }
                              />
                            )}
                          </>
                        ))}
                        <hr className="line-label-head" />
                        {questionsList.map(
                          (question) =>
                            //className="questions-answers-questions-container"
                            question.type === "LABEL" && (
                              <LabelQuestions question={question} />
                            )
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="signature-consent">
                  <img
                    src={signature}
                    // alt="signature"
                    width="300px"
                    height="250px"
                  />
                  {signature === "" ? (
                    <Button
                      onClick={() => setSignOpen(true)}
                      variant="outlined"
                    >
                      Tap here to Sign
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            {!loading && (
              <FAEButton
                className="consent-save-btn"
                onClick={handleSubmit}
                type="button"
              >
                Save and Continue
              </FAEButton>
            )}
          </div>
          <FAEDialogueBox
            open={open}
            content={content}
            buttons={[
              {
                label: "Ok",
                onClick: () => {
                  setOpen(false);
                  history.goBack();
                },
              },
            ]}
          />
          <FAEDialogueBox
            open={signOpen}
            content={
              <>
                <SignaturePad
                  ref={signRef}
                  onChange={(e) => console.log(e)}
                  canvasProps={{ width: "300", height: "300" }}
                />
              </>
            }
            buttons={[
              {
                label: "Clear",
                onClick: () => {
                  signRef.current.clear();
                },
              },
              {
                label: "Save",
                onClick: () => {
                  var file = dataURLtoFile(signRef.current.toDataURL());
                  SaveSignatureConsent(file, (res) => {
                    const { code, message, path } = res;
                    if (code === 0) {
                      setSignOpen(false);
                      setSignature(path);
                      setSignOpen(false);
                    } else {
                      setSignOpen(false);
                      alert(message);
                    }
                  });
                },
              },
            ]}
          />
        </>
      )}
    </>
  );
};

export default QuestionsAnswers;
