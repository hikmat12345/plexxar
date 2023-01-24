//libs
/* eslint-disable  */
import React, { Fragment, useEffect, useState } from "react";

//src
import { getFileSrcFromPublicFolder } from "../../../utils";

//css
import "./CheckBoxQuestions.css";

const check_box_blank = getFileSrcFromPublicFolder("check_box_blank.png");
const check_box_checked = getFileSrcFromPublicFolder("check_box_checked.png");

const CheckBoxQuestions = ({ question, callback }) => {
  const [answerArray, setAnswerArray] = useState(question.answer.split(","));
  useEffect(() => {
    if (answerArray.length === 0) {
      setAnswerArray([]);
    }
    if (answerArray.length === 1) {
      if (answerArray[0] === "") {
        setAnswerArray([]);
      }
    }
  }, []);
  useEffect(() => {
    callback({ questionId: question.id, answer: answerArray.join(",") });
  }, [answerArray]); //, answerArray.length, callback, question.qid

  return (
    <Fragment>
      <div className="check-box-questions-main-container">
        <div className="check-box-questions-question">
          {question.question}{" "}
          <span className="required-optional-question">
            {question.isrequired === true ? "(required)" : "(optional)"}
          </span>
        </div>
        <div className="check-box-questions-option-container">
          {question.optionList.map((option) => (
            <div className="check-box-option-list">
              <img
                className="check-box-questions-check-box-images"
                onClick={() =>
                  answerArray.find((answer) => answer === option.value) ===
                  undefined
                    ? setAnswerArray([...answerArray, option.value])
                    : setAnswerArray(
                        answerArray.filter((answer) => answer !== option.value)
                      )
                }
                src={
                  answerArray.find((answer) => answer === option.value) ===
                  option.value
                    ? check_box_checked
                    : check_box_blank
                }
                alt="check_box_image"
              />
              {option.value}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default CheckBoxQuestions;
