//libs
import React, { Children, useContext, useEffect, useState } from "react";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { FAEText, FAEButton } from "@plexaar/components";

//src
import { getCookies, objectIsEmpty, setCookies } from "../../utils";
import { UserContext } from "../../Contexts/userContext";
import history from "../../history";
import { getUserStatus } from "./actions";
import Loader from "../Loader";
import PlexaarContainer from "../PlexaarContainer";
//scss
import "./WelcomePage.scss";

const WelcomePage = () => {
  const [userId] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [useStatusResponse, setUserStatusResponse] = useState({});
  const [statusArray, setStatusArray] = useState([]);

  useEffect(() => {
    if (!objectIsEmpty(useStatusResponse)) {
      const { error, message, result, industryId } = useStatusResponse;
      if (error) {
        alert(message);
      } else {
        var customer_details = getCookies("customer_details");
        customer_details.industryId = industryId;
        setCookies("customer_details", customer_details);
        setStatusArray(result);
      }
      setUserStatusResponse({});
    }
  }, [useStatusResponse]);

  useEffect(() => {
    if (userId !== "") {
      getUserStatus({
        userId,
        callback: (res) => {
          setUserStatusResponse(res);
          setLoading(false);
        },
      });
    }
  }, [userId]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="welcome-page-welcome-units-wrapper">
          <FAEText subHeading secondary bold>
            Hi {getCookies("customer_details").firstName}
          </FAEText>
          <FAEText>Welcome on Board</FAEText>
          {Children.toArray(
            statusArray.map((status) => {
              const { id, label, isActive, isEnable, isCompleted } = status;
              return (
                <div
                  onClick={() =>
                    isEnable
                      ? id === 1
                        ? history.push({
                            pathname: "/update-profile",
                            state: { next: history.location.pathname },
                          })
                        : id === 3
                        ? history.push({
                            pathname: "/your-schedule",
                            state: { next: history.location.pathname },
                          })
                        : id === 2
                        ? history.push({
                            pathname: "/your-working-addresses",
                            state: { next: history.location.pathname },
                          })
                        : id === 4
                        ? history.push({
                            pathname: "/your-services",
                            state: { next: history.location.pathname },
                          })
                        : id === 6
                        ? history.push({
                            pathname: "/questions-answers/1",
                            state: { next: history.location.pathname },
                          })
                        : id === 9
                        ? history.push({
                            pathname: "/your-staff",
                            state: { next: history.location.pathname },
                          })
                        : ""
                      :
                      ""
                  }
                  className={`welcome-page-welcome-unit`}
                >
                  <div className="welcome-page-welcome-unit-icon-and-label">
                    <AssignmentTurnedInIcon
                      className={`welcome-page-welcome-unit-icon ${
                        !isActive && "in-active-unit-icon"
                      }`}
                    />
                    <FAEText>{label}</FAEText>
                  </div>
                  <FAEText className="welcome-page-welcome-unit-stage">
                    {isCompleted ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                    Completed
                  </FAEText>
                </div>
              );
            })
          )}
          <FAEButton onClick={() => window.location.reload(false)}>
            FINISH
          </FAEButton>
        </div>
      )}
    </>
  );
};

export default PlexaarContainer(WelcomePage);
