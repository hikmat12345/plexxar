//libs
/* eslint-disable */
import React, { Fragment, useState, useEffect } from "react";
import { FAESelect } from "@plexaar/components";

//src
import DocQuestions from "../DocQuestions";
import TextQuestions from "../TextQuestions";
import CheckBoxQuestions from "../CheckBoxQuestions";
import RadioQuestions from "../RadioQuestions";
import SelectQuestionsCopy from "../SelectQuestionsCopy";
import LabelQuestions from "../LabelQuestions";
import { getUniqueData } from "../../../utils";

//css
import "./SelectQuestions.css";

const SelectQuestions = ({ question, callback, subQuestionsAnswers }) => {
  const [selectedProfession, setSelectedProfession] = useState(question.answer);
  const [subQuestionsList, setSubQuestionsList] = useState([]);
  const [subAnswers, setSubAnswers] = useState([]);

  useEffect(() => {
    if (selectedProfession !== "") {
      setSubQuestionsList(
        question.optionlist.find(
          (option) => option.optionvalue === selectedProfession
        ).subquestionlist
      );
    } else {
      setSubQuestionsList([]);
    }
    setSubAnswers([]);
  }, [selectedProfession]); //question.optionlist,

  useEffect(() => {
    if (subAnswers.length > 0) {
      subQuestionsAnswers({
        qid: question.qid,
        subAnswersList: getUniqueData(subAnswers, "questionId"),
      });
    }
  },[subAnswers.length]); //question.qid, subAnswers, subAnswers.length, subQuestionsAnswers there was an error of looping and i removed this line 
  return (
    <Fragment>
      <FAESelect
        label={question.question}
        value={selectedProfession}
        isRequired={question.isrequired}
        required={question.isrequired}
        values={[
          // { label: "None", value: "" },
          ...question.optionlist.map((option) => {
            return { label: option.optionvalue, value: option.optionvalue };
          }),
        ]}
        getSelectedValue={(value) => {
          setSelectedProfession(value);
          callback({
            questionId: question.qid,
            answers: [value],
          });
        }}
        primary
      />
      {/* <div className="select-questions-main-container">
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
              questionId: question.qid,
              answers: [e.target.value],
            });
          }}
          disabled={
            question.type === "PROFESSION" &&
            parseInt(localStorage.getItem("applicationStatus")) === 3
          }
        >
          <option value="">Please select</option>
          {question.optionlist.map((option) => (
            <option value={option.optionvalue}>{option.optionvalue}</option>
          ))}
        </select>
      </div> */}
      <div>
        {subQuestionsList.length > 0 &&
          subQuestionsList.map((question) => (
            <div>
              {(question.type === "SELECT" ||
                question.type === "PROFESSION") && (
                <SelectQuestionsCopy
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

export default SelectQuestions;
