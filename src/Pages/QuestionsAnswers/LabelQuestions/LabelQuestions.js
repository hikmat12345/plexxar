//libs
import React, { Fragment } from "react";

//src

//css
import "./LabelQuestions.css";

const LabelQuestions = ({ question }) => {
  return (
    <Fragment>
      <div className="text-questions-main-container">
        <input
          type="text"
          className="text-questions-text-area no-border bg-default padding-default no-outline"
          value={question.question}
          readOnly
        />
      </div>
    </Fragment>
  );
};

export default LabelQuestions;
