import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
];

const authenticatedNavItems = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
  { name: "Tracker", path: "/tracker" },
  { name: "Notes", path: "/notes" },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const currentNavItems = user ? authenticatedNavItems : navItems;

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-[hsl(var(--border-strong))] bg-background/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 transition-smooth hover:opacity-80"
          >
            <img
              src="/logo.png"
              alt="LeetScape"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-semibold text-foreground">
              LeetScape
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {currentNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 text-base font-medium rounded-md transition-smooth ${
                    isActive
                      ? "text-gradient"
                      : "text-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full transition-smooth hover:bg-muted/50"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={userProfile?.photoURL}
                        alt={
                          userProfile?.customUsername ||
                          user.displayName ||
                          "User"
                        }
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                        {(
                          userProfile?.customUsername ||
                          user.displayName ||
                          "U"
                        )
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-popover border-border shadow-lg"
                  align="end"
                  forceMount
                >
                  <div className="flex items-center justify-start gap-3 p-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userProfile?.photoURL}
                        alt={
                          userProfile?.customUsername ||
                          user.displayName ||
                          "User"
                        }
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium text-xs">
                        {(
                          userProfile?.customUsername ||
                          user.displayName ||
                          "U"
                        )
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 leading-none">
                      <p className="font-medium text-foreground text-base">
                        {userProfile?.customUsername ||
                          user.displayName ||
                          "User"}
                      </p>
                      <p className="w-[140px] truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile" className="flex items-center p-2">
                      <User className="mr-2 h-4 w-4" />
                      <span className="text-base">Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer p-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="text-base">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                className="bg-primary text-white hover:bg-primary-hover transition-smooth text-base px-4 py-1.5"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
