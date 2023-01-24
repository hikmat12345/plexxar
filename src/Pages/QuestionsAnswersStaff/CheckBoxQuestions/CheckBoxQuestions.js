//libs
/* eslint-disable */
import React, { Fragment, useEffect, useState } from "react";

//src
import { getFileSrcFromPublicFolder } from "../../../utils";

//css
import "./CheckBoxQuestions.css";

const check_box_blank = getFileSrcFromPublicFolder("check_box_blank.png");
const check_box_checked = getFileSrcFromPublicFolder("check_box_checked.png");

const CheckBoxQuestions = ({ question, callback }) => {
  const [answerArray, setAnswerArray] = useState(question.answer);
  useEffect(() => {
    if (answerArray.length === 0) {
      setAnswerArray([""]);
    }
    callback({ questionId: question.qid, answers: answerArray });
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
          {question.optionlist.map((option) => (
            <div className="check-box-option-list">
              <img
                className="check-box-questions-check-box-images"
                onClick={() =>
                  answerArray.find(
                    (answer) => answer === option.optionvalue
                  ) === undefined
                    ? setAnswerArray([...answerArray, option.optionvalue])
                    : setAnswerArray(
                        answerArray.filter(
                          (answer) => answer !== option.optionvalue
                        )
                      )
                }
                src={
                  answerArray.find(
                    (answer) => answer === option.optionvalue
                  ) === option.optionvalue
                    ? check_box_checked
                    : check_box_blank
                }
                alt="check_box_image"
              />
              {option.optionvalue}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default CheckBoxQuestions;
