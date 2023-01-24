import React from "react";
import "./chat.scss";
import { EventBus } from "../../Services/EventBus";
import { SendMessage, uploadFile } from "./actions";
import { FAETextField } from "@plexaar/components/dist/stories/FAETextField/FAETextField";
import { FAEButton } from "@plexaar/components/dist/stories/FAEButton/FAEButton";
import { FAEText } from "@plexaar/components/dist/stories/FAEText/FAEText";
import { useDispatch } from "react-redux";
import { PlexarChatActions } from "../../Store/actions";
export const Sidebar = ({
  selected,
  counts,
  conversations = [],
  onSelect,
  profile,
}) => {
  return (
    <>
      <div className="side-one">
        <SidebarHeader profile={profile} />
        <div className="row sideBar">
          <>
            {conversations
              .sort((a, b) => b.counts - a.counts)
              .map((itm) => (
                <SideBarRow
                  active={selected?._id === itm?._id}
                  counts={counts}
                  onClick={() => onSelect(itm)}
                  conversation={itm}
                  key={itm._id}
                />
              ))}
          </>
        </div>
      </div>
    </>
  );
};

export const SideBarRow = ({ conversation, onClick, active = false }) => {
  return (
    <>
      <div
        className={`row sideBar-body ${active ? "active" : ""}`}
        style={{ borderBottom: "1px solid #568bfa" }}
        onClick={() => onClick(conversation)}
      >
        <div className="d-flex flex-row sideBar-avatar">
          <div className="avatar-icon" style={{ width: "70px" }}>
            <img
              src="https://bootdey.com/img/Content/avatar/avatar1.png"
              alt=""
            />
          </div>
          <div className="__full-width">
            <p
              style={{
                marginTop: "auto",
                marginBottom: "2px",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              {conversation.customer.name}
            </p>
            <p style={{ fontSize: "10px" }}>
              {conversation.job.title.slice(0, 19)}{" "}
              {conversation.job.title.length > 19 ? <span>...</span> : ""}
            </p>
          </div>
          {conversation.counts > 0 && (
            <div style={{ width: "30px" }}>
              <span className="badge badge-success pull-right">
                {conversation.counts}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export const SidebarHeader = ({ profile }) => {
  return (
    <>
      <div className="row heading">
        <div className="d-flex heading-avatar">
          <div className="">
            {/* <img
              style={{ width: "30px", borderRadius: "50%" }}
              src="https://bootdey.com/img/Content/avatar/avatar1.png"
              alt=""
            /> */}
            <span style={{ marginLeft: "10px" }}>{profile.name}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export const SelectedUserBar = ({
  conversation,
  avatar = "https://bootdey.com/img/Content/avatar/avatar6.png",
}) => {
  return (
    <>
      <div className="">
        <div className="d-flex flex-row heading-avatar-icon">
          <img src={avatar} alt="" />
          <a
            href="null"
            className="heading-name-meta"
            style={{
              marginRight: "auto",
              textDecoration: "none",
              color: "black",
            }}
          >
            {conversation?.customer?.name} -{" "}
            <span style={{ fontSize: "12px" }}>{conversation.job?.title}</span>
          </a>
        </div>
      </div>
    </>
  );
};

export const ProgressComponent = ({
  progress,
  shortName,
  started,
  completed,
  onCancel,
}) => {
  const onUploadCancel = () => EventBus.dispatch("upload-cancel", {});

  return (
    <>
      <div
        className="container"
        style={{
          width: "100%",
          padding: "5px",
          position: "relative",
          flexDirection: "column",
        }}
      >
        {(started || completed) && (
          <CloseIcon
            onClick={() => {
              onUploadCancel();
              onCancel();
            }}
          />
        )}
        {completed && shortName && (
          <p style={{ marginBottom: "5px" }}>{shortName}</p>
        )}
        {(started || completed) && (
          <div className="progress">
            <div
              className="progress-bar bg-success"
              style={{ width: progress + "%" }}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        )}
      </div>
    </>
  );
};

export const MessagesList = ({ messages = [], profileId = "" }) => {
  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;
  return (
    <>
      {messages.map((msg) => (
        <React.Fragment key={msg._id}>
          <Message from={msg.from !== profileId} message={msg} />
        </React.Fragment>
      ))}
      {lastMessage &&
      lastMessage.from &&
      lastMessage.status &&
      lastMessage?.from?._id === profileId &&
      lastMessage.status === 1 ? (
        <MessageSeen from={lastMessage.from?._id !== profileId} />
      ) : (
        ""
      )}
    </>
  );
};

export const Message = ({ message, from }) => {
  return (
    <>
      <div className="message-body">
        <div
          className={`col-sm-12 ${
            from ? "message-main-receiver" : "message-main-sender"
          }`}
        >
          <div className={`${from ? "receiver" : "sender"}`}>
            {/* {message.file && message.file.url && message.file?.mimeType && (
              <FileView url={message.file?.url} type={message.file?.mimeType} />
            )} */}
            {message.text && <div className="message-text">{message.text}</div>}
            <p className="message-time pull-right">
              {!from && message.status === 1 ? (
                <span style={{ fontSize: "8px" }}>seen</span>
              ) : (
                ""
              )}
              {/* {message.from} */}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export const AudioPreview = ({ url }) => {
  return (
    <audio controls>
      <source src={imageUrl(url)} type="audio/wav"></source>
    </audio>
  );
};

export const ClosableAudioPreview = ({ url, onClose }) => {
  return (
    <>
      <div
        style={{ width: "100%", position: "relative", background: "lightgray" }}
      >
        <CloseIcon onClick={() => onClose()} />
        <AudioPreview url={url} />
      </div>
    </>
  );
};

export const CloseIcon = ({ onClick }) => {
  return (
    <>
      <i
        onClick={() => onClick()}
        className="fa fa-times bg-danger"
        style={{
          position: "absolute",
          right: 0,
          top: "-8px",
          cursor: "pointer",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "white",
          boxShadow: "0px 2px 5px gray",
        }}
      >
        <CloseIconSvg size={16} />
      </i>
    </>
  );
};

export const FileView = ({ url, type = "" }) => {
  return (
    <>
      {type.includes("image") ? (
        <img style={{ width: "45%" }} src={imageUrl(url)} alt="" />
      ) : type.includes("video") ? (
        <a
          alt={url}
          key={url}
          target={"_blank"}
          href={imageUrl(url)}
          rel="noreferrer"
        >
          (
          <img
            style={{ width: "45%" }}
            src="https://d338t8kmirgyke.cloudfront.net/icons/icon_pngs/000/000/086/original/picture-multiple.png"
            alt=""
          />
          )
        </a>
      ) : type === "application/octet-stream" ? (
        <AudioPreview url={url} />
      ) : (
        <a
          alt={url}
          key={url}
          target={"_blank"}
          href={imageUrl(url)}
          rel="noreferrer"
        >
          <img
            style={{ width: "55px" }}
            src="https://www.iconpacks.net/icons/2/free-file-icon-1453-thumb.png"
            alt=""
          />
        </a>
      )}
    </>
  );
};

export const NoUserSelected = () => {
  return (
    <>
      <p
        style={{
          marginTop: "100px",
          color: "gray",
          marginBottom: "4px",
        }}
        className="text-center"
      >
        Please select a user to start conversation
      </p>
    </>
  );
};

export const RecordingStates = {
  not_started: 0,
  in_progress: 1,
  completed: 2,
  uploaded: 3,
};

export const MessageSeen = ({ from }) => {
  return (
    <>
      <div className="message-body">
        <div
          className={`col-sm-12 ${
            from ? "message-main-receiver" : "message-main-sender"
          }`}
        >
          <div
            className={`${from ? "receiver" : "sender"}`}
            style={{ background: "none" }}
          >
            <p
              style={{ fontSize: "12px", color: "#04a5d9", fontWeight: 500 }}
              className="message-time pull-right"
            >
              Read <i className="fa fa-check" style={{ color: "#04a5d9" }}></i>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// const onImageChange = () => {}
class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shortName: "",
      file: "",
      inputFile: {},
      loading: false,
      fileBtn: {},
      progress: 0,
      source: {},
      uploadCompleted: false,
      onImageChange: () => {},
    };

    this.onSentMessage = this.props.onSentMessage;
    this._handleImageChange = this._handleImageChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
    this._handleFile = this._handleFile.bind(this);
    EventBus.on("upload-cancel", () => {
      // cancel the uplaod request
      //   media.cancel(this.state.source);
    });
    // when a user sent message, the progress-bar should be hide.
    // EventBus.on("message-sent", () => {
    //   console.log("message recieved in child using even bus");
    //   this.setState({ imageShow: false });
    //   this.setState({ imagePreviewUrl: "" });
    //   this.setState({ loading: false });
    // });
  }

  onSentMessage() {
    console.log("event recieved inside child component ...");
  }

  _handleSubmit(e) {
    e.preventDefault();
  }

  _handleFile(e) {
    e.preventDefault();
    this.state.fileBtn.current?.click();
  }

  // all logic, uploading to server, displaying progressbar.
  _handleImageChange(e) {
    //   e.preventDefault();
    let reader = new FileReader();
    this.setState({ inputFile: e.target });
    this.setState({ loading: true });
    let file = e.target.files[0];
    let formData = new FormData();
    formData.append("file", file);
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
        imageShow: true,
      });
    };
    // this.setState({ ...this.state, source: axios.CancelToken.source() });
    reader.readAsDataURL(file);
    // this.props.imageUploadStarts();
    this.props.onUploadStarted();
    uploadFile(formData, this.state.source, (event) => {
      this.setState({
        ...this.state,
        progress: Math.round((100 * event.loaded) / event.total),
      });
      this.props.onProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((res) => {
        let val = res.data.data.url.split("/");
        this.setState({ ...this.state, shortName: val[val.length - 1] });
        this.setState({ ...this.state, uploadCompleted: true });
        this.props.onProgress(100);
        setTimeout(() => {
          this.props.onUploadCompleted({
            url: res.data.data.url,
            type: res.data.data.type,
            shortName: val[val.length - 1],
          });
        }, 1000);
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log("error ", err);
        this.setState({ loading: false });
        this.props.onUploadFailed();
      });
  }

  onClose() {
    this.setState({
      ...this.state,
      imageShow: false,
      loading: false,
      imagePreviewUrl: "",
      inputFile: null,
    });
    this.props.onFileRemove("");
  }

  render() {
    return (
      <>
        <span style={{ width: "50px" }} className="btn btn-outline-secondary">
          <i onClick={this._handleFile} className="fa fa-paperclip lg-fonts">
            <img
              alt=""
              src="https://icons.iconarchive.com/icons/icons8/windows-8/512/Very-Basic-Image-File-icon.png"
              style={{ width: "35px", cursor: "pointer" }}
            />
          </i>
        </span>
        {/* </button> */}
        <input
          ref={this.state.fileBtn}
          id="image--uploader--button"
          className="class--hidden"
          type="file"
          onChange={this._handleImageChange}
        />
      </>
    );
  }
}

export default ImageUpload;

//
export const imageUrl = () => "";

export const CloseIconSvg = ({ size = 35 }) => {
  return (
    <svg
      style={{ width: size + "px", height: size + "px" }}
      color="inherit"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="lc-1mpchac"
    >
      <path d="M17.4,16l5.3,5.3c0.4,0.4,0.4,1,0,1.4c-0.4,0.4-1,0.4-1.4,0L16,17.4l-5.3,5.3c-0.4,0.4-1,0.4-1.4,0	c-0.4-0.4-0.4-1,0-1.4l5.3-5.3l-5.3-5.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0	c0.4,0.4,0.4,1,0,1.4L17.4,16z"></path>
    </svg>
  );
};

export const MessageDialogue = ({ details, onClosed }) => {
  const [message, setmessage] = React.useState("");
  const dispatch = useDispatch();
  const sendMessage = () => {
    // const { id, firstName, lastName } = getCookies("customer_details");
    const {
      providerId,
      mainService,
      providerName,
      customerId,
      bookingId,
      firstName,
      lastName,
    } = details;
    SendMessage({
      customerId,
      providerId,
      jobTitle: mainService,
      jobId: bookingId,
      text: message,
      customerName: `${firstName} ${lastName}`,
      providerName,
    })
      .then((res) => {
        console.log(res);
        dispatch({
          type: PlexarChatActions.NEW_CONVERSATION,
          payload: res.data.conversation,
        });
        onClosed(res.data);
      })
      .catch((err) => {
        console.log(err);
        onClosed(false);
      });
  };

  return (
    <div className="container">
      <div>
        <FAEText subHeading>
          Send Message to <strong> {details?.providerName}</strong> against{" "}
          <strong>{details?.mainService} </strong>
        </FAEText>
        <div className="form-group">
          <FAETextField
            type="textarea"
            placeholder="Type message ..."
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            onKeyPress={(e) => console.log(e.code)}
          />
        </div>
        <div className="form-group">
          <FAEButton
            style={{ marginTop: "10px", float: "left", marginLeft: "10px" }}
            className="btn btn-primary"
            onClick={() => {
              if (message.trim() !== "") {
                sendMessage();
              }
            }}
          >
            {" "}
            Send
          </FAEButton>
        </div>
      </div>
    </div>
  );
};
