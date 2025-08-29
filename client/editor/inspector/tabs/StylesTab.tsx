import { useAppStore, getNodeById } from "@/editor/store/appStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function mergeClass(base: string, add: string, remove: string[]): string {
  const parts = new Set((base || "").split(/\s+/).filter(Boolean));
  remove.forEach((r) => parts.delete(r));
  add.split(/\s+/).forEach((t) => t && parts.add(t));
  return Array.from(parts).join(" ");
}

export default function StylesTab() {
  const sel = useAppStore((s) => s.selection);
  const node = sel[0] ? getNodeById(sel[0]) : null;
  const update = useAppStore((s) => s.updateProps);
  if (!node) return <div className="text-sm text-muted-foreground">Select a component</div>;

  const cls = node.props.className || "";
  function set(add: string, remove: string[]) {
    update(node.id, { className: mergeClass(cls, add, remove) });
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>Border</Label>
        <div className="flex items-center gap-2">
          <Switch checked={/\bborder\b/.test(cls)} onCheckedChange={(v) => set(v ? "border" : "", ["border", "border-0"])} />
          <span className="text-sm text-muted-foreground">Show border</span>
        </div>
      </div>
      <div>
        <Label>Radius</Label>
        <Select onValueChange={(v) => set(v, ["rounded-none","rounded","rounded-sm","rounded-md","rounded-lg","rounded-xl","rounded-2xl"]) }>
          <SelectTrigger><SelectValue placeholder="rounded" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rounded-none">none</SelectItem>
            <SelectItem value="rounded-sm">sm</SelectItem>
            <SelectItem value="rounded">base</SelectItem>
            <SelectItem value="rounded-md">md</SelectItem>
            <SelectItem value="rounded-lg">lg</SelectItem>
            <SelectItem value="rounded-xl">xl</SelectItem>
            <SelectItem value="rounded-2xl">2xl</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Shadow</Label>
        <Select onValueChange={(v) => set(v, ["shadow-none","shadow-sm","shadow","shadow-md","shadow-lg"]) }>
          <SelectTrigger><SelectValue placeholder="shadow" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="shadow-none">none</SelectItem>
            <SelectItem value="shadow-sm">sm</SelectItem>
            <SelectItem value="shadow">base</SelectItem>
            <SelectItem value="shadow-md">md</SelectItem>
            <SelectItem value="shadow-lg">lg</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Padding</Label>
        <Input placeholder="e.g. p-4 px-6" value={cls.split(" ").filter((x)=>/^p[trblxy]?-[0-9]+$/.test(x)).join(" ")}
          onChange={(e) => {
            const tokens = cls.split(" ").filter((x)=>!/^p[trblxy]?-[0-9]+$/.test(x));
            update(node.id, { className: [...tokens, e.target.value].join(" ") });
          }} />
      </div>
      <div>
        <Label>Raw classes</Label>
        <Input value={cls} onChange={(e) => update(node.id, { className: e.target.value })} />
      </div>
    </div>
  );
}
