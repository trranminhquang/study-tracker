import { useNavigate } from "react-router";
import { useAuth } from "@providers/auth-provider";
import withAuthRedirect from "@hocs/withAuthRedirect";

import { APP_ROUTES } from "@common/constants";
import { Button } from "@components/ui/button";

const SignInPage = () => {
  const navigate = useNavigate();
  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      const user = await signInWithCredentials({ email, password });
      if (user) navigate(APP_ROUTES.HOME, { replace: true });
      else alert("Sign in failed");
    } catch (error) {
      alert("An error occurred during sign-in");
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-center h-screen"
      onSubmit={onSubmit}
    >
      <h1 className="text-3xl text-center text-black">Sign In</h1>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <Button type="submit">Sign In</Button>
    </form>
  );
};

export default withAuthRedirect(SignInPage, APP_ROUTES.HOME);
