//libs
import React, { Fragment } from "react";
import { useLocation, withRouter } from "react-router-dom";

//src

//css
import "./UpperBar.css";

const UpperBar = (props) => {
  const location = useLocation();
  const { userId, next } = location.state;
  const { pageNumber, totalSteps, allAnswered, history } = props;
  return (
    <Fragment>
      <div className="upper-bar-container">
        {new Array(totalSteps).fill(totalSteps).map((page, index) => (
          <div className="upper-bar-pages-container">
            <div
              onClick={() =>
                history.push({
                  pathname: `/staff-questions-answers/${index + 1}`,
                  state: { userId, next },
                })
              }
              className={
                pageNumber === index + 1
                  ? "upper-bar-pages-title border-blue"
                  : allAnswered.find((obj) => obj.step === index + 1) !==
                      undefined &&
                    allAnswered.find((obj) => obj.step === index + 1)
                      .allanswered === true
                  ? "upper-bar-pages-title border-green"
                  : "upper-bar-pages-title border-red"
              }
            >
              {index + 1}
            </div>
            {totalSteps > index + 1 && (
              <span className="upper-bar-pages-right-line"></span>
            )}
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default withRouter(UpperBar);
