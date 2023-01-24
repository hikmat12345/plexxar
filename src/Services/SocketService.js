/* eslint-disable no-unused-vars */
import { io } from "socket.io-client";
import { getAllConversations } from "../Pages/Inbox/actions";
import { PlexarChatActions } from "../Store/actions";
import { getCookies, getCustomerId, getLongCustomerId } from "../utils";
import { EventBus } from "./EventBus";
import { getAndSetBuisenessProviders } from "./genericApis";
// import { baseUrl, socketBaseUrl } from "../constants";
const baseURL = process.env.REACT_APP_SOCKET_SERVICE_URL;

class SocketServiceClass {
  socket = null;
  constructor() {
    this.socket = null;
  }

  init(dispatch) {
    const { firstName, lastName, id } = getCookies("customer_details");
    this.socket = new io(baseURL, {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttemps: 10,
      transports: ["websocket"],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
    });

    console.log("socket init called ...");

    this.socket.on("connect", (data) => {
      console.log("connected ...", data);
      // this.socket.emit("join", { ...user, id: id, name: "plexar chat" });
      this.join(getCustomerId());
      getAndSetBuisenessProviders()
        .then((ids) => {
          getAllConversations(dispatch);
        })
        .catch((err) => console.log(err));
    });

    this.socket.on("join-ack", (data) => {
      console.log("acknowledged join", data);
    });

    this.socket.on("customer-message", (data) => {
      dispatch({
        type: PlexarChatActions.NEW_MESSAGE,
        payload: { message: data, profile: getCustomerId() },
      });
      EventBus.dispatch("customer-message", {});
    });

    this.socket.on("conversation-closed", (data) => {
      dispatch({
        type: PlexarChatActions.CONVERSATION_CLOSED,
        payload: data,
      });
    });

    this.socket.on("new-conversation", (data) => {
      console.log("new conversation");
      dispatch({
        type: PlexarChatActions.NEW_CONVERSATION,
        payload: data,
      });
      EventBus.dispatch("customer-message", {});
    });

    this.socket.on("message-seen", (data) => {
      // data.data is conversationId,
      dispatch({ type: PlexarChatActions.SEEN_MESSAGE, payload: data });
      console.log("message-seen", data);
    });
  }

  join(id) {
    if (!this.hasSocket()) return;
    const { firstName, lastName } = getCookies("customer_details");
    const user = {
      _id: id,
      firstName,
      lastName,
      userName: id,
    };

    this.socket.emit("join", { ...user });
  }

  sendToCustomer(data) {
    this.socket.emit("provider-to-customer-msg", data, (data) => {
      console.log("socket callback", data);
    });
  }
  setSocket(_socket) {
    this.socket = _socket;
  }

  hasSocket() {
    return !!this.socket;
  }

  emit(event, data) {
    if (!this.socket) {
      console.error("no socket data is available ...");
      return;
    }
    this.socket.emit(event, data);
  }

  listen(event, cb) {
    if (!this.socket) {
      console.error("no socket object, cannot listen ...");
      return;
    }

    this.socket.on(event, cb);
  }
}

export const SocketService = new SocketServiceClass();
