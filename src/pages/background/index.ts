import {
  Message,
  MessageType,
  sendMessageToAllTabs,
} from "@lib/chrome/messaging";
import Storage, {
  STORAGE_KEY_USER,
  STORAGE_KEY_TOKEN,
} from "@lib/chrome/storage";

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    const { type, payload } = message;
    switch (type) {
      case MessageType.SET_AUTHORIZATION_TOKEN: {
        Storage.set(STORAGE_KEY_TOKEN, payload).then(sendResponse);
        break;
      }
      case MessageType.SET_USER_INFO: {
        Storage.set(STORAGE_KEY_USER, payload).then(sendResponse);
        break;
      }
      case MessageType.FETCH_USER_INFO: {
        Storage.get(STORAGE_KEY_USER).then(sendResponse);
        break;
      }
      case MessageType.REMOVE_USER_INFO: {
        Storage.remove(STORAGE_KEY_USER).then(sendResponse);
        break;
      }
      case MessageType.USER_SIGN_IN: {
        sendMessageToAllTabs({
          type: MessageType.USER_SIGNED_IN,
          payload: message.payload,
        }).then(sendResponse);
        break;
      }
      case MessageType.USER_SIGN_OUT: {
        Storage.remove(STORAGE_KEY_USER).then(() => {
          sendMessageToAllTabs({
            type: MessageType.USER_SIGNED_OUT,
          }).then(sendResponse);
        });
        break;
      }
      case MessageType.API_RESPONSE: {
        console.log('API response received:', payload);
      }
    }
    return true;
  }
);
