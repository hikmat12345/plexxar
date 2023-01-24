/* eslint-disable */
import { combineReducers } from "redux";
import { PlexarChatActions } from "./actions";
const profile = localStorage.getItem("profile")
  ? JSON.parse(localStorage.getItem("profile"))
  : {};
const defaultState = {
  isConversationApiCalled: false,
  profile,
  connection: "",
  loading: false,
  message: "",
  messages: [],
  selected: {},
  conversations: [],
  messageIds: [],
  conversationIds: [],
};
export function inboxReducer(state = defaultState, action) {
  const { payload } = action;
  switch (action.type) {
    case PlexarChatActions.CONVERSATION_CLOSED:
      return {
        ...state,
        conversations: state.conversations.filter(
          (con) => con.conversationId !== payload
        ),
        selected:
          state.selected.conversationId === payload
            ? {}
            : { ...state.selected },
      };
    case PlexarChatActions.ADD_CONVERSATION_LIST:
      let ids = [];
      let convs = [];
      payload.forEach((con) => {
        if (ids.indexOf(con.conversationId) === -1) {
          ids.push(con.conversationId);
          convs.push(con);
        }
      });
      return {
        ...state,
        conversations: convs,
        conversationIds: ids,
      };
    case PlexarChatActions.SELECT_CONVERSATION:
      return {
        ...state,
        selected:
          typeof payload == "string"
            ? state.conversations.find((c) => c.conversationId == payload)
            : payload,
      };
    case PlexarChatActions.NEW_MESSAGE:
      return {
        ...state,
        messages:
          state.messageIds.indexOf(action.payload.message._id) > -1
            ? [...state.messages]
            : [...state.messages, action.payload.message],
        messageIds:
          state.messageIds.indexOf(payload.message._id) > 0
            ? [...state.messageIds]
            : [...state.messageIds, payload.message._id],
        conversations: [
          ...state.conversations.map((conversation) => {
            if (
              conversation.conversationId ===
              action.payload.message.conversationId
            ) {
              conversation.lastMessage = action.payload.message.text;
              if (
                conversation.conversationId !== state.selected.conversationId &&
                action.payload.message.from !== action.payload.profile
              ) {
                if (conversation.type === 1) {
                  if (conversation.counts < 1) {
                    ++conversation.counts;
                  }
                } else {
                  ++conversation.counts;
                }
              }
            }
            return conversation;
          }),
        ].sort((a, b) => b.counts - a.counts),
      };
    case PlexarChatActions.REMOVE_COMVERSATION:
      state.conversationIds.splice(state.conversationIds.indexOf(payload), 1);
      return {
        ...state,
        conversation: [
          ...state.conversations.filter(
            (c) => c.conversationId === action.payload
          ),
        ],
        conversationIds: state.conversationIds,
      };
    case PlexarChatActions.CLEAR_COUNTS:
      return {
        ...state,
        conversations: [
          ...state.conversations.map((c) =>
            c.conversationId === action.payload ? { ...c, counts: 0 } : c
          ),
        ],
      };
    case PlexarChatActions.SEEN_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages.map((msg) =>
            msg.conversationId === action.payload
              ? { ...msg, status: 1 }
              : { ...msg }
          ),
        ],
      };
    case PlexarChatActions.ADD_MESSAGES_LIST:
      let _ids = [];
      payload.forEach((itm) => {
        if (state.messageIds.indexOf(itm._id) === -1) {
          _ids.push(itm._id);
        }
      });
      return {
        ...state,
        messages: [
          ...state.messages,
          ...action.payload.filter(
            (i) => state.messageIds.indexOf(i._id) === -1
          ),
        ],
        messageIds: [...state.messageIds, ..._ids],
      };
    case PlexarChatActions.CALLED_CONVERSATION_API:
      return {
        ...state,
        isConversationApiCalled: true,
      };
    case PlexarChatActions.NEW_CONVERSATION:
      return {
        ...state,
        conversations:
          state.conversationIds.indexOf(payload.conversationId) > 0
            ? [...state.conversations]
            : [...state.conversations, payload],
      };
    default:
      return state;
  }
}

export const rootReducer = combineReducers({
  state: inboxReducer,
});
