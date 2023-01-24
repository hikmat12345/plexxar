export const EventBus = {
  on: (event, callback) => {
    document.addEventListener(event, (e) => callback(e));
  },
  dispatch: (event, data) => {
    document.dispatchEvent(new CustomEvent(event, data));
  },
  remove: (event, callback) => {
    document.removeEventListener(event, callback);
  },
};
