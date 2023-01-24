//libs
/* eslint-disable  */
import React, { Fragment, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

//src
import DocQuestions from "../DocQuestions";
import TextQuestions from "../TextQuestions";
import CheckBoxQuestions from "../CheckBoxQuestions";
import RadioQuestions from "../RadioQuestions";
import SelectQuestions from "../SelectQuestions";
import LabelQuestions from "../LabelQuestions";
import { getUniqueData } from "../../../utils";

//css
import "./SelectQuestionsCopy.css";

const SelectQuestionsCopy = ({ question, callback, subQuestionsAnswers }) => {
  const [selectedProfession, setSelectedProfession] = useState(question.answer);
  const [subQuestionsList, setSubQuestionsList] = useState([]);
  const [subAnswers, setSubAnswers] = useState([]);

  useEffect(() => {
    if (selectedProfession !== "") {
      setSubQuestionsList(
        question.optionList.find(
          (option) => option.value === selectedProfession
        ).subQuestionList
      );
    } else {
      setSubQuestionsList([]);
    }
    setSubAnswers([]);
  }, [selectedProfession]); //question.optionlist,

  useEffect(() => {
    if (subAnswers.length > 0) {
      subQuestionsAnswers(getUniqueData(subAnswers, "questionId"));
    }
  }, [subAnswers]); // question.id , subAnswers.length, subQuestionsAnswers

  return (
    <Fragment>
      <div className="select-questions-main-container">
        <div className="select-questions-question">
          {question.question}{" "}
          <span className="required-optional-question">
            {question.isrequired === true ? "(required)" : "(optional)"}
          </span>
        </div>
        <select
          className="select-questions-select"
          value={selectedProfession}
          onChange={(e) => {
            setSelectedProfession(e.target.value);
            callback({
              questionId: question.id,
              answer: e.target.value,
            });
          }}
        >
          <option value="">Please select</option>
          {question.optionList.map((option) => (
            <option value={option.value}>{option.value}</option>
          ))}
        </select>
      </div>
      <div>
        {subQuestionsList.length > 0 &&
          subQuestionsList.map((question) => (
            <div>
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
              {question.type === "RADIO" && (
                <RadioQuestions
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

export default withRouter(SelectQuestionsCopy);
