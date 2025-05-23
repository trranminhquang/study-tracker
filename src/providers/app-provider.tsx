import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { Message, MessageType } from "@lib/chrome/messaging";
import { useAuth } from "@providers/auth-provider";

export type AppContextValues = {};

export const AppContext = createContext<AppContextValues | null>(null);

export function useApp(): AppContextValues {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export type AppProps = PropsWithChildren;

export default function AppProvider({ children }: AppProps) {
  const { setUserAuth } = useAuth();

  useEffect(() => {
    const listener = (
      message: Message,
      _sender: chrome.runtime.MessageSender,
      _sendResponse: (response?: unknown) => void
    ) => {
      switch (message.type) {
        case MessageType.USER_SIGNED_IN:
          setUserAuth(message.payload);
          break;
        case MessageType.USER_SIGNED_OUT:
          setUserAuth(undefined);
          break;
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
}
