import React, { useState, useEffect } from "react";
import PlexaarContainer from "../PlexaarContainer";
import { useLocation } from "react-router-dom";
import Loader from "../Loader";

//src
import { VerifyAddClientSMSCode } from "./actions";
import { FAECodeInput } from "@plexaar/components/dist/stories/FAECodeInput/FAECodeInput";
import history from "../../history";
import { FAEText } from "@plexaar/components/dist/stories/FAEText/FAEText";

const VerifyCustomer = () => {
  const location = useLocation();
  const [code, setCode] = useState("");
  const { customerId } = location.state;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (code.length === 6) {
      setLoading(true);
      VerifyAddClientSMSCode({
          customerId,
          code,
          callback: (res) => {
            console.log("new",res)
            setLoading(false);
            res.statusCode !== 0 ? alert(res.message) : history.push(
                {
                    pathname: '/provider-services',
                    state : location.state
                }
            )
          },
        });
    }
  }, [code, customerId, location.state]);
  return <>
  {loading && <Loader />}
  {
    !loading &&
    <>
    <FAEText subHeading>Enter verification code sent to the customer </FAEText>
    <FAECodeInput getValue={setCode} />
    </>
  }
  </>;
};
export default PlexaarContainer(VerifyCustomer);
