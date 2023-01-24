//libs
/* eslint-disable */
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

const radio_blank = getFileSrcFromPublicFolder("check_box_blank2.png");
const radio_checked = getFileSrcFromPublicFolder("blue2_checked.png");

const RadioQuestions = ({ question, callback, subQuestionsAnswers }) => {
  const [optionvalue, setoptionvalue] = useState(question.answer);
  const [subQuestionsList, setSubQuestionsList] = useState([]);
  const [subAnswers, setSubAnswers] = useState([]);

  useEffect(() => {
    if (optionvalue !== "") {
      setSubQuestionsList(
        question.optionList.find((option) => option.value === optionvalue)
          .subQuestionList
      );
    }
    setSubAnswers([]);
  }, [optionvalue]); //question.optionList

  useEffect(() => {
    if (subAnswers.length > 0) {
      subQuestionsAnswers(getUniqueData(subAnswers, "questionId"));
    }
  }, [subAnswers.length]); // subQuestionsAnswers question.id, subAnswers,
  return (
    <Fragment>
      <div className="radio-questions-main-container">
        <div className="radio-questions-question">
          {question.question}
          <span className="required-optional-question">
            {question.isrequired === true ? "(required)" : "(optional)"}
          </span>
        </div>
        <div className="radio-questions-option-container">
          {question.optionList.map((option) => (
            <div className="radio-questions-option-list">
              {
                <img
                  onClick={() => {
                    setoptionvalue(option.value);
                    callback({
                      questionId: question.id,
                      answer: option.value,
                    });
                  }}
                  className="radio-questions-radio-images"
                  src={
                    option.value === optionvalue ? radio_checked : radio_blank
                  }
                  alt="radio_image"
                />
              }
              {option.value}
            </div>
          ))}
        </div>
      </div>
      {subQuestionsList.length > 0 &&
        subQuestionsList.map((question) => (
          <>
            {question.type === "RADIO" && (
              <RadioQuestionsCopy
                question={question}
                callback={(answer) => setSubAnswers([answer, ...subAnswers])}
                subQuestionsAnswers={(answers) =>
                  setSubAnswers([...answers.subAnswersList, ...subAnswers])
                }
              />
            )}
            {(question.type === "SELECT" || question.type === "PROFESSION") && (
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
          </>
        ))}
    </Fragment>
  );
};

export default RadioQuestions;
