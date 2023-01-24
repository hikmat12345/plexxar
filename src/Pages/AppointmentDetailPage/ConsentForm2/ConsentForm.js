import {
  FAEText,
  FAETextField,
  FAEButton,
  FAECheckBoxGroup,
  FAERadioGroup,
  FAESelect,
} from "@plexaar/components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PlexaarContainer from "../../PlexaarContainer";

//src
import "./ConsentForm.scss";
import { GetConsentForm, UploadConsentForm } from "../action";
import { getUniqueData } from "../../../utils";
import history from "../../../history";

const ConsentForm = () => {
  const location = useLocation();
  console.log(location);
  const { bookingId, sessionId, cartId, serviceId } = location.state;
  const [form, setForm] = useState([]);
  const [consent, setConsent] = useState([]);
  const [message, setMessage] = useState("");
  const [code, setCode] = useState(0);
  useEffect(() => {
    GetConsentForm({
      serviceId,
      bookingId,
      sessionId,
      callback: (res) => {
        console.log(res);
        // const { code, message, bookingConsent } = res;
        // code === 0
        //   ? setConsent(bookingConsent)
        //   : code === 2
        //   ? setMessage(message)
        //   : alert(message);
      },
    });
  }, []);

  // const onImgChange = (e) => {
  //   var file = e.target.files[0];
  //   UploadConsentForm(eventId, file, (res) => {
  //     if(res.length > 0){
  //       if(res[0].code != 0){
  //         alert(res[0].message)
  //       }
  //       else{
  //         alert(res[0].message)
  //         history.goBack()
  //       }
  //     }
  //   })
  // }
  const handleForm = () => {
    console.log("Form", form);
  };
  return (
    <>
      <FAEText subHeading bold>
        Consent Form
      </FAEText>
      {consent.length > 0 ? (
        <div className="consent-form-main">
          {consent.map((obj) => (
            <>
              <div className="service-attributes-list-container">
                <div key={obj.id}>
                  {obj.type.replace(/\s/g, "").toUpperCase() === "TEXT" && (
                    <FAETextField
                      label={obj.question}
                      placeholder="Type your answer here..."
                      getValue={(value) => {
                        setForm(
                          getUniqueData(
                            [{ id: obj.attributeID, value: value }, ...form],
                            "id"
                          )
                        );
                      }}
                      //value={textValue.value}
                      primary
                    />
                  )}
                  {(obj.type.replace(/\s/g, "").toUpperCase() === "SELECT" ||
                    obj.type.replace(/\s/g, "").toUpperCase() ===
                      "PROFESSION") && (
                    <FAESelect
                      label={obj.question}
                      values={[
                        { label: "None", value: "" },
                        ...obj.options.map((option) => {
                          return {
                            label: option.value,
                            value: option.value,
                          };
                        }),
                      ]}
                      getSelectedValue={(value) => {
                        setForm(
                          getUniqueData(
                            [{ id: obj.attributeID, value: value }, ...form],
                            "id"
                          )
                        );
                      }}
                      primary
                    />
                  )}
                  {obj.type.replace(/\s/g, "").toUpperCase() === "RADIO" && (
                    <FAERadioGroup
                      label={obj.question}
                      values={[
                        { label: "None", value: "" },
                        ...obj.options.map((option) => {
                          return {
                            label: option.value,
                            value: option.value,
                          };
                        }),
                      ]}
                      getSelectedValue={(value) => {
                        setForm(
                          getUniqueData(
                            [{ id: obj.attributeID, value: value }, ...form],
                            "id"
                          )
                        );
                      }}
                      primary
                    />
                  )}
                  {obj.type.replace(/\s/g, "").toUpperCase() === "CHECKBOX" && (
                    <FAECheckBoxGroup
                      label={obj.question}
                      values={[
                        ...obj.options.map((option) => {
                          return {
                            label: option.value,
                            value: option.value,
                          };
                        }),
                      ]}
                      getSelectedValues={(value) => {
                        setForm(
                          getUniqueData(
                            [
                              {
                                id: obj.attributeID,
                                value: value.toString(),
                              },
                              ...form,
                            ],
                            "id"
                          )
                        );
                      }}
                      primary
                    />
                  )}
                </div>
                <br />
              </div>
              <FAEButton onClick={handleForm}>Save</FAEButton>
              {/* <FAEText className="consent-question">{obj.question}</FAEText>
              <FAEText className="consent-answer">{obj.answer}</FAEText> */}
            </>
          ))}
        </div>
      ) : (
        <FAEText>no data found!</FAEText>
      )}
      {/* <br/>
      <FAEText subHeading bold>Upload Consent Form</FAEText>
      <FAETextField
        type="file"
        primary
        accept=".jpg, .png, .jpeg"
        onChange={onImgChange}
        disabled={false}
        onClick={() => console.log("clik")}

      /> */}
    </>
  );
};
export default PlexaarContainer(ConsentForm);
