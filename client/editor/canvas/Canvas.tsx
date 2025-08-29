import { useDroppable, DndContext, DragEndEvent } from "@dnd-kit/core";
import { useAppStore, getCurrentPage } from "@/editor/store/appStore";
import { ComponentNode } from "@/editor/types";
import { CATALOG } from "@/editor/components-catalog/catalog";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

function DropArea() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  return (
    <div ref={setNodeRef} className="min-h-[600px] rounded-lg border bg-background p-6">
      <div className="text-sm text-muted-foreground">Drop components here</div>
      {isOver && <div className="mt-2 rounded border-2 border-dashed border-primary/50 p-6" />}
    </div>
  );
}

export default function Canvas() {
  const addNode = useAppStore((s) => s.addNode);
  const setSel = useAppStore((s) => s.setSelection);
  const page = getCurrentPage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel([]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSel]);

  function handleDrop(e: DragEndEvent) {
    const data = e.active.data.current as any;
    if (e.over?.id === "canvas" && data?.type) {
      const catalog = CATALOG.find((c) => c.type === data.type);
      const node: ComponentNode = {
        id: crypto.randomUUID(),
        type: data.type,
        name: data.type,
        props: { ...(catalog?.defaults || {}) },
        children: [],
      };
      addNode(page!.root.id, node);
      setSel([node.id]);
    }
  }

  return (
    <DndContext onDragEnd={handleDrop}>
      <Card className="h-full w-full p-4">
        <DropArea />
      </Card>
    </DndContext>
  );
}
