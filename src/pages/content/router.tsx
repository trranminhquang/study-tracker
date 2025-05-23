import { createMemoryRouter } from "react-router";
import { APP_ROUTES } from "@common/constants";

import HomePage from "@pages/content/routes/home";
import SignInPage from "@pages/content/routes/sign-in";
import SignUpPage from "@pages/content/routes/sign-up";
import SettingsPage from "@pages/content/routes/settings";

import ProtectedRoute from "@components/protected-route";
import RootLayout from "@pages/content/components/root-layout";

export default createMemoryRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: APP_ROUTES.HOME,
            element: <HomePage />,
          },
          {
            path: APP_ROUTES.SETTINGS,
            element: <SettingsPage />,
          },
        ],
      },
      {
        path: APP_ROUTES.SIGN_IN,
        element: <SignInPage />,
      },
      {
        path: APP_ROUTES.SIGN_UP,
        element: <SignUpPage />,
      },
    ],
  },
]);
