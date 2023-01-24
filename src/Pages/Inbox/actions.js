import { api } from "../../Services/axios";
import { getProviders } from "../../utils";
import { PlexarChatActions } from "../../Store/actions";
const paths = {
  mediaupload: "/media/upload",
  fetchConversations: "/conversation/get/all/by/provider",
  fetchMessagesByConversation: "/message/get",
  sendMessageToCustomer: "/message/send/to/customer",
  markMessageSeen: "/message/expert/mark/seen",
};

// const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export const getIndustry = ({ userCountryId, industryId, callback }) => {
  // return fetchAction({
  //   endpoint: `${APP_BASE_URL}/Industry/1/${userCountryId}/true`,
  // }).then((res) => {
  //   const { statusCode, industrylist } = res;
  //   statusCode !== 0
  //     ? callback([])
  //     : callback([
  //         industrylist.find((industry) => industry.industryId === industryId),
  //       ]);
  // });
};

// fetch all conversation [TO BE IMPLEMENTED AT BACKEND]
export const fetchAllConversations = (providers) => {
  // return api.post(paths.fetchConversations, { providers });
};

// fetch all messages by conversation ID
export const fetchAllMessages = (conversationId) =>
  api.get(paths.fetchMessagesByConversation + "/" + conversationId);

// fetch all messages by conversation ID
export const SendMessage = (data) => {
  return api.post(paths.sendMessageToCustomer, data);
};

// mark message seen [mark it seen]
export const markItSeen = ({ conversationId, from }) =>
  api.get(
    `${paths.markMessageSeen}?from=${from}&conversationId=${conversationId}`
  );

// upload file with progress
export const uploadFile = (fd, source, onProgressCB) => {
  return api.post(paths.mediaupload, fd, {
    cancelToken: source.token,
    onprogress: onProgressCB,
  });
};

export const getAllConversations = (dispatch) => {
  if (!!!dispatch) return;
  const providers = getProviders();
  if (!providers || (providers && providers.length === 0)) return;
  fetchAllConversations(providers)
    .then((res) => {
      dispatch({
        type: PlexarChatActions.ADD_CONVERSATION_LIST,
        payload: res.data.data,
      });
      dispatch({ type: PlexarChatActions.CALLED_CONVERSATION_API });
    })
    .catch((err) => console.log(err));
};
// cancel/aboart upload
export const cancel = (source) => source?.cancel();
