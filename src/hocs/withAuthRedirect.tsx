import { type ComponentType, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@providers/auth-provider";
import GlobalLoading from "@components/global-loading";

export type WithAuthRedirectProps = {
  // Extend this if you need to inject auth-related props
};

function withAuthRedirect<P extends WithAuthRedirectProps>(
  Component: ComponentType<P>,
  redirectTo: string
): ComponentType<P> {
  const WrappedComponent: ComponentType<P> = (props) => {
    const navigate = useNavigate();
    const { isLoadingUser, userAuth } = useAuth();

    useEffect(() => {
      if (userAuth) {
        navigate(redirectTo, { replace: true });
      }
    }, [userAuth]);

    if (isLoadingUser) return <GlobalLoading />;
    return <Component {...props} />;
  };

  return WrappedComponent;
}

export default withAuthRedirect;
