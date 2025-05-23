export enum MessageType {
  SET_AUTHORIZATION_TOKEN = "SET_AUTHORIZATION_TOKEN",
  SET_USER_INFO = "SET_USER_INFO",
  FETCH_USER_INFO = "FETCH_USER_INFO",
  REMOVE_USER_INFO = "REMOVE_USER_INFO",
  USER_SIGN_IN = "USER_SIGN_IN",
  USER_SIGNED_IN = "USER_SIGNED_IN",
  USER_SIGN_OUT = "USER_SIGN_OUT",
  USER_SIGNED_OUT = "USER_SIGNED_OUT",
}

export type Message<P = any> = {
  type: MessageType;
  payload?: P;
};

export const sendMessageToBackground = <T = any>(
  message: Message
): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else resolve(response);
    });
  });
};

const sendMessageToContentScript = <T = any>(
  message: Message,
  tab: chrome.tabs.Tab
): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id as number, message, (response) => {
      if (chrome.runtime.lastError) {
        // reject(new Error(chrome.runtime.lastError.message));
        console.info(
          `sendMessageToContentScript error for tab ${tab.id}:`,
          chrome.runtime.lastError.message
        );
      }
      resolve(response);
    });
  });
};

export const sendMessageToAllTabs = <T = any>(
  message: Message
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      const promises = tabs
        .filter((tab) => tab.id)
        .map((tab) => sendMessageToContentScript(message, tab));
      Promise.all(promises).then(resolve).catch(reject);
    });
  });
};

export const sendMessageToActiveTab = <T = any>(
  message: Message
): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const [activeTab] = tabs;
      if (!activeTab) reject(new Error("No active tab found"));
      sendMessageToContentScript(message, activeTab)
        .then(resolve)
        .catch(reject);
    });
  });
};
