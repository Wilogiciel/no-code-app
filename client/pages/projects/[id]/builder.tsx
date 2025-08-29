import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "@/editor/store/appStore";
import Palette from "@/editor/palette/Palette";
import Canvas from "@/editor/canvas/Canvas";
import Inspector from "@/editor/inspector/Inspector";
import PreviewSheet from "@/editor/preview/PreviewSheet";

export default function BuilderPage() {
  const { id } = useParams();
  const load = useAppStore((s) => s.loadApp);
  const save = useAppStore((s) => s.saveApp);

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  useEffect(() => {
    const t = setInterval(() => save(), 800);
    return () => clearInterval(t);
  }, [save]);

  return (
    <section className="h-[calc(100vh-4rem)]">
      <div className="flex h-full">
        <div className="w-72 shrink-0"><Palette /></div>
        <div className="flex-1 p-3"><Canvas /></div>
        <div className="w-80 shrink-0"><Inspector /></div>
      </div>
      <div className="fixed bottom-6 right-6"><PreviewSheet /></div>
    </section>
  );
}
