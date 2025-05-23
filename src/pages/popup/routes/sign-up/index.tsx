import { useAuth } from "@providers/auth-provider";
import withAuthRedirect from "@hocs/withAuthRedirect";

import { APP_ROUTES } from "@common/constants";
import { Button } from "@components/ui/button";

const SignUpPage = () => {
  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      signUpWithCredentials({ email, password });
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
      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default withAuthRedirect(SignUpPage, APP_ROUTES.HOME);
