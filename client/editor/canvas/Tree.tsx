import { getCurrentPage, useAppStore } from "@/editor/store/appStore";
import { cn } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/core";

const CONTAINERS = new Set([
  "Row",
  "Column",
  "Grid",
  "Card",
  "Dialog",
  "Sheet",
  "Drawer",
  "Slide",
  "Animate",
  "Tabs",
  "Forms",
  "Form",
  "Root",
]);

function NodeItem({ id, level }: { id: string; level: number }) {
  const hist = useAppStore((s) => s.history);
  const sel = useAppStore((s) => s.selection);
  const setSel = useAppStore((s) => s.setSelection);
  const remove = useAppStore((s) => s.removeNode);
  if (!hist) return null;

  const page = hist.present.pages[0];
  function find(n: any): any {
    if (n.id === id) return n;
    for (const c of n.children || []) {
      const f = find(c);
      if (f) return f;
    }
    return null;
  }
  const node = find(page.root);
  if (!node) return null;

  const dropId = `drop:${id}`;
  const canDrop = CONTAINERS.has(node.type);
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: dropId });
  const { attributes, listeners, setNodeRef: setDragRef } = useDraggable({ id: `move:${id}`, data: { moveId: id } });

  return (
    <div
      ref={canDrop ? setDropRef : undefined}
      className={cn("flex items-center justify-between text-xs rounded", level > 0 && "pl-2", isOver && "bg-accent/50")}
    >
      <button
        ref={setDragRef as any}
        {...listeners}
        {...attributes}
        className={cn(
          "truncate rounded px-1 py-0.5 text-left hover:bg-accent",
          sel.includes(id) && "bg-accent text-foreground",
        )}
        onClick={() => setSel([id])}
        title={node.type}
      >
        {"".padStart(level * 2, "")} {node.id}
      </button>
      <button
        className="ml-2 rounded px-1 text-muted-foreground hover:text-destructive"
        onClick={() => remove(id)}
        aria-label="Delete"
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}

function renderIds(n: any, level: number, acc: JSX.Element[] = []): JSX.Element[] {
  acc.push(<NodeItem key={n.id} id={n.id} level={level} />);
  for (const c of n.children || []) renderIds(c, level + 1, acc);
  return acc;
}

export default function Tree() {
  const page = getCurrentPage();
  if (!page) return null;
  return (
    <div className="rounded-md border bg-background/80 p-2 shadow-sm">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hierarchy</div>
      <div className="max-h-64 w-56 overflow-auto pr-1">
        {renderIds(page.root, 0)}
      </div>
    </div>
  );
}
