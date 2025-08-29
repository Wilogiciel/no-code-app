import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";

export default function Header() {
  const { pathname } = useLocation();
  const NavLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <Link
      to={to}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        pathname === to
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BrandLogo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/studio">Studio</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <a href="#preview">Live preview</a>
          </Button>
          <Button asChild>
            <Link to="/studio">Start building</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
