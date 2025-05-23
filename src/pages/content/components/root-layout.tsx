import { Link, Outlet } from "react-router";
import { APP_ROUTES } from "@common/constants";
import { RequireAuth, RequireGuest } from "@components/authentication";

export default function RootLayout() {
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
