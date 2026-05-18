import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { useTheme } from "./ThemeProvider";

export default function Layout() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300 font-sans">
      <TopNav />
      <main className="flex-1 flex flex-col w-full pt-14">
        <Outlet />
      </main>
    </div>
  );
}
