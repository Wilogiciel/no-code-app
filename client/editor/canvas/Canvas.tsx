import { useDroppable } from "@dnd-kit/core";
import { useAppStore, getCurrentPage } from "@/editor/store/appStore";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { renderNode } from "@/editor/runtime/registry";
import Tree from "@/editor/canvas/Tree";

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

const CONTAINERS = new Set(["Row", "Column", "Grid", "Card"]);

function NodeWrapper({ n, selected, onSelect }: any) {
  const id = `drop:${n.id}`;
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={CONTAINERS.has(n.type) ? setNodeRef : undefined}
      className={cn(
        "cursor-pointer rounded border p-3",
        selected ? "ring-2 ring-primary" : "hover:bg-accent/40",
        isOver ? "border-dashed border-primary" : "",
      )}
      onClick={() => onSelect(n.id)}
    >
      <div className="pointer-events-none">{renderNode(n, {}, {})}</div>
      {isOver && <div className="mt-2 text-xs text-primary">Drop inside {n.type}</div>}
    </div>
  );
}

export default function Canvas() {
  const setSel = useAppStore((s) => s.setSelection);
  const remove = useAppStore((s) => s.removeNode);
  const sel = useAppStore((s) => s.selection);
  const page = getCurrentPage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel([]);
      if ((e.key === "Delete" || e.key === "Backspace") && sel[0]) {
        remove(sel[0]);
        setSel([]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSel, sel, remove]);

  return (
    <Card className="relative w-full min-h-full p-4">
      <DropArea>
        {(page?.root.children || []).map((n) => (
          <NodeWrapper key={n.id} n={n} selected={sel.includes(n.id)} onSelect={(id: string) => setSel([id])} />
        ))}
      </DropArea>
      <div className="absolute right-4 top-4">
        <Tree />
      </div>
    </Card>
  );
}
