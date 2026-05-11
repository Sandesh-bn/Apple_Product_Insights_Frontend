import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  PackageSearch, 
  TrendingUp, 
  User, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Apple,
  Database
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Product Insight", path: "/product-insight", icon: PackageSearch },
  { name: "Economic Insight", path: "/economic-insight", icon: TrendingUp },
  { name: "Data Explorer", path: "/data-explorer", icon: Database },
  { name: "Profile", path: "/profile", icon: User },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-card border-r border-border transition-all duration-300 ease-in-out lg:static flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64" // Default mobile width
        )}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Apple className="h-5 w-5" />
              </div>
              <span className="truncate">Product Insight</span>
            </div>
          )}
          {isCollapsed && (
             <div className="w-8 h-8 mx-auto rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                location.pathname === item.path 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isCollapsed && "mx-auto")} />
              {(!isCollapsed || isMobileOpen) && (
                <span className="font-medium truncate">{item.name}</span>
              )}
              {isCollapsed && !isMobileOpen && (
                 <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-border shadow-md z-50 whitespace-nowrap">
                    {item.name}
                 </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3",
              isCollapsed && "justify-center px-0"
            )}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            
          </Button>

          {/* Collapse Toggle (Desktop only) */}
          <Button
            variant="ghost"
            className="w-full hidden lg:flex justify-start gap-3"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5 mx-auto" /> : <ChevronLeft className="h-5 w-5" />}
            {!isCollapsed && <span>Collapse Sidebar</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
