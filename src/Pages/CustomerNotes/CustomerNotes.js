/* eslint-disable */
import React, { useState, useEffect } from "react";
import { FAEDialogueBox, FAEButton } from "@plexaar/components";
import ReactPlayer from "react-player";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//src
import {
  GetAppointmentDetails,
  UploadAttachments,
  SaveProviderNotes,
} from "./action";
import history from "../../history";
import "./CustomerNotes.scss";
import { getCookies, To12Hours } from "../../utils";
import { useLocation } from "react-router-dom";
import moment from "moment";

const CustomerNotes = () => {
  const location = useLocation();
  const { bookingId, notes, appDetails } = location.state;

  const userId = getCookies("userId");
  const [customerNotes, setCustomerNotes] = useState([]);
  const [expertNotes, setExpertNotes] = useState([]);
  const [expertNotesText, setExpertNotesText] = useState([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [expNotes, setExpNotes] = useState("");
  const [expertImg, setExpertImg] = useState([]);
  const [expertVid, setExpertVid] = useState([]);
  const [Minheight, setMinheight] = useState(70);
  const [redurection, setRedurection] = useState(false);

  useEffect(() => {
    GetAppointmentDetails({
      bookingId,
      callback: (res) => {
        if (res.code === 0) {
          setCustomerNotes(res.customerAttachments);
          setExpertImg(res.expertAttachments.images);
          setExpertNotesText(res.expertAttachments.notes);
          setExpertVid(res.expertAttachments.video);
          setExpertNotes(res.expertAttachments);
        } else if (res.code === 2) {
          setCustomerNotes([]);
          setExpertNotes([]);
        } else {
          setContent(res.message);
          setOpen(true);
        }
      },
    });
  }, []);

  useEffect(() => {
    GetAppointmentDetails({
      bookingId,
      callback: (res) => {
        if (res.code === 0) {
          setCustomerNotes(res.customerAttachments);
          setExpertImg(res.expertAttachments.images);
          setExpertNotesText(res.expertAttachments.notes);
          setExpertVid(res.expertAttachments.video);
          setExpertNotes(res.expertAttachments);
        } else if (res.code === 2) {
          setCustomerNotes([]);
          setExpertNotes([]);
        } else {
          setContent(res.message);
          setOpen(true);
        }
      },
    });
  }, [redurection]);

  // upload image
  const onImgChange = (imageList) => {
    var file = imageList.target.files[0];
    // console.log("file", file);
    UploadAttachments(bookingId, userId, "I", file, (res) => {
      setExpertImg(
        expertImg.concat({
          id: 0,
          filePath: res.path,
        })
      );
      if (images.length === 0) {
        setImages([
          {
            urlPath: res.path,
            fileType: "I",
          },
        ]);
      } else {
        setImages(
          images.concat({
            urlPath: res.path,
            fileType: "I",
          })
        );
      }
    });
  };
  // upload video
  const onVideoChange = (videoList) => {
    var file = videoList.target.files[0];
    UploadAttachments(bookingId, userId, "V", file, (res) => {
      setExpertVid(
        expertVid.concat({
          id: 0,
          filePath: res.path,
        })
      );
      if (videos.length === 0) {
        setVideos([
          {
            urlPath: res.path,
            fileType: "V",
          },
        ]);
      } else {
        setVideos(
          videos.concat({
            urlPath: res.path,
            fileType: "V",
          })
        );
      }
    });
  };

  const handleSave = () => {
    let attachmentList = images.concat(videos);
    var providerId = location.state.providerId;
    var momentdate = moment().format();
    var date = momentdate.split("T")[0];
    var time = momentdate.split("T")[1].substring(0, 5);
    SaveProviderNotes({
      bookingId,
      providerId,
      expNotes,
      date,
      time,
      attachmentList,
      callback: (res) => {
        setContent(res.message);
        setOpen(true);
      },
    });
  };
  const handleKeyUp = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    // In case you have a limitation
    // e.target.style.height = `${Math.min(e.target.scrollHeight, limit)}px`;
  };
  return (
    <>
      {/* Detaisl sections */}
      <div className="containerSection">
        <div className="noteHeader">
          <div className="topProfile">
            <div className="topProfileSub">
              <div className="TopSection">
                <div className="item">
                  <div className="imgDiv">
                    <img
                      onClick={() =>
                        history.push({
                          pathname: "/appointment-profile",
                          state: appDetails,
                        })
                      }
                      src={appDetails.customerImagePath ?? "img/meeting.png"}
                      alt=""
                      width="20"
                    />
                  </div>

                  <div className="text-item">
                    <h3>
                      {appDetails?.customerName}
                      {/* {eventDetail?.lastName} */}
                    </h3>
                    <span>Account ID :{appDetails?.accountNumber}</span>
                  </div>
                </div>

                <div className="createBooking">
                  <img src="img/icon/note_bg.svg" alt="create" />
                  <span>Client Notes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detailSection">
          <div className="detailTop">
            <div className="serviceDiv">
              <span>
                Service <KeyboardArrowDownIcon />
              </span>
              <h5> {appDetails.mainService}</h5>
            </div>

            <div className="service">
              <div className="detailItem">
                <img src="img/icon/celender.svg" alt="celender" />
                <h5>{moment(appDetails.bookingDate).format("Do MMM YYYY")}</h5>
              </div>
            </div>

            <div className="service">
              <div className="detailItem">
                <img src="img/icon/time.svg" alt="celender" />
                <h5>
                  {appDetails.start.split("T")[1] +
                    " to " +
                    appDetails.end.split("T")[1]}
                </h5>
              </div>
            </div>
          </div>
          {customerNotes?.images?.length !== 0 &&
            customerNotes?.video?.length !== 0 && (
              <>
                <div className="noteheading">
                  <h4>Customer Notes</h4>
                </div>

                <div className="customerNotesDetail">
                  {/* <div className="spanText">
                  {notes === "" && (
                    <span className="NotVales">
                      No customer Notes available..
                    </span>
                  )}
                  <span>{notes}</span>
                </div> */}

                  {customerNotes?.images?.length > 0 && (
                    <div className="picDiv">
                      <h4>Pictures</h4>
                      <div className="pictureDiv">
                        {customerNotes.images &&
                          customerNotes.images.map((ob) => (
                            <div className="picture">
                              <img src={ob.filePath} />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {customerNotes?.video?.length > 0 && (
                    <div className="picDiv">
                      <h4>Videos</h4>
                      <div className="pictureDiv">
                        {customerNotes.video &&
                          customerNotes.video.map((ob) => (
                            <div>
                              <ReactPlayer
                                url={ob.filePath}
                                playing={true}
                                muted={true}
                                controls={true}
                                width="230px"
                                height="160px"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
        </div>

        {/* Expert Notes */}
        <h4 className="expertheading">
          {" "}
          <img src={"img/icon/profile.svg"} alt="" width="10" /> Expert Notes
        </h4>
        <div className="detailSection">
          <div className="detailTop">
            <div className="serviceDiv">
              <h5> Notes</h5>
            </div>

            <div className="service"></div>

            <div className="service">
              <div className="expertIcon">
                <label htmlFor="imgCall">
                  <img src="img/icon/add_img.svg" alt="celender" />
                </label>
                <input
                  type="file"
                  id="imgCall"
                  hidden
                  accept=".jpg, .png, .jpeg"
                  onChange={onImgChange}
                />

                <label htmlFor="vedioCall">
                  <img src="img/icon/add_video.svg" alt="celender" />
                </label>
                <input
                  type="file"
                  hidden
                  id="vedioCall"
                  accept="video/*"
                  onChange={onVideoChange}
                />
                {/* <h5>{"11:30 To 12:00"}</h5> */}
              </div>
            </div>
          </div>
          <div className="customerNotesDetail">
            <textarea
              rows="2"
              className="form-control"
              placeholder="Expert Notes"
              onChange={(e) => {
                setExpNotes(e.target.value);
                handleKeyUp(e);
              }}
              value={expNotes}
            ></textarea>
            <div style={{ textAlign: "end", marginRight: "20px" }}>
              {" "}
              <FAEButton className="save-btn-notes" onClick={handleSave}>
                Save Notes and Attachments
              </FAEButton>
            </div>
            {expertNotesText?.length > 0 && (
              <ul className="notesList">
                {expertNotesText &&
                  expertNotesText.map((notes, i) => (
                    <div className="notesList-item">
                      <li style={{ color: "#343232" }} key={i}>
                        {notes.notes}
                      </li>
                      <div className="date-time-container">
                        <li className="date-time">{To12Hours(notes.time)}</li>
                        <li className="date-time">
                          {moment(notes.date, "YYYY-MM-DD").format(
                            "DD MMM YYYY"
                          )}
                        </li>
                      </div>
                      {/* <li key={i}></li> */}
                    </div>
                  ))}
              </ul>
            )}
            {expertImg?.length > 0 && (
              <div className="picDiv">
                <h4>Pictures</h4>
                <div className="pictureDiv">
                  {expertImg &&
                    expertImg.map((ob) => (
                      <div className="picture">
                        <img src={ob.filePath} />
                      </div>
                    ))}
                </div>
              </div>
            )}
            {expertVid?.length > 0 && (
              <div className="picDiv">
                <h4>Videos</h4>
                <div className="pictureDiv">
                  {expertVid &&
                    expertVid.map((ob) => (
                      <div className="vedio">
                        <ReactPlayer
                          url={ob.filePath}
                          playing={true}
                          muted={true}
                          controls={true}
                          width="230px"
                          height="160px"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FAEDialogueBox
        open={open}
        content={content}
        buttons={[
          {
            label: "Ok",
            onClick: () => {
              setOpen(false);
              setExpNotes("");
              setRedurection(!redurection);
              // history.goBack();
              // history.push({
              //   pathname: "/appointment-detail",
              //   state: bookingId,
              // });
            },
          },
        ]}
      />
    </>
  );
};

export default CustomerNotes;
