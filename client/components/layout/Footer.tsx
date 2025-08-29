export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:h-20 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} FlowCraft — Build visually. Export code.
        </p>
        <div className="text-sm text-muted-foreground">
          Crafted with ♥ for creators
        </div>
      </div>
    </footer>
  );
}
