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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

function findFirstByType(
  n: ComponentNode | null | undefined,
  type: string,
): ComponentNode | null {
  if (!n) return null;
  if (n.type === type) return n;
  for (const c of n.children || []) {
    const f = findFirstByType(c, type);
    if (f) return f;
  }
  return null;
}

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
  const updateProps = useAppStore((s) => s.updateProps);
  const addPage = useAppStore((s) => s.addPage);
  const removePage = useAppStore((s) => s.removePage);
  const app = hist?.present;
  const [openNewPage, setOpenNewPage] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [pageName, setPageName] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [navAlign, setNavAlign] = useState("left");
  const [navClass, setNavClass] = useState("");
  const [showTheme, setShowTheme] = useState(true);

  useEffect(() => {
    if (!openNav) return;
    const page = getCurrentPage();
    const menu = findFirstByType(page?.root as any, "Menu");
    if (menu) {
      setMenuId(menu.id);
      setNavAlign(menu.props?.align || "left");
      setNavClass(menu.props?.className || "");
      setShowTheme(menu.props?.showTheme !== false);
    }
  }, [openNav, hist]);

  function createPage() {
    const id = crypto.randomUUID();
    const curPage = getCurrentPage();
    const existingMenu = findFirstByType(curPage?.root as any, "Menu");
    const menuProps = existingMenu?.props || { align: app?.nav?.align || "left", className: app?.nav?.className || "", showTheme: true };
    const menuNode: ComponentNode = { id: crypto.randomUUID(), type: "Menu", props: menuProps, children: [] };
    const page: PageSchema = {
      id,
      name: pageName || `Page ${app?.pages.length ? app.pages.length + 1 : 1}`,
      root: { id: crypto.randomUUID(), type: "Root", props: {}, children: [menuNode] },
    };
    addPage(page);
    setCurrentPage(page.id);
    setOpenNewPage(false);
    setPageName("");
  }

  function saveNav() {
    if (menuId) {
      updateProps(menuId, {
        align: navAlign as any,
        className: navClass,
        showTheme,
      });
    }
    // Keep builder top bar in sync visually
    updateApp({ nav: { align: navAlign as any, className: navClass } });
    setOpenNav(false);
  }

  const justify =
    app?.nav?.align === "center"
      ? "justify-center"
      : app?.nav?.align === "right"
        ? "justify-end"
        : "justify-start";

  return (
    <section className="h-[calc(100vh-4rem)]">
      <div
        className={`flex items-center gap-2 border-b bg-background/70 px-3 py-2 ${app?.nav?.className || ""} ${justify}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {(app?.pages || []).map((p) => (
            <div key={p.id} className="flex items-center gap-1">
              <Button
                variant={getCurrentPage()?.id === p.id ? "default" : "outline"}
                onClick={() => setCurrentPage(p.id)}
              >
                {p.name}
              </Button>
              {(app?.pages?.length || 0) > 1 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Delete ${p.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete page</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove the page "{p.name}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removePage(p.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
          <Dialog open={openNewPage} onOpenChange={setOpenNewPage}>
            <DialogTrigger asChild>
              <Button variant="secondary">+ New Page</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create page</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label htmlFor="pname">Name</Label>
                <Input
                  id="pname"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setOpenNewPage(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createPage}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="ml-auto">
          <Dialog open={openNav} onOpenChange={setOpenNav}>
            <DialogTrigger asChild>
              <Button variant="outline">Nav settings</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Navigation settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Alignment</Label>
                  <Select value={navAlign} onValueChange={setNavAlign}>
                    <SelectTrigger>
                      <SelectValue placeholder="align" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">left</SelectItem>
                      <SelectItem value="center">center</SelectItem>
                      <SelectItem value="right">right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Extra classes</Label>
                  <Input
                    value={navClass}
                    onChange={(e) => setNavClass(e.target.value)}
                    placeholder="e.g. bg-muted/50 backdrop-blur"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show dark mode switch in menu</Label>
                  <Switch
                    checked={showTheme}
                    onCheckedChange={setShowTheme}
                    disabled={
                      !(app?.theme?.darkPrimary && app?.theme?.darkSecondary)
                    }
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpenNav(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveNav}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {empty && (
        <div className="border-b bg-muted/30 px-4 py-2 text-sm">
          Empty project —{" "}
          <button className="underline" onClick={seed}>
            Create sample app
          </button>
        </div>
      )}
      <DndContext onDragEnd={handleDrop}>
        <div className="flex h-full">
          <div className="w-72 shrink-0">
            <Palette />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-3">
            <Canvas />
          </div>
          <div className="w-80 shrink-0">
            <Inspector />
          </div>
        </div>
      </DndContext>
      <div className="fixed bottom-6 right-6">
        <PreviewSheet />
      </div>
    </section>
  );
}
