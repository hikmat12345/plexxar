//libs
import { FAETextField } from "@plexaar/components";
import React, { Fragment, useState } from "react";

//src

//css
import "./TextQuestions.scss";

const TextQuestions = ({ question, callback }) => {
  const [textValue, setTextValue] = useState(question.answer);
  return (
    <Fragment>
      <FAETextField
        label={question.question}
        isRequired={question.isrequired}
        required={question.isrequired}
        placeholder="Type your answer here..."
        getValue={(value) => {
          callback({ questionId: question.qid, answers: [value] });
          setTextValue(value);
        }}
        value={textValue}
        primary
      />
      {/* <div className="text-questions-main-container">
        <div className="text-questions-question">
          {question.question}{" "}
          <span className="required-optional-question">
            {question.isrequired === true ? "(required)" : "(optional)"}
          </span>
        </div>
        <input
          type="text"
          className="fae--text-field-container"
          placeholder="Type your answer here..."
          onChange={(e) => {
            callback({ questionId: question.qid, answers: [e.target.value] });
            setTextValue(e.target.value);
          }}
          value={textValue}
        />
      </div> */}
    </Fragment>
  );
};

export default TextQuestions;
