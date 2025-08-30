import { Link, NavLink as RRNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <RRNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )
      }
    >
      {children}
    </RRNavLink>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BrandLogo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/projects">Projects</NavItem>
          <NavItem to="/studio">Studio</NavItem>
        </nav>
        <div className="flex items-center gap-4">
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
