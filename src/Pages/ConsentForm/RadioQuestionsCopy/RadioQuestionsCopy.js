//libs
/* eslint-disable */
import React, { Fragment, useEffect, useState } from "react";

//src
import DocQuestions from "../DocQuestions";
import TextQuestions from "../TextQuestions";
import CheckBoxQuestions from "../CheckBoxQuestions";
import SelectQuestions from "../SelectQuestions";
import RadioQuestions from "../RadioQuestions";
import LabelQuestions from "../LabelQuestions";
import { getFileSrcFromPublicFolder, getUniqueData } from "../../../utils";

//css
import "./RadioQuestionsCopy.css";

const radio_blank = getFileSrcFromPublicFolder("check_box_blank2.png");
const radio_checked = getFileSrcFromPublicFolder("blue2_checked.png");

const RadioQuestionsCopy = ({ question, callback, subQuestionsAnswers }) => {
  const [optionValue, setOptionValue] = useState(question.answer);
  const [subQuestionsList, setSubQuestionsList] = useState([]);
  const [subAnswers, setSubAnswers] = useState([]);

  useEffect(() => {
    if (optionValue !== "") {
      setSubQuestionsList(
        question.optionList.find((option) => option.value === optionValue)
          .subQuestionList
      );
    }
    setSubAnswers([]);
  }, [optionValue, question.optionList]);

  useEffect(() => {
    if (subAnswers.length > 0) {
      subQuestionsAnswers(getUniqueData(subAnswers, "questionId"));
    }
  }, [question.id, subAnswers, subAnswers.length, subQuestionsAnswers]);

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
                    setOptionValue(option.value);
                    callback({
                      questionId: question.id,
                      answer: option.value,
                    });
                  }}
                  className="radio-questions-radio-images"
                  src={
                    option.value === optionValue ? radio_checked : radio_blank
                  }
                  alt="radio_image"
                />
              }
              {option.value}
            </div>
          ))}
        </div>
      </div>
      <div>
        {subQuestionsList.length > 0 &&
          subQuestionsList.map((question) => (
            <>
              {question.type === "RADIO" && (
                <RadioQuestions
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
            </>
          ))}
      </div>
    </Fragment>
  );
};

export default RadioQuestionsCopy;
