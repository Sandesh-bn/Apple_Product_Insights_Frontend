import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useTheme } from "./ThemeProvider";

export default function Layout() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden ${theme === "dark" ? "blue-gradient" : "bg-gray-100"
        }`}>
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Outlet />
        </div>
      </div>
    </main>
    </div >
  );
}
