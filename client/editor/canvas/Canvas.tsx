import { useDroppable } from "@dnd-kit/core";
import { useAppStore, getCurrentPage } from "@/editor/store/appStore";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { renderNode } from "@/editor/runtime/registry";

function DropArea({ children }: { children?: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  return (
    <div ref={setNodeRef} className="min-h-[600px] rounded-lg border bg-background p-6">
      <div className="text-sm text-muted-foreground">Drop components here</div>
      {isOver && <div className="mt-2 rounded border-2 border-dashed border-primary/50 p-6" />}
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

export default function Canvas() {
  const setSel = useAppStore((s) => s.setSelection);
  const sel = useAppStore((s) => s.selection);
  const page = getCurrentPage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel([]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSel]);

  return (
    <Card className="h-full w-full p-4">
      <DropArea>
        {(page?.root.children || []).map((n) => (
          <div
            key={n.id}
            className={cn(
              "cursor-pointer rounded border p-3",
              sel.includes(n.id) ? "ring-2 ring-primary" : "hover:bg-accent/40",
            )}
            onClick={() => setSel([n.id])}
          >
            <div className="pointer-events-none">{renderNode(n, {}, {})}</div>
          </div>
        ))}
      </DropArea>
    </Card>
  );
}
