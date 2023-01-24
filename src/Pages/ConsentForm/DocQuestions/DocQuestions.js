//libs
/* eslint-disable  */
import React, { Fragment, useEffect, useState } from "react";
import { FAELoading } from "@plexaar/components";

//src
import { SaveSignatureConsent } from "../actions";
import { getFileSrcFromPublicFolder } from "../../../utils";

//css
import "./DocQuestions.css";

const loaderImage = getFileSrcFromPublicFolder("loader.webp");
// const upload_image = getFileSrcFromPublicFolder("upload_file_btn.png");
const DocQuestions = ({ question, callback }) => {
  const [preview, setPreview] = useState(question.answer);
  const [image, setImage] = useState("");
  const [loader, setLoader] = useState(false);

  const uploadFile = (e) => {
    e.preventDefault();
    setImage(e.target.files[0]);
    setLoader(true);
  };
  // console.log("pre", preview, question);
  useEffect(() => {
    if (image !== "") {
      SaveSignatureConsent(image, (res) => {
        const { code, message, path } = res;
        if (code === 0) {
          callback({ questionId: question.id, answer: path });
          setPreview(path);
          setLoader(false);
        } else {
          setLoader(false);
          setPreview("");
          alert(message);
        }
      });
    }
  }, [image]); //callback, question.id removed as useeffect was going in infinite loop
  return (
    <>
      <div className="docBlock">
        <div className="add-document-description-block doc-questions-main-container">
          <div className="add-document-upload-text-style">
            {question.question}{" "}
            <span className="required-optional-question">
              {question.isrequired === true ? "(required)" : "(optional)"}
            </span>
          </div>
          {preview !== "" && preview !== null ? (
            <div style={{ position: "relative", padding: "10px 0" }}>
              {loader === true && (
                <FAELoading loaderImage={loaderImage} small type="video" />
              )}
              {loader === false && (
                <Fragment>
                  {preview.substr(preview.lastIndexOf(".") + 1) !== "jpg" &&
                  preview.substr(preview.lastIndexOf(".") + 1) !== "jpeg" &&
                  preview.substr(preview.lastIndexOf(".") + 1) !== "png" ? (
                    <a target="_blank" href={preview} rel="noreferrer">
                      <div className="doc-questions-non-image-files">
                        <img
                          src={getFileSrcFromPublicFolder(
                            "download_button.png"
                          )}
                          width="50px"
                          height="50px"
                          alt="doc_img"
                        />
                        Download .{preview.substr(preview.lastIndexOf(".") + 1)}
                      </div>
                    </a>
                  ) : (
                    <a target="_blank" href={preview} rel="noreferrer">
                      <img
                        src={preview}
                        width="150px"
                        height="150px"
                        alt="image_doc"
                      />
                    </a>
                  )}
                  <div className="doc-questions-image-add-change">
                    <button
                      className="doc-questions-label"
                      style={{
                        background: "none",
                        outline: "none",
                        border: "none",
                      }}
                      onClick={() => {
                        document.getElementById(`${question.id}`).click();
                      }}
                    >
                      Add / Change Image
                    </button>
                    <input
                      style={{ visibility: "hidden", height: 0, width: 0 }}
                      id={`${question.id}`}
                      type="file"
                      className="form-control-file frm-field"
                      name="image"
                      accept=".jpg, .png, .jpeg"
                      onChange={(e) => e.target.value !== "" && uploadFile(e)}
                      required
                    />
                  </div>
                </Fragment>
              )}
            </div>
          ) : (
            <div className="image-upload">
              {loader === true && (
                <FAELoading loaderImage={loaderImage} small type="video" />
              )}
              {loader === false && (
                <Fragment>
                  <button
                    className="doc-question-upload-red-button"
                    onClick={() => {
                      document.getElementById(`${question.id}`).click();
                    }}
                  >
                    <div className="add-document-button-image bg-gradient doc-questions-add-document-button">
                      {/* <i
                        className="fa fa-plus doc-questions-plus-icon"
                        aria-hidden="true"
                      >
                        Upload Image
                      </i> */}
                      <p>Upload Image</p>
                    </div>
                  </button>
                  <input
                    style={{ visibility: "hidden", height: 0, width: 0 }}
                    id={`${question.id}`}
                    type="file"
                    className="form-control-file frm-field"
                    name="image"
                    accept=".jpg, .png, .jpeg"
                    onChange={(e) => uploadFile(e)}
                    required
                  />
                </Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DocQuestions;
