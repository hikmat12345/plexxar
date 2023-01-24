//libs
import React, { Fragment, useEffect, useState } from "react";
import { FAEButton } from "@plexaar/components";
import { withRouter } from "react-router-dom";

//src
import { saveAnswers } from "./actions";
import history from "../../../history";

//css
import "./ActionButtons.scss";

const ActionButtons = (props) => {
  const [finalAnswers, setFinalAnswers] = useState(false);
  const {
    answerList,
    subAnswersList,
    nextPage,
    pageNumber,
    previousPage,
    totalSteps,
    allAnswered,
  } = props;

  useEffect(() => {
    const notFinished = () => {
      // history.push(
      //   `/questions-answers/${
      //     allAnswered.find((obj) => obj.allanswered === false).step
      //   }`
      // );
      allAnswered.find((obj) => obj.allanswered === false).step === totalSteps
        ? finished()
        : history.push(
            `/questions-answers/${
              allAnswered.find((obj) => obj.allanswered === false).step
            }`
          );
    };
    const finished = () => {
      history.push("/user-status");
    };
    if (finalAnswers === true) {
      if (Array.isArray(subAnswersList) === false) {
        [...answerList, ...subAnswersList.subAnswersList].length > 0
          ? saveAnswers(
              [...answerList, ...subAnswersList.subAnswersList],
              (res) => {
                if (res.statuscode === 200) {
                  if (totalSteps === pageNumber) {
                    totalSteps === 1
                      ? finished()
                      : allAnswered.find((obj) => obj.allanswered === false) !==
                        undefined
                      ? notFinished()
                      : finished();
                  } else {
                    nextPage();
                  }
                }
              }
            )
          : totalSteps === pageNumber
          ? allAnswered.find((obj) => obj.allanswered === false) !== undefined
            ? notFinished()
            : finished()
          : nextPage();
      } else {
        [...answerList, ...subAnswersList].length > 0
          ? saveAnswers([...answerList, ...subAnswersList], (res) => {
              if (res.statuscode === 200) {
                if (totalSteps === pageNumber) {
                  totalSteps === 1
                    ? finished()
                    : allAnswered.find((obj) => obj.allanswered === false) !==
                      undefined
                    ? notFinished()
                    : finished();
                } else {
                  nextPage();
                }
              }
            })
          : totalSteps === pageNumber
          ? allAnswered.find((obj) => obj.allanswered === false) !== undefined
            ? notFinished()
            : finished()
          : nextPage();
      }
    }
    setFinalAnswers(false);
  }, [
    allAnswered,
    answerList,
    finalAnswers,
    nextPage,
    pageNumber,
    subAnswersList,
    totalSteps,
  ]);
  return (
    <Fragment>
      <div className="action-buttons-main-container">
        <div
          className={
            pageNumber > 1
              ? "text-center checkoutBtn action-buttons-container"
              : "text-center checkoutBtn action-buttons-container-page-1"
          }
        >
          {pageNumber > 1 && (
            <FAEButton
              onClick={() => {
                previousPage();
              }}
              type="submit"
            >
              {"< Back"}
            </FAEButton>
          )}
          <FAEButton
            onClick={() => {
              setFinalAnswers(true);
            }}
            type="submit"
          >
            {totalSteps === pageNumber ? "Save & Finish" : "Save & Continue >"}
          </FAEButton>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(ActionButtons);
