//libs
/* eslint-disable*/
import React, { Fragment, useEffect, useState } from "react";

//src
import DocQuestions from "../DocQuestions";
import TextQuestions from "../TextQuestions";
import CheckBoxQuestions from "../CheckBoxQuestions";
import SelectQuestions from "../SelectQuestions";
import RadioQuestionsCopy from "../RadioQuestionsCopy";
import LabelQuestions from "../LabelQuestions";
import { getFileSrcFromPublicFolder, getUniqueData } from "../../../utils";

//css
import "./RadioQuestions.css";

const radio_blank = getFileSrcFromPublicFolder("check_box_blank.png");
const radio_checked = getFileSrcFromPublicFolder("check_box_checked.png");

const RadioQuestions = ({ question, callback, subQuestionsAnswers }) => {
  const [optionValue, setOptionValue] = useState(question.answer);
  const [subQuestionsList, setSubQuestionsList] = useState([]);
  const [subAnswers, setSubAnswers] = useState([]);

  useEffect(() => {
    if (optionValue !== "") {
      setSubQuestionsList(
        question.optionlist.find((option) => option.optionvalue === optionValue)
          .subquestionlist
      );
    }
    setSubAnswers([]);
  }, [optionValue]); //question.optionlist

  useEffect(() => {
    if (subAnswers.length > 0) {
      subQuestionsAnswers({
        qid: question.qid,
        subAnswersList: getUniqueData(subAnswers, "questionId"),
      });
    }
  }, [subAnswers.length]); // subQuestionsAnswers question.qid, subAnswers,

  return (
    <Fragment>
      <div className="radio-questions-main-container">
        <div className="radio-questions-question">
          {question.question}
          <span className="required-optional-question">
            {question.isrequired === true ? " *" : ""}
          </span>
        </div>
        <div className="radio-questions-option-container">
          {question.optionlist.map((option) => (
            <div className="radio-questions-option-list">
              {
                <img
                  onClick={() => {
                    setOptionValue(option.optionvalue);
                    callback({
                      questionId: question.qid,
                      answers: [option.optionvalue],
                    });
                  }}
                  className="radio-questions-radio-images"
                  src={
                    option.optionvalue === optionValue
                      ? radio_checked
                      : radio_blank
                  }
                  alt="radio_image"
                />
              }
              {option.optionvalue}
            </div>
          ))}
        </div>
      </div>
      <div>
        {subQuestionsList.length > 0 &&
          subQuestionsList.map((question) => (
            <div>
              {question.type === "RADIO" && (
                <RadioQuestionsCopy
                  question={question}
                  callback={(answer) => setSubAnswers([answer, ...subAnswers])}
                  subQuestionsAnswers={(answers) =>
                    setSubAnswers([...answers.subAnswersList, ...subAnswers])
                  }
                />
              )}
              {(question.type === "SELECT" ||
                question.type === "PROFESSION") && (
                <SelectQuestions
                  question={question}
                  callback={(answer) => setSubAnswers([answer, ...subAnswers])}
                  subQuestionsAnswers={(answers) =>
                    setSubAnswers([...answers.subAnswersList, ...subAnswers])
                  }
                />
              )}
              {question.type === "DOC" && (
                <DocQuestions
                  question={question}
                  callback={(answer) => setSubAnswers([answer, ...subAnswers])}
                />
              )}
              {question.type === "TEXT" && (
                <TextQuestions
                  question={question}
                  callback={(answer) => setSubAnswers([answer, ...subAnswers])}
                />
              )}
              {question.type === "CHECKBOX" && (
                <CheckBoxQuestions
                  question={question}
                  callback={(answer) => setSubAnswers([answer, ...subAnswers])}
                />
              )}
              {question.type === "LABEL" && (
                <LabelQuestions question={question} />
              )}
            </div>
          ))}
      </div>
    </Fragment>
  );
};

export default RadioQuestions;
