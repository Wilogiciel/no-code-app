import { create } from "zustand";
import {
  AppSchema,
  ComponentNode,
  PageSchema,
  VariableDef,
  DataSource,
} from "@/editor/types";
import {
  createHistory,
  HistoryState,
  push,
  redo,
  undo,
} from "@/editor/history/undoRedo";

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

function updateNode(
  root: ComponentNode,
  id: string,
  updater: (n: ComponentNode) => void,
): ComponentNode {
  if (root.id === id) {
    const copy = {
      ...root,
      children: root.children ? [...root.children] : undefined,
    };
    updater(copy);
    return copy;
  }
  const children = root.children?.map((c) => updateNode(c, id, updater));
  return { ...root, children } as ComponentNode;
}

function removeNode(root: ComponentNode, id: string): ComponentNode {
  const children = (root.children || [])
    .filter((c) => c.id !== id)
    .map((c) => removeNode(c, id));
  return { ...root, children } as ComponentNode;
}

export type AppStore = {
  appId: string | null;
  history: HistoryState<AppSchema> | null;
  selection: string[];
  currentPageId: string | null;
  canvasDark: boolean;
  loadApp: (appId: string) => void;
  saveApp: () => void;
  setSelection: (ids: string[]) => void;
  setCurrentPage: (pageId: string) => void;
  setCanvasDark: (v: boolean) => void;
  updateApp: (patch: Partial<AppSchema>) => void;
  addNode: (parentId: string, node: ComponentNode) => void;
  removeNode: (id: string) => void;
  moveNode: (id: string, newParentId: string, index?: number) => void;
  updateProps: (id: string, props: Record<string, any>) => void;
  updateBindings: (id: string, bindings: Record<string, string>) => void;
  addPage: (page: PageSchema) => void;
  removePage: (pageId: string) => void;
  addVariable: (v: VariableDef) => void;
  addDataSource: (ds: DataSource) => void;
  seedSample: () => void;
  generateId: (type: string) => string;
  undo: () => void;
  redo: () => void;
};

function storageKey(id: string) {
  return `app:${id}`;
}

function isDescendant(
  root: ComponentNode,
  ancestorId: string,
  targetId: string,
): boolean {
  function find(n: ComponentNode): boolean {
    if (n.id === ancestorId) {
      return contains(n, targetId);
    }
    return (n.children || []).some(find);
  }
  function contains(n: ComponentNode, id: string): boolean {
    if (n.id === id) return true;
    return (n.children || []).some((c) => contains(c, id));
  }
  return find(root);
}

function detachNode(
  root: ComponentNode,
  id: string,
): { root: ComponentNode; node: ComponentNode | null } {
  if (!root.children || root.children.length === 0) return { root, node: null };
  let extracted: ComponentNode | null = null;
  const children = root.children
    .map((c) => {
      if (c.id === id) {
        extracted = c;
        return null as any;
      }
      const res = detachNode(c, id);
      if (res.node) extracted = res.node;
      return res.root;
    })
    .filter(Boolean) as ComponentNode[];
  const newRoot = { ...root, children } as ComponentNode;
  return { root: newRoot, node: extracted };
}

function insertAt(
  root: ComponentNode,
  parentId: string,
  node: ComponentNode,
  index?: number,
): ComponentNode {
  return updateNode(root, parentId, (n) => {
    const arr = n.children ? [...n.children] : [];
    const i =
      typeof index === "number" && index >= 0 && index <= arr.length
        ? index
        : arr.length;
    arr.splice(i, 0, node);
    (n as any).children = arr;
  });
}

export const useAppStore = create<AppStore>((set, get) => ({
  appId: null,
  history: null,
  selection: [],
  currentPageId: null,
  canvasDark: false,
  loadApp: (appId) => {
    const raw = localStorage.getItem(storageKey(appId));
    let app: AppSchema;
    if (raw) app = JSON.parse(raw);
    else {
      // Build initial app with deterministic component IDs
      const used = new Set<string>();
      const gen = (type: string) => {
        let i = 1;
        let id = `${type}-${i}`;
        while (used.has(id)) {
          i++;
          id = `${type}-${i}`;
        }
        used.add(id);
        return id;
      };
      app = {
        id: appId,
        name: "Untitled",
        pages: [
          {
            id: crypto.randomUUID(),
            name: "Home",
            root: {
              id: gen("Root"),
              type: "Root",
              props: {},
              children: [
                {
                  id: gen("Menu"),
                  type: "Menu",
                  props: { align: "left", showTheme: true },
                  children: [],
                },
              ],
            },
          },
        ],
        dataSources: [],
        variables: [],
        theme: { primary: "258 85% 58%", secondary: "220 40% 96%" },
        backend: { kind: "rest", baseUrl: "" },
      };
    }
    const canvasDark = localStorage.getItem(`canvasDark:${appId}`) === "1";
    set({
      appId,
      history: createHistory(app),
      currentPageId: app.pages[0].id,
      canvasDark,
    });
  },
  saveApp: () => {
    const id = get().appId;
    const hist = get().history;
    if (!id || !hist) return;
    localStorage.setItem(storageKey(id), JSON.stringify(hist.present));
  },
  setSelection: (ids) => set({ selection: ids }),
  setCurrentPage: (pageId) => set({ currentPageId: pageId }),
  setCanvasDark: (v) => {
    const id = get().appId;
    if (id) localStorage.setItem(`canvasDark:${id}`, v ? "1" : "0");
    set({ canvasDark: v });
  },
  updateApp: (patch) => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    set({ history: push(hist, { ...app, ...patch }) });
  },
  addNode: (parentId, node) => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    // Ensure node has an ID in the ComponentType-N format
    const idSet = new Set<string>();
    for (const pg of app.pages) {
      (function collect(n: ComponentNode) {
        idSet.add(n.id);
        for (const c of n.children || []) collect(c);
      })(pg.root);
    }
    if (!node.id || idSet.has(node.id)) {
      let i = 1;
      let newId = `${node.type}-${i}`;
      while (idSet.has(newId)) {
        i++;
        newId = `${node.type}-${i}`;
      }
      node = { ...node, id: newId };
    }
    const pages = app.pages.map((p) => ({
      ...p,
      root: updateNode(p.root, parentId, (n) => {
        const children = n.children ? [...n.children] : [];
        children.push(node);
        (n as any).children = children;
      }),
    }));
    set({ history: push(hist, { ...app, pages }) });
  },
  removeNode: (id) => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    const pages = app.pages.map((p) => ({
      ...p,
      root: removeNode(p.root, id),
    }));
    set({ history: push(hist, { ...app, pages }) });
  },
  moveNode: (id, newParentId, index) => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    const page = app.pages[0];
    if (!page) return;
    if (id === newParentId) return; // cannot parent to self
    // prevent moving under its own subtree
    if (isDescendant(page.root, id, newParentId)) return;
    const det = detachNode(page.root, id);
    if (!det.node) return;
    const nextRoot = insertAt(det.root, newParentId, det.node, index);
    const pages = [{ ...page, root: nextRoot }];
    set({ history: push(hist, { ...app, pages }) });
  },
  updateProps: (id, props) => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    const pages = app.pages.map((p) => ({
      ...p,
      root: updateNode(p.root, id, (n) => {
        n.props = { ...n.props, ...props };
      }),
    }));
    set({ history: push(hist, { ...app, pages }) });
  },
  updateBindings: (id, bindings) => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    const pages = app.pages.map((p) => ({
      ...p,
      root: updateNode(p.root, id, (n) => {
        n.bindings = { ...(n.bindings || {}), ...bindings };
      }),
    }));
    set({ history: push(hist, { ...app, pages }) });
  },
  addPage: (page) => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    const next = { ...app, pages: [...app.pages, page] };
    set({ history: push(hist, next), currentPageId: page.id });
  },
  removePage: (pageId) => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    if (app.pages.length <= 1) return; // keep at least one page
    const pages = app.pages.filter((p) => p.id !== pageId);
    let nextCurrent = get().currentPageId;
    if (!pages.find((p) => p.id === nextCurrent)) {
      nextCurrent = pages[0]?.id || null;
    }
    set({ history: push(hist, { ...app, pages }), currentPageId: nextCurrent });
  },
  addVariable: (v) => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    set({ history: push(hist, { ...app, variables: [...app.variables, v] }) });
  },
  addDataSource: (ds) => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    set({
      history: push(hist, { ...app, dataSources: [...app.dataSources, ds] }),
    });
  },
  seedSample: () => {
    const hist = get().history;
    if (!hist) return;
    const app = hist.present;
    const page = getCurrentPage()!;
    const root = page.root;

    // Build a used ID set and a local generator that considers both existing and new IDs
    const used = new Set<string>();
    (function collectAll() {
      for (const pg of app.pages) {
        (function collect(n: ComponentNode) {
          used.add(n.id);
          for (const c of n.children || []) collect(c);
        })(pg.root);
      }
    })();
    const gen = (type: string) => {
      let i = 1;
      let id = `${type}-${i}`;
      while (used.has(id)) {
        i++;
        id = `${type}-${i}`;
      }
      used.add(id);
      return id;
    };

    const button1: ComponentNode = {
      id: gen("Button"),
      type: "Button",
      name: "SayHi",
      props: { text: "Say hi" },
      children: [],
    };
    const button2: ComponentNode = {
      id: gen("Button"),
      type: "Button",
      name: "LoadPosts",
      props: { text: "Load posts" },
      children: [],
    };
    const card: ComponentNode = {
      id: gen("Card"),
      type: "Card",
      props: { title: "Sample" },
      children: [
        {
          id: gen("Heading"),
          type: "Heading",
          props: { level: 3, text: "Welcome" },
          children: [],
        },
        button1,
        button2,
        { id: gen("Table"), type: "Table", props: {}, children: [] },
      ],
    };
    const variables = [
      {
        id: crypto.randomUUID(),
        name: "username",
        scope: "app" as const,
        type: "string" as const,
        initial: "World",
      },
      {
        id: crypto.randomUUID(),
        name: "posts",
        scope: "app" as const,
        type: "array" as const,
        initial: [],
      },
    ];
    const dataSources = [
      {
        id: crypto.randomUUID(),
        kind: "rest" as const,
        name: "jsonplaceholder",
        baseUrl: "https://jsonplaceholder.typicode.com",
      },
    ];
    const newApp = {
      ...app,
      variables,
      dataSources,
      pages: [{ ...page, root: { ...root, children: [card] } }],
    };
    set({ history: push(hist, newApp) });
  },
  generateId: (type: string) => {
    const hist = get().history;
    const app = hist?.present;
    const used = new Set<string>();
    if (app) {
      for (const pg of app.pages) {
        (function collect(n: ComponentNode) {
          used.add(n.id);
          for (const c of n.children || []) collect(c);
        })(pg.root);
      }
    }
    let i = 1;
    let id = `${type}-${i}`;
    while (used.has(id)) {
      i++;
      id = `${type}-${i}`;
    }
    return id;
  },
  undo: () => {
    const hist = get().history;
    if (!hist) return;
    set({ history: undo(hist) });
  },
  redo: () => {
    const hist = get().history;
    if (!hist) return;
    set({ history: redo(hist) });
  },
}));

export function getCurrentPage(): PageSchema | null {
  const { history, currentPageId } = useAppStore.getState();
  if (!history) return null;
  const pages = history.present.pages;
  if (!pages.length) return null;
  if (currentPageId)
    return pages.find((p) => p.id === currentPageId) || pages[0];
  return pages[0];
}

export function getNodeById(id: string): ComponentNode | null {
  const page = getCurrentPage();
  if (!page) return null;
  return (function find(n: ComponentNode): ComponentNode | null {
    if (n.id === id) return n;
    for (const c of n.children || []) {
      const f = find(c);
      if (f) return f;
    }
    return null;
  })(page.root);
}
