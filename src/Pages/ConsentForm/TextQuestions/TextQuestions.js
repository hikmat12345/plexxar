//libs
/* eslint-disable no-unused-vars */
import { FAETextField } from "@plexaar/components";
import React, { Fragment, useState } from "react";
import { InputBase } from "@mui/material";
//src

//css
import "./TextQuestions.scss";

const TextQuestions = ({ question, callback }) => {
  const [textValue, setTextValue] = useState(question.answer);

  return (
    <div className="text-main">
      {/* <InputBase
        placeholder="Send a message..."
        variant="standard"
        label={question.question}
        isRequired={question.isrequired}
        value={textValue}
        required={question.isrequired}
        onChange={(e) => {
          callback({ questionId: question.id, answers: [e.target.value] });
          setTextValue(e.target.value);
        }}
      /> */}

      <FAETextField
        label={question.question}
        isRequired={question.isrequired}
        required={question.isrequired}
        className="text-questions"
        placeholder="Type your answer here..."
        getValue={(value) => {
          callback({ questionId: question.id, answer: value });
          setTextValue(value);
        }}
        value={textValue}
        primary
      />
    </div>
  );
};

export default TextQuestions;
