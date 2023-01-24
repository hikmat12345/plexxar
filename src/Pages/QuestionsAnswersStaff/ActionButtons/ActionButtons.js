//libs
import React, { Fragment, useEffect, useState } from "react";
import { FAEButton } from "@plexaar/components";
import { withRouter } from "react-router-dom";

//src
import { saveAnswers } from "./actions";
import history from "../../../history";

//css
import "./ActionButtons.scss";
import { useLocation } from "react-router-dom";

const ActionButtons = (props) => {
  const location = useLocation();
  const { userId, next } = location.state;
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
      allAnswered.find((obj) => obj.allanswered === false).step === totalSteps
        ? finished()
        : history.push({
            pathname: `/staff-questions-answers/${
              allAnswered.find((obj) => obj.allanswered === false).step
            }`,
            state: { userId, next },
          });
    };
    const finished = () => {
      next === "/staff-onboard"
        ? history.push({
            pathname: "/staff-onboard",
            state: { userId },
          })
        : history.push({
            pathname: "/staff-user-status",
            state: { userId },
          });
    };
    if (finalAnswers === true) {
      if (Array.isArray(subAnswersList) === false) {
        [...answerList, ...subAnswersList.subAnswersList].length > 0
          ? saveAnswers(
              [...answerList, ...subAnswersList.subAnswersList],
              (res) => {
                if (res.statuscode === 200) {
                  if (totalSteps === pageNumber) {
                    allAnswered.find((obj) => obj.allanswered === false) !==
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
                  allAnswered.find((obj) => obj.allanswered === false) !==
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
    next,
    userId,
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
            <FAEButton onClick={() => previousPage()} type="button">
              {"< Back"}
            </FAEButton>
          )}
          <FAEButton
            onClick={() => {
              setFinalAnswers(true);
            }}
            type="button"
          >
            {totalSteps === pageNumber
              ? "Save and Finish"
              : "Save and Continue >"}
          </FAEButton>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(ActionButtons);
