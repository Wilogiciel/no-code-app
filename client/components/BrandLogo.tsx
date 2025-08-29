import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-6 w-6 rounded-lg bg-gradient-to-br from-primary to-accent shadow-md">
        <div className="absolute inset-0 rounded-lg bg-white/10" />
      </div>
      <span className="font-extrabold tracking-tight">FlowCraft</span>
    </div>
  );
}
