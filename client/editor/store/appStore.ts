import { create } from "zustand";
import { AppSchema, ComponentNode, PageSchema, VariableDef, DataSource } from "@/editor/types";
import { createHistory, HistoryState, push, redo, undo } from "@/editor/history/undoRedo";

export const USE_API = false;

function findNode(root: ComponentNode, id: string): ComponentNode | null {
  if (root.id === id) return root;
  if (!root.children) return null;
  for (const c of root.children) {
    const found = findNode(c, id);
    if (found) return found;
  }
  return null;
}

function updateNode(root: ComponentNode, id: string, updater: (n: ComponentNode) => void): ComponentNode {
  if (root.id === id) {
    const copy = { ...root, children: root.children ? [...root.children] : undefined };
    updater(copy);
    return copy;
  }
  const children = root.children?.map((c) => updateNode(c, id, updater));
  return { ...root, children } as ComponentNode;
}

function removeNode(root: ComponentNode, id: string): ComponentNode {
  const children = (root.children || []).filter((c) => c.id !== id).map((c) => removeNode(c, id));
  return { ...root, children } as ComponentNode;
}

export type AppStore = {
  appId: string | null;
  history: HistoryState<AppSchema> | null;
  selection: string[];
  loadApp: (appId: string) => void;
  saveApp: () => void;
  setSelection: (ids: string[]) => void;
  addNode: (parentId: string, node: ComponentNode) => void;
  removeNode: (id: string) => void;
  updateProps: (id: string, props: Record<string, any>) => void;
  updateBindings: (id: string, bindings: Record<string, string>) => void;
  addPage: (page: PageSchema) => void;
  addVariable: (v: VariableDef) => void;
  addDataSource: (ds: DataSource) => void;
  seedSample: () => void;
  undo: () => void;
  redo: () => void;
};

function storageKey(id: string) {
  return `app:${id}`;
}

export const useAppStore = create<AppStore>((set, get) => ({
  appId: null,
  history: null,
  selection: [],
  loadApp: (appId) => {
    const raw = localStorage.getItem(storageKey(appId));
    let app: AppSchema;
    if (raw) app = JSON.parse(raw);
    else {
      app = {
        id: appId,
        name: "Untitled",
        pages: [
          {
            id: crypto.randomUUID(),
            name: "Home",
            root: { id: crypto.randomUUID(), type: "Root", props: {}, children: [] },
          },
        ],
        dataSources: [],
        variables: [],
      };
    }
    set({ appId, history: createHistory(app) });
  },
  saveApp: () => {
    const id = get().appId;
    const hist = get().history;
    if (!id || !hist) return;
    localStorage.setItem(storageKey(id), JSON.stringify(hist.present));
  },
  setSelection: (ids) => set({ selection: ids }),
  addNode: (parentId, node) => {
    const hist = get().history; if (!hist) return;
    const app = hist.present;
    const pages = app.pages.map((p) =>
      ({ ...p, root: updateNode(p.root, parentId, (n) => {
        const children = n.children ? [...n.children] : [];
        children.push(node);
        (n as any).children = children;
      }) })
    );
    set({ history: push(hist, { ...app, pages }) });
  },
  removeNode: (id) => {
    const hist = get().history; if (!hist) return;
    const app = hist.present;
    const pages = app.pages.map((p) => ({ ...p, root: removeNode(p.root, id) }));
    set({ history: push(hist, { ...app, pages }) });
  },
  updateProps: (id, props) => {
    const hist = get().history; if (!hist) return;
    const app = hist.present;
    const pages = app.pages.map((p) => ({ ...p, root: updateNode(p.root, id, (n) => { n.props = { ...n.props, ...props }; }) }));
    set({ history: push(hist, { ...app, pages }) });
  },
  updateBindings: (id, bindings) => {
    const hist = get().history; if (!hist) return;
    const app = hist.present;
    const pages = app.pages.map((p) => ({ ...p, root: updateNode(p.root, id, (n) => { n.bindings = { ...(n.bindings||{}), ...bindings }; }) }));
    set({ history: push(hist, { ...app, pages }) });
  },
  addPage: (page) => {
    const hist = get().history; if (!hist) return;
    const app = hist.present;
    set({ history: push(hist, { ...app, pages: [...app.pages, page] }) });
  },
  addVariable: (v) => {
    const hist = get().history; if (!hist) return;
    const app = hist.present;
    set({ history: push(hist, { ...app, variables: [...app.variables, v] }) });
  },
  addDataSource: (ds) => {
    const hist = get().history; if (!hist) return;
    const app = hist.present;
    set({ history: push(hist, { ...app, dataSources: [...app.dataSources, ds] }) });
  },
  seedSample: () => {
    const hist = get().history; if (!hist) return;
    const app = hist.present;
    const page = app.pages[0];
    const root = page.root;
    const button1: ComponentNode = { id: crypto.randomUUID(), type: "Button", name: "SayHi", props: { text: "Say hi" }, children: [] };
    const button2: ComponentNode = { id: crypto.randomUUID(), type: "Button", name: "LoadPosts", props: { text: "Load posts" }, children: [] };
    const card: ComponentNode = { id: crypto.randomUUID(), type: "Card", props: { title: "Sample" }, children: [
      { id: crypto.randomUUID(), type: "Heading", props: { level: 3, text: "Welcome" }, children: [] },
      button1,
      button2,
      { id: crypto.randomUUID(), type: "Table", props: {}, children: [] },
    ] };
    const variables = [
      { id: crypto.randomUUID(), name: "username", scope: "app" as const, type: "string" as const, initial: "World" },
      { id: crypto.randomUUID(), name: "posts", scope: "app" as const, type: "array" as const, initial: [] },
    ];
    const dataSources = [ { id: crypto.randomUUID(), kind: "rest" as const, name: "jsonplaceholder", baseUrl: "https://jsonplaceholder.typicode.com" } ];
    const newApp = { ...app, variables, dataSources, pages: [ { ...page, root: { ...root, children: [card] } } ] };
    set({ history: push(hist, newApp) });
  },
  undo: () => {
    const hist = get().history; if (!hist) return;
    set({ history: undo(hist) });
  },
  redo: () => {
    const hist = get().history; if (!hist) return;
    set({ history: redo(hist) });
  },
}));

export function getCurrentPage(): PageSchema | null {
  const { history } = useAppStore.getState();
  if (!history) return null;
  return history.present.pages[0];
}

export function getNodeById(id: string): ComponentNode | null {
  const page = getCurrentPage();
  if (!page) return null;
  return (function find(n: ComponentNode): ComponentNode | null {
    if (n.id === id) return n;
    for (const c of n.children || []) { const f = find(c); if (f) return f; }
    return null;
  })(page.root);
}
