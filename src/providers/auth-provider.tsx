import {
  PropsWithChildren,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import supabaseClient, {
  isAuthError,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  SignOut,
} from "@lib/supabase/client";
import { getUser, getUserMetadata } from "@lib/supabase/query";
import { MessageType, sendMessageToBackground } from "@lib/chrome/messaging";
import Storage, { STORAGE_KEY_USER } from "@lib/chrome/storage";
import { transformUser } from "@lib/supabase/transform";

export interface UserAuth {
  id: string;
  email?: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
  role?: string;
  email_change_sent_at?: string;
  invited_at?: string;
  phone?: string;
  is_anonymous?: boolean;
  is_sso_user?: boolean;
}

export type SignInWithCredentials = SignInWithPasswordCredentials;
export type SignUpWithCredentials = SignUpWithPasswordCredentials;

export type AuthContextValues = {
  isLoadingUser: boolean;
  userAuth?: UserAuth;
  setUserAuth: (user?: UserAuth) => void;
  fetchUser: () => Promise<UserAuth | undefined>;
  signInWithCredentials: (
    credentials: SignInWithCredentials
  ) => Promise<UserAuth | undefined>;
  signUpWithCredentials: (
    credentials: SignUpWithCredentials
  ) => Promise<UserAuth | undefined>;
  signOut: (opts?: SignOut) => Promise<Error | undefined>;
};

export const AuthContext = createContext<AuthContextValues | null>(null);

export function useAuth(): AuthContextValues {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [userAuth, setUserAuth] = useState<UserAuth>();

  useEffect(() => {
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        switch (event) {
          case "SIGNED_IN":
            await sendMessageToBackground({
              type: MessageType.USER_SIGN_IN,
              payload: session?.user,
            });
            break;
          case "USER_UPDATED":
            await sendMessageToBackground({
              type: MessageType.SET_USER_INFO,
              payload: session?.user,
            });
            break;
          case "TOKEN_REFRESHED":
            await sendMessageToBackground({
              type: MessageType.SET_AUTHORIZATION_TOKEN,
              payload: session,
            });
            break;
          case "SIGNED_OUT":
            await sendMessageToBackground({
              type: MessageType.USER_SIGN_OUT,
              payload: session,
            });
            break;
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchUser = useCallback(async (): Promise<UserAuth | undefined> => {
    setIsLoadingUser(true);
    try {
      const storedUser = await Storage.get<UserAuth>(STORAGE_KEY_USER);
      if (storedUser) {
        setUserAuth(storedUser);
        return storedUser;
      }

      const [user, userMetadata] = await Promise.all([
        getUser(),
        getUserMetadata(),
      ]);
      const userTransformed = transformUser(user, userMetadata);

      // await sendMessageToBackground({
      //   type: MessageType.SET_USER_INFO,
      //   payload: userTransformed,
      // }).catch(console.error);

      // skip error if no background page
      await Storage.set(STORAGE_KEY_USER, userTransformed).catch(console.error);

      setUserAuth(userTransformed);
      return userTransformed;
    } catch (error) {
      if (isAuthError(error)) {
        // Handle specific auth error
        return;
      }
      console.error("Error fetching user:", error);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const signInWithCredentials = useCallback(
    async (
      credentials: SignInWithCredentials
    ): Promise<UserAuth | undefined> => {
      try {
        setIsLoadingUser(true);
        const { error } = await supabaseClient.auth.signInWithPassword(
          credentials
        );
        if (error) throw error;
        return await fetchUser();
      } catch (error) {
        if (isAuthError(error)) {
          // Handle specific auth error
          // console.error("Auth error:", error.message);
          return;
        }
        // console.error("Error signing in:", error);
      } finally {
        setIsLoadingUser(false);
      }
    },
    []
  );

  const signOut = useCallback(async (opts?: SignOut) => {
    try {
      const { error } = await supabaseClient.auth.signOut(opts);
      if (error) return new Error(error.message);
      setUserAuth(undefined);
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
      return new Error("Unknown error occurred");
    }
  }, []);

  const signUpWithCredentials = useCallback(
    async (
      credentials: SignUpWithCredentials
    ): Promise<UserAuth | undefined> => {
      try {
        setIsLoadingUser(true);
        const { error } = await supabaseClient.auth.signUp(credentials);
        if (error) throw error;
        return await fetchUser();
      } catch (error) {
        if (isAuthError(error)) {
          // Handle specific auth error
          return;
        }
        console.error("Error signing up:", error);
      } finally {
        setIsLoadingUser(false);
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        isLoadingUser,
        userAuth,
        setUserAuth,
        fetchUser,
        signInWithCredentials,
        signUpWithCredentials,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
