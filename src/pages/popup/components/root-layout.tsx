import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <main className="absolute inset-0 flex flex-col bg-white text-[#1a1c20] dark:bg-[#1a1c20] dark:text-white">
      <Outlet />
    </main>
  );
}
