//libs
/* eslint-disable */
import { FAELoading, FAEText } from "@plexaar/components";
import React, { Fragment, useEffect, useState } from "react";
//src
import { getQuestions, getStatuses } from "./actions";
import UpperBar from "./UpperBar";
import NotFound from "../NotFound";
import RadioQuestions from "./RadioQuestions";
import DocQuestions from "./DocQuestions";
import TextQuestions from "./TextQuestions";
import CheckBoxQuestions from "./CheckBoxQuestions";
import SelectQuestions from "./SelectQuestions";
import ActionButtons from "./ActionButtons";
import LabelQuestions from "./LabelQuestions";
import { getFileSrcFromPublicFolder, getUniqueData } from "../../utils";
import PlexaarContainer from "../PlexaarContainer";

//css
import "./QuestionsAnswers.scss";
import history from "../../history";
import { useLocation } from "react-router-dom";
import Loader from "../Loader";

const loaderImage = getFileSrcFromPublicFolder("loader.webm");

const QuestionsAnswers = (props) => {
  const location = useLocation();
  const { userId, next } = location.state;
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFound, setDataFound] = useState("");
  const [answers, setAnswers] = useState([]);
  const [subAnswers, setSubAnswers] = useState([]);
  const [subAnwersFinal, setSubAnswersFinal] = useState([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [allAnswered, setAllAnswered] = useState([]);

  useEffect(() => {
    setLoading(true);
    setQuestionsList([]);
    setAnswers([]);
    setSubAnswers([]);
    getQuestions(parseInt(window.location.pathname.split("/")[2]), (res) => {
      if (res.statuscode === 200) {
        setLoading(false);
        setQuestionsList(res.questionlist);
        setAllAnswered(res.answeredsteps);
        setDataFound(true);
        setTotalSteps(res.totalsteps);
      } else {
        setLoading(false);
        setDataFound(false);
        setQuestionsList([]);
      }
    });
  }, [window.location.pathname]);

  const finished = () => {
    next === "/staff-onboard"
      ? history.push({
          pathname: "/staff-onboard",
          state: { userId },
        })
      : history.push({
          pathname: "/staff-user-status",
          state: { userId },
        });
  };

  useEffect(() => {
    if (subAnswers.length !== 0) {
      setSubAnswersFinal(
        getUniqueData(subAnswers, "qid").reduce((acc, curr) =>
          acc.subAnswersList.concat(curr.subAnswersList)
        )
      );
    }
  }, [subAnswers.length]); //subAnswers
  return (
    <div className="question-ans-main">
      <div className="section-padding container question-ans-inside">
        {/* <div className="page-logo">
          <img
            src={getFileSrcFromPublicFolder("/plexaar_logo.png")}
            width="140px"
          />
        </div> */}
        <FAEText bold subHeading style={{ textAlign: "center" }}>
          More Information
        </FAEText>
        <UpperBar
          totalSteps={totalSteps}
          pageNumber={parseInt(window.location.pathname.split("/")[2])}
          allAnswered={allAnswered}
        />
        {loading === true && <Loader/>}
        {dataFound === false && <NotFound message={"No questions found"} />}
        <div className="questions-answers-main-container">
          <div className="back-arrow">
            <img
              src="/onboard/arrow-back.svg"
              width="40px"
              style={{ cursor: "pointer" }}
              onClick={finished}
            />
          </div>
          {dataFound === true &&
            questionsList.map((question) => (
              <div className="questions-answers-questions-container">
                {(question.type === "SELECT" ||
                  question.type === "PROFESSION") && (
                  <SelectQuestions
                    question={question}
                    callback={(answer) => setAnswers([answer, ...answers])}
                    subQuestionsAnswers={(answers) =>
                      setSubAnswers([answers, ...subAnswers])
                    }
                  />
                )}
                {question.type === "RADIO" && (
                  <RadioQuestions
                    question={question}
                    callback={(answer) => setAnswers([answer, ...answers])}
                    subQuestionsAnswers={(answers) =>
                      setSubAnswers([answers, ...subAnswers])
                    }
                  />
                )}
                {question.type === "DOC" && (
                  <DocQuestions
                    question={question}
                    callback={(answer) => setAnswers([answer, ...answers])}
                  />
                )}
                {question.type === "TEXT" && (
                  <TextQuestions
                    question={question}
                    callback={(answer) => setAnswers([answer, ...answers])}
                  />
                )}
                {question.type === "CHECKBOX" && (
                  <CheckBoxQuestions
                    question={question}
                    callback={(answer) => setAnswers([answer, ...answers])}
                  />
                )}
                {question.type === "LABEL" && (
                  <LabelQuestions question={question} />
                )}
              </div>
            ))}
        </div>
        <ActionButtons
          allAnswered={allAnswered}
          totalSteps={totalSteps}
          answerList={getUniqueData(answers, "questionId")}
          subAnswersList={subAnwersFinal}
          pageNumber={parseInt(window.location.pathname.split("/")[2])}
          nextPage={() => {
            history.push({
              pathname: `/staff-questions-answers/${
                parseInt(window.location.pathname.split("/")[2]) + 1
              }`,
              state: { userId, next },
            });
          }}
          previousPage={() => {
            history.push({
              pathname: `/staff-questions-answers/${
                parseInt(window.location.pathname.split("/")[2]) - 1
              }`,
              state: { userId, next },
            });
          }}
        />
      </div>
    </div>
  );
};

export default QuestionsAnswers;
