export type WorkflowAction =
  | { type: "navigate"; to: string }
  | { type: "setVar"; name: string; valueExpr: string }
  | {
      type: "callRest";
      dataSourceId: string;
      path: string;
      method: "GET" | "POST" | "PUT" | "DELETE";
      bodyExpr?: string;
      assignToVar?: string;
    }
  | { type: "toast"; messageExpr: string; variant?: "success" | "error" | "info" }
  | { type: "openDialog"; dialogId: string }
  | { type: "closeDialog"; dialogId: string };

export type ComponentEvent = {
  id: string;
  trigger: string; // "onClick" | "onSubmit" | "onChange" | ...
  actions: WorkflowAction[];
};

export type ComponentNode = {
  id: string;
  type: string; // "Button" | "Text" | "Input" | "Card" | ...
  name?: string;
  props: Record<string, any>;
  bindings?: Record<string, string>;
  children?: ComponentNode[];
  layout?: { x?: number; y?: number; w?: number; h?: number };
  events?: ComponentEvent[];
};

export type PageSchema = { id: string; name: string; root: ComponentNode };

export type DataSource =
  | { id: string; kind: "rest"; name: string; baseUrl: string; headers?: Record<string, string> }
  | { id: string; kind: "static"; name: string; data: any };

export type VariableDef = {
  id: string;
  name: string;
  type: "string" | "number" | "bool" | "object" | "array" | "date";
  initial?: any;
  scope: "app" | "page";
};

export type AppSchema = {
  id: string;
  name: string;
  pages: PageSchema[];
  dataSources: DataSource[];
  variables: VariableDef[];
  theme?: {
    primary: string; // H S L (no hsl())
    secondary: string; // H S L
    darkPrimary?: string; // H S L for dark mode
    darkSecondary?: string; // H S L for dark mode
  };
  nav?: {
    align?: "left" | "center" | "right";
    className?: string;
  };
};

export type SelectionState = { selectedIds: string[] };
