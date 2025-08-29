import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore, getCurrentPage } from "@/editor/store/appStore";
import Palette from "@/editor/palette/Palette";
import Canvas from "@/editor/canvas/Canvas";
import Inspector from "@/editor/inspector/Inspector";
import PreviewSheet from "@/editor/preview/PreviewSheet";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { CATALOG } from "@/editor/components-catalog/catalog";
import { ComponentNode } from "@/editor/types";

export default function BuilderPage() {
  const { id } = useParams();
  const load = useAppStore((s) => s.loadApp);
  const save = useAppStore((s) => s.saveApp);
  const addNode = useAppStore((s) => s.addNode);
  const setSel = useAppStore((s) => s.setSelection);

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  useEffect(() => {
    const t = setInterval(() => save(), 800);
    return () => clearInterval(t);
  }, [save]);

  function handleDrop(e: DragEndEvent) {
    const data = e.active.data.current as any;
    if (e.over?.id === "canvas" && data?.type) {
      const page = getCurrentPage();
      if (!page) return;
      const catalog = CATALOG.find((c) => c.type === data.type);
      const node: ComponentNode = {
        id: crypto.randomUUID(),
        type: data.type,
        name: data.type,
        props: { ...(catalog?.defaults || {}) },
        children: [],
      };
      addNode(page.root.id, node);
      setSel([node.id]);
    }
  }

  const hist = useAppStore((s) => s.history);
  const seed = useAppStore((s) => s.seedSample);
  const empty = !hist?.present.pages[0].root.children?.length;
  return (
    <section className="h-[calc(100vh-4rem)]">
      {empty && (
        <div className="border-b bg-muted/30 px-4 py-2 text-sm">Empty project — <button className="underline" onClick={seed}>Create sample app</button></div>
      )}
      <DndContext onDragEnd={handleDrop}>
        <div className="flex h-full">
          <div className="w-72 shrink-0"><Palette /></div>
          <div className="flex-1 p-3"><Canvas /></div>
          <div className="w-80 shrink-0"><Inspector /></div>
        </div>
      </DndContext>
      <div className="fixed bottom-6 right-6"><PreviewSheet /></div>
    </section>
  );
}
