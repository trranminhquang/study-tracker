import { useEffect } from "react";
import { Link, Outlet } from "react-router";
import { APP_ROUTES } from "@common/constants";
import { RequireAuth, RequireGuest } from "@components/authentication";
import { siteHandlers, QuestionAttempt } from "@pages/content/sites";

export default function RootLayout() {
  useEffect(() => {
    const handler = siteHandlers.find((h) => h.isMatch);
    if (!handler) return;

    const attemptStartTime = Date.now();

    // Patch fetch only once per handler
    const originalFetch = window.fetch;

    if (!window._studyTrackerFetchPatched) {
      window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        if (typeof handler.interceptFetchResponse === "function") {
          await handler.interceptFetchResponse(response);
        }
        return response;
      };

      // Mark that fetch has been patched to avoid multiple patches
      window._studyTrackerFetchPatched = true;
    }

    // Cleanup the listener when the component is unmounted
    handler.attachListeners((attempt: QuestionAttempt) => {
      attempt.durationMs = Date.now() - attemptStartTime;
      // send attempt to background script or handle it as needed
      console.log("Captured question attempt:", attempt);
    });
  }, []);

  return (
    <main className="absolute top-1/2 left-0 h-fit flex flex-col bg-orange-500 text-white">
      <Outlet />
      <nav className="mt-4">
        <RequireAuth>
          <Link to={APP_ROUTES.HOME}>Home Nav</Link>
          <Link to={APP_ROUTES.SETTINGS}>Settings Nav</Link>
        </RequireAuth>
        <RequireGuest>
          <Link to={APP_ROUTES.SIGN_IN}>Sign In Nav</Link>
          <Link to={APP_ROUTES.SIGN_UP}>Sign Up Nav</Link>
        </RequireGuest>
      </nav>
    </main>
  );
}
