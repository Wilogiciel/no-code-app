import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppStore, getCurrentPage } from "@/editor/store/appStore";
import Palette from "@/editor/palette/Palette";
import Canvas from "@/editor/canvas/Canvas";
import Inspector from "@/editor/inspector/Inspector";
import PreviewSheet from "@/editor/preview/PreviewSheet";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { CATALOG } from "@/editor/components-catalog/catalog";
import { ComponentNode, PageSchema } from "@/editor/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const hist = useAppStore((s) => s.history);
  useEffect(() => {
    const app = hist?.present;
    if (!app?.theme) return;
    const root = document.documentElement;
    root.style.setProperty("--primary", app.theme.primary);
    root.style.setProperty("--ring", app.theme.primary);
    root.style.setProperty("--secondary", app.theme.secondary);
  }, [hist]);

  function handleDrop(e: DragEndEvent) {
    const data = e.active.data.current as any;
    if (!e.over) return;
    const page = getCurrentPage();
    if (!page) return;
    const overId = String(e.over.id);

    // Move existing node
    if (data?.moveId) {
      const moveNode = useAppStore.getState().moveNode;
      let parentId = page.root.id;
      let index: number | undefined = undefined;
      if (overId === "canvas") {
        parentId = page.root.id;
      } else if (overId.startsWith("slot:root:")) {
        parentId = page.root.id;
        index = parseInt(overId.split(":").pop() || "0", 10);
      } else if (overId.startsWith("drop:")) {
        parentId = overId.slice(5);
        index = undefined; // append inside container
      }
      moveNode(data.moveId, parentId, index);
      setSel([data.moveId]);
      return;
    }

    // Add from palette
    if (!data?.type) return;
    let parentId = page.root.id;
    if (overId === "canvas") parentId = page.root.id;
    else if (overId.startsWith("drop:")) parentId = overId.slice(5);

    const catalog = CATALOG.find((c) => c.type === data.type);
    const node: ComponentNode = {
      id: crypto.randomUUID(),
      type: data.type,
      name: data.type,
      props: { ...(catalog?.defaults || {}) },
      children: [],
    };
    addNode(parentId, node);
    setSel([node.id]);
  }

  const seed = useAppStore((s) => s.seedSample);
  const empty = !hist?.present.pages[0].root.children?.length;
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const updateApp = useAppStore((s) => s.updateApp);
  const addPage = useAppStore((s) => s.addPage);
  const app = hist?.present;
  const [openNewPage, setOpenNewPage] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [pageName, setPageName] = useState("");
  const [navAlign, setNavAlign] = useState(app?.nav?.align || "left");
  const [navClass, setNavClass] = useState(app?.nav?.className || "");

  function createPage() {
    const id = crypto.randomUUID();
    const page: PageSchema = { id, name: pageName || `Page ${app?.pages.length ? app.pages.length + 1 : 1}`, root: { id: crypto.randomUUID(), type: "Root", props: {}, children: [] } };
    addPage(page);
    setCurrentPage(page.id);
    setOpenNewPage(false);
    setPageName("");
  }

  function saveNav() {
    updateApp({ nav: { align: navAlign as any, className: navClass } });
    setOpenNav(false);
  }

  const justify = app?.nav?.align === "center" ? "justify-center" : app?.nav?.align === "right" ? "justify-end" : "justify-start";

  return (
    <section className="h-[calc(100vh-4rem)]">
      <div className={`flex items-center gap-2 border-b bg-background/70 px-3 py-2 ${app?.nav?.className || ""} ${justify}`}>
        <div className="flex flex-wrap items-center gap-2">
          {(app?.pages || []).map((p) => (
            <Button key={p.id} variant={getCurrentPage()?.id === p.id ? "default" : "outline"} onClick={() => setCurrentPage(p.id)}>{p.name}</Button>
          ))}
          <Dialog open={openNewPage} onOpenChange={setOpenNewPage}>
            <DialogTrigger asChild><Button variant="secondary">+ New Page</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create page</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Label htmlFor="pname">Name</Label>
                <Input id="pname" value={pageName} onChange={(e) => setPageName(e.target.value)} />
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpenNewPage(false)}>Cancel</Button>
                  <Button onClick={createPage}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="ml-auto">
          <Dialog open={openNav} onOpenChange={setOpenNav}>
            <DialogTrigger asChild><Button variant="outline">Nav settings</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Navigation settings</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Alignment</Label>
                  <Select value={navAlign} onValueChange={setNavAlign}>
                    <SelectTrigger><SelectValue placeholder="align" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">left</SelectItem>
                      <SelectItem value="center">center</SelectItem>
                      <SelectItem value="right">right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Extra classes</Label>
                  <Input value={navClass} onChange={(e) => setNavClass(e.target.value)} placeholder="e.g. bg-muted/50 backdrop-blur" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpenNav(false)}>Cancel</Button>
                  <Button onClick={saveNav}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {empty && (
        <div className="border-b bg-muted/30 px-4 py-2 text-sm">Empty project — <button className="underline" onClick={seed}>Create sample app</button></div>
      )}
      <DndContext onDragEnd={handleDrop}>
        <div className="flex h-full">
          <div className="w-72 shrink-0"><Palette /></div>
          <div className="flex-1 min-h-0 overflow-y-auto p-3"><Canvas /></div>
          <div className="w-80 shrink-0"><Inspector /></div>
        </div>
      </DndContext>
      <div className="fixed bottom-6 right-6"><PreviewSheet /></div>
    </section>
  );
}
