import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Apple, Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", path: "/" },
  { name: "Products", path: "/product-insight" },
  { name: "Economics", path: "/economic-insight" },
  { name: "Data", path: "/data-explorer" },
  { name: "Account", path: "/profile" },
];

export default function TopNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md transition-colors duration-300"
        style={{ paddingRight: "var(--removed-body-scroll-bar-size, 0px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            
            {/* Left section (Logo) */}
            <div className="flex-1 flex justify-start items-center">
              <Link to="/" className="text-foreground hover:text-foreground/80 transition-colors">
                <Apple className="h-5 w-5" />
                <span className="sr-only">Apple</span>
              </Link>
            </div>
            
            {/* Center section (Desktop Navigation) */}
            <div className="hidden md:flex flex-none space-x-8 lg:space-x-12 justify-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "inline-flex items-center text-xs font-normal tracking-tight transition-colors duration-200",
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right section (Actions & Mobile Toggle) */}
            <div className="flex-1 flex justify-end items-center gap-4">
              <button
                onClick={toggleDark}
                className="text-foreground/70 hover:text-foreground transition-colors p-2"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-foreground p-2 -mr-2"
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-14 md:hidden">
          <div className="flex flex-col px-6 py-8 space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-2xl font-semibold tracking-tight transition-colors duration-200 border-b border-border pb-4",
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-foreground/70"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
