import { lazy, Suspense } from "react";
import { createMemoryRouter } from "react-router";
import { APP_ROUTES } from "@common/constants";

import ProtectedRoute from "@components/protected-route";
import RootLayout from "@pages/popup/components/root-layout";

const HomePage = lazy(() => import("@pages/popup/routes/home"));
const SignInPage = lazy(() => import("@pages/popup/routes/sign-in"));
const SignUpPage = lazy(() => import("@pages/popup/routes/sign-up"));

export default createMemoryRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: APP_ROUTES.HOME,
        element: <ProtectedRoute />,
        children: [
          {
            path: APP_ROUTES.HOME,
            element: (
              <Suspense>
                <HomePage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: APP_ROUTES.SIGN_IN,
        element: (
          <Suspense>
            <SignInPage />
          </Suspense>
        ),
      },
      {
        path: APP_ROUTES.SIGN_UP,
        element: (
          <Suspense>
            <SignUpPage />
          </Suspense>
        ),
      },
    ],
  },
]);
