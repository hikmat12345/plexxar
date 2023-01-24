//libs
import React, { Fragment } from "react";

//src

//css
import "./LabelQuestions.scss";

const LabelQuestions = ({ question }) => {
  return (
    <Fragment>
      <div className="label-questions-main-container">
        <p className="label-questions-text-area no-border">
          {question.question}
        </p>
      </div>
    </Fragment>
  );
};

export default LabelQuestions;
