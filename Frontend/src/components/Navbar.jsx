import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { AuthContext } from "@/context/auth/authcontext";
import { signOut } from "@/api/auth";
import NotificationBell from "./NotificationBell";

const roleHome = {
  civillian: "/my-tickets",
  admin: "/admin",
  superadmin: "/superadmin",
};

const Navbar = () => {
  const { loggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
            R
          </span>
          <span className="font-semibold">RoadCare</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#how" className="text-sm text-muted-foreground hover:text-foreground">
            How It Works
          </a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </a>
          {loggedIn && (
            <Link to={roleHome[user?.role] || "/"} className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
          )}
          {(!loggedIn || user?.role === "civillian") && (
            <Link to="/ticket" className="text-sm text-muted-foreground hover:text-foreground">
              Report Issue
            </Link>
          )}
          <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground">
            Leaderboard
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loggedIn ? (
            <>
              <NotificationBell />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/signin">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
