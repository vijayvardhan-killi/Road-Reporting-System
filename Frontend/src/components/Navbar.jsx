
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
const Navbar = () => {
  return (
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
            R
          </span>
          <span className="font-semibold">RoadCare</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#how"
            className="text-sm text-muted-foreground hover:text-foreground"
            >
            How It Works
          </a>
          <a
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground"
            >
            Features
          </a>
          <a
            href="#demo"
            className="text-sm text-muted-foreground hover:text-foreground"
            >
            Demo
          </a>
          <a
            href="#impact"
            className="text-sm text-muted-foreground hover:text-foreground"
            >
            Impact
          </a>
          <a
            href="#contact"
            className="text-sm text-muted-foreground hover:text-foreground"
            >
            Contact
          </a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link to={"/signin"} href="#login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to={"/signup"} href="#get-started">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;