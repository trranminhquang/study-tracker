import { useNavigate } from "react-router";

import { useAuth } from "@providers/auth-provider";
import { Button } from "@components/ui/button";
import { APP_ROUTES } from "@common/constants";

const HomePage = () => {
  const navigate = useNavigate();
  const { userAuth, signOut } = useAuth();

  const handleSignOut = async () => {
    const error = await signOut();
    if (!error) {
      return navigate(APP_ROUTES.SIGN_IN, { replace: true });
    }
    alert(error.message);
  };

  return (
    <div className="p-4">
      {userAuth && <pre>{JSON.stringify(userAuth, null, 2)}</pre>}
      <Button variant="destructive" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
};

export default HomePage;
