import { PropsWithChildren } from "react";
import { useAuth } from "@providers/auth-provider";

type RequireAuthProps = PropsWithChildren & {
  allowGuest?: boolean;
};
export const RequireAuth = ({
  children,
  allowGuest = false,
}: RequireAuthProps) => {
  const { userAuth } = useAuth();

  if (userAuth || allowGuest) return children;
  return null;
};

type RequireGuestProps = PropsWithChildren & {
  allowAuth?: boolean;
};
export const RequireGuest = ({
  children,
  allowAuth = false,
}: RequireGuestProps) => {
  const { userAuth } = useAuth();

  if (!userAuth || allowAuth) return children;
  return null;
};
