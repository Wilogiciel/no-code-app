export type CatalogItem = { type: string; title: string; icon?: string; defaults?: Record<string, any>; category: string };

export const CATALOG: CatalogItem[] = [
  { type: "Text", title: "Text", category: "Basics", defaults: { text: "Text" } },
  { type: "Heading", title: "Heading", category: "Basics", defaults: { level: 2, text: "Heading" } },
  { type: "Button", title: "Button", category: "Basics", defaults: { variant: "default", text: "Button" } },
  { type: "Input", title: "Input", category: "Forms", defaults: { placeholder: "Type..." } },
  { type: "Textarea", title: "Textarea", category: "Forms", defaults: { placeholder: "Write..." } },
  { type: "Select", title: "Select", category: "Forms", defaults: { options: ["One", "Two"] } },
  { type: "Switch", title: "Switch", category: "Forms", defaults: { checked: false } },
  { type: "Card", title: "Card", category: "Layout", defaults: { title: "Card title" } },
  { type: "Row", title: "Row (Flex)", category: "Layout", defaults: { align: "center", justify: "start", gap: "4" } },
  { type: "Column", title: "Column (Flex)", category: "Layout", defaults: { align: "start", justify: "start", gap: "4" } },
  { type: "Grid", title: "Grid", category: "Layout", defaults: { cols: 2, gap: "4" } },
  { type: "Tabs", title: "Tabs", category: "Layout", defaults: { tabs: ["One","Two"] } },
  { type: "Table", title: "Table", category: "Data", defaults: {} },
  { type: "Alert", title: "Alert", category: "Feedback", defaults: { variant: "default", text: "Notice" } },
  { type: "Badge", title: "Badge", category: "Feedback", defaults: { text: "Badge" } },
  { type: "Image", title: "Image", category: "Media", defaults: { src: "https://picsum.photos/400/200", alt: "Image" } },
  { type: "Separator", title: "Separator", category: "Layout", defaults: {} },
];

export const CATEGORIES = Array.from(new Set(CATALOG.map((c) => c.category)));
