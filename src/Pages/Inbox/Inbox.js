//libs
/* eslint-disable */
import React, { useRef, useState } from "react";
import {
  fetchAllMessages,
  getAllConversations,
  markItSeen,
  SendMessage,
} from "./actions";
import { useDispatch, useSelector } from "react-redux";
//src

//scss
import ImageUpload, {
  ClosableAudioPreview,
  MessagesList,
  ProgressComponent,
  SelectedUserBar,
  Sidebar,
} from "./chat.component";
import "./chat.scss";
import { PlexarChatActions } from "../../Store/actions";
import { getCustomerId, getLongCustomerId } from "../../utils";
import { EventBus } from "../../Services/EventBus";
import { SocketService } from "../../Services/SocketService";
const Inbox = ({ location }) => {
  const { selected, isConversationApiCalled, conversations } = useSelector(
    (state) => state.state
  );
  const messages = useSelector((state) =>
    state.state.messages.filter(
      (msg) =>
        state.state.selected &&
        msg.conversationId === state.state.selected.conversationId
    )
  );
  const dispatch = useDispatch();
  const [message, setmessage] = React.useState("");

  const [file, setfile] = React.useState(null);
  const [recordingState, setrecordingState] = React.useState(
    RecordingStates.not_started
  ); //
  const [fileProcess, setfileProcess] = React.useState({
    started: false,
    completed: false,
    progress: 0,
    shortName: "",
    url: "",
  });

  const [isGroupSelected, setisGroupSelected] = useState(false);
  const inputRef = useRef(null);
  const sendBtnRef = useRef(null);

  const fileProcessReset = () => {
    setrecordingState(RecordingStates.not_started);
    setfile(null);
    setfileProcess({
      ...fileProcess,
      started: false,
      completed: false,
      progress: 0,
      shortName: "",
      url: "",
    });
  };
  React.useEffect(() => {
    EventBus.on("customer-message", () => {
      scrollToBottom();
    });
    return () => {
      EventBus.remove("customer-message", () => {});
    };
  }, []);

  React.useEffect(() => {
    if (location.state) {
      fetchMessagesByConversationId(location.state);
      dispatch({
        type: PlexarChatActions.SELECT_CONVERSATION,
        payload: location.state,
      });
    }

    if (!isConversationApiCalled) {
      getAllConversations(dispatch);
    }
  }, []);

  const sendMessage = () => {
    if (!selected && !isGroupSelected) return;
    inputRef.current.value = "";
    sendBtnRef.current.disabled = true;

    let _message = {
      customerId: selected?.customer?.id,
      providerId: selected?.provider?.id,
      text: message,
      conversationId: selected?.conversationId,
    };
    /*SocketService.sendToCustomer({
      ..._message,
      customerName: "shah customer",
      providerName: "providername",
      jobId: 32,
      jobTitle: "hello job title",
    });*/
    SendMessage(_message)
      .then((res) => {
        console.log("message sent", res.data);
        fileProcessReset();
        dispatch({
          type: PlexarChatActions.NEW_MESSAGE,
          payload: {
            profile: getCustomerId(),
            message: res.data.data,
          },
        });
        scrollToBottom();
        setmessage("");
      })
      .catch((err) => console.log(err))
      .finally(() => {
        sendBtnRef.current.disabled = false;
      });
  };

  const markMessageSeen = () => {
    let ID = selected.customer?.id; // getCustomerId();
    console.log(ID, selected, "testing ...");
    if (!selected) return;
    if (!selected.conversationId && !selected.customer.id) return;
    if (messages.length <= 0) return;
    let lastMesage = messages[messages.length - 1];
    if (lastMesage.from !== ID || lastMesage.status === 1) return;
    markItSeen({
      conversationId: selected.conversationId,
      from: selected.customer?.id,
    })
      .then(() => {
        console.log("marked message seen");
        // dispatch({
        //   type: PlexarChatActions.SEEN_MESSAGE,
        //   payload: selected.conversationId,
        // });
        dispatch({
          type: PlexarChatActions.CLEAR_COUNTS,
          payload: selected.conversationId,
        });
      })
      .catch((err) => console.log(err));
  };
  const fetchMessagesByConversationId = (conversationId) => {
    fetchAllMessages(conversationId)
      .then((res) => {
        console.log("res ms", res.data.data);
        dispatch({
          type: PlexarChatActions.ADD_MESSAGES_LIST,
          payload: res.data.data,
        });
        scrollToBottom();
      })
      .catch((err) => console.log("messages err", err));
  };

  const handleSelection = (data) => {
    if (data.conversationId === selected.conversationId) return;
    dispatch({
      type: PlexarChatActions.SELECT_CONVERSATION,
      payload: data,
    });
    if (data.conversationId) {
      fetchMessagesByConversationId(data.conversationId);
    }
  };
  var chatBodyRef = React.useRef(null);
  const scrollToBottom = () => {
    setTimeout(() => {
      chatBodyRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  };
  return (
    <div className="inbox-container">
      <SideBarWrapper>
        {conversations.length > 0 ? (
          <Sidebar
            profile={{ name: "Conversations", userName: "asdf" }}
            selected={selected}
            counts={{}}
            conversations={conversations}
            onSelect={handleSelection}
            selectedGroup={null}
          />
        ) : (
          "No Conversations Yet"
        )}
      </SideBarWrapper>
      <MainArea>
        {selected && selected.conversationId && (
          <MainHeader>{<SelectedUserBar conversation={selected} />}</MainHeader>
        )}
        <MainBody>
          <MessagesList messages={messages} profileId={selected.provider?.id} />
          <div className="container no-msg-container">
            {selected && selected.conversationId ? (
              ""
            ) : (
              <p className="no-msg-text">No Chat selected</p>
            )}
          </div>
          <div ref={chatBodyRef}></div>
        </MainBody>
        <MainBottom>
          {selected && selected.conversationId ? (
            <div className="d-flex flex-column">
              <ProgressComponent
                progress={fileProcess.progress}
                shortName={fileProcess.shortName || "shortName"}
                started={fileProcess.started}
                completed={fileProcess.completed}
                onCancel={() => fileProcessReset()}
              />

              {recordingState === RecordingStates.completed && (
                <ClosableAudioPreview
                  url={file.url}
                  onClose={() => {
                    setfile(null);
                    setrecordingState(RecordingStates.not_started);
                  }}
                />
              )}

              <div className="d-flex flex-row">
                {/* <ImageUpload
                  onUploadCompleted={(data) => {
                    // also hide progress bar and display shortName of file in chat box
                    setfile({
                      ...file,
                      url: data.url,
                      mimetype: data.type,
                    });
                    setfileProcess({
                      ...fileProcess,
                      completed: true,
                      shortName: data.shortName,
                    });
                  }}
                  onProgress={(progress) => {
                    setfileProcess({ ...fileProcess, progress: progress });
                  }}
                  onUploadStarted={() => {
                    setfileProcess({ ...fileProcess, started: true });
                  }}
                  onUploadFailed={() => {
                    setfile(null);
                    fileProcessReset();
                  }}
                /> */}
                <input
                  ref={inputRef}
                  disabled={false}
                  type="text"
                  className="form-control"
                  value={message}
                  onChange={(e) => setmessage(e.target.value)}
                  onFocus={() => markMessageSeen()}
                  onKeyPress={(e) => {
                    if (
                      e.key.toLocaleLowerCase() === "enter" &&
                      e.target.value.trim() !== ""
                    ) {
                      sendMessage();
                    }
                    markMessageSeen();
                  }}
                />
                <button
                  ref={sendBtnRef}
                  onClick={() => {
                    if (inputRef.current.value.trim() !== "") {
                      sendMessage();
                    }
                  }}
                  className="btn btn-primary"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </MainBottom>
      </MainArea>
    </div>
  );
};

export default Inbox;

export const MainArea = ({ children }) => {
  return (
    <>
      <div className="__main">{children}</div>
    </>
  );
};
export const SideBarWrapper = ({ children }) => {
  return (
    <>
      <div className="__sidebar">{children}</div>
    </>
  );
};
export const MainHeader = ({ children }) => {
  return (
    <>
      <div className="__main-header">{children}</div>
    </>
  );
};
export const MainBody = ({ children }) => {
  return (
    <>
      <div className="__main-body">{children}</div>
    </>
  );
};
export const MainBottom = ({ children }) => {
  return (
    <>
      <div className="__main-bottom">{children}</div>
    </>
  );
};

export const usersData = [
  {
    _id: "624bfc9b0b2caaa334b96f4a",
    name: "Pennington Taylor",
    userName: "penningtontaylor@keeg.com",
  },
  {
    _id: "624bfc9b24153d85e89d5f36",
    name: "Hardin Sharpe",
    userName: "hardinsharpe@keeg.com",
  },
  {
    _id: "624bfc9baa42ec683cdba03b",
    name: "Parrish Johnson",
    userName: "parrishjohnson@keeg.com",
  },
  {
    _id: "624bfc9b567a5805eaae2269",
    name: "Allyson Holt",
    userName: "allysonholt@keeg.com",
  },
  {
    _id: "624bfc9bcdc978056690b07c",
    name: "Ellison Finley",
    userName: "ellisonfinley@keeg.com",
  },
  {
    _id: "624bfc9bf345b05911a657c5",
    name: "Lara Bowers",
    userName: "larabowers@keeg.com",
  },
  {
    _id: "624bfc9ba838a9dbcb149b04",
    name: "Shanna Tillman",
    userName: "shannatillman@keeg.com",
  },
];

export const RecordingStates = {
  not_started: 0,
  in_progress: 1,
  completed: 2,
  uploaded: 3,
};
