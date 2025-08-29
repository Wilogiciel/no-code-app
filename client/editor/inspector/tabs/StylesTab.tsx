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
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Width</Label>
          <Select onValueChange={(v) => set(v, ["w-auto","w-full","w-1/2","w-1/3","w-2/3","w-1/4","w-3/4","w-64","w-80","w-96"]) }>
            <SelectTrigger><SelectValue placeholder="width" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="w-auto">auto</SelectItem>
              <SelectItem value="w-full">full</SelectItem>
              <SelectItem value="w-1/2">1/2</SelectItem>
              <SelectItem value="w-1/3">1/3</SelectItem>
              <SelectItem value="w-2/3">2/3</SelectItem>
              <SelectItem value="w-1/4">1/4</SelectItem>
              <SelectItem value="w-3/4">3/4</SelectItem>
              <SelectItem value="w-64">w-64</SelectItem>
              <SelectItem value="w-80">w-80</SelectItem>
              <SelectItem value="w-96">w-96</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Height</Label>
          <Select onValueChange={(v) => set(v, ["h-auto","h-full","h-32","h-48","h-64","h-80","h-96"]) }>
            <SelectTrigger><SelectValue placeholder="height" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="h-auto">auto</SelectItem>
              <SelectItem value="h-full">full</SelectItem>
              <SelectItem value="h-32">h-32</SelectItem>
              <SelectItem value="h-48">h-48</SelectItem>
              <SelectItem value="h-64">h-64</SelectItem>
              <SelectItem value="h-80">h-80</SelectItem>
              <SelectItem value="h-96">h-96</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Text align</Label>
          <Select onValueChange={(v) => set(v, ["text-left","text-center","text-right","text-justify"]) }>
            <SelectTrigger><SelectValue placeholder="text-left" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="text-left">left</SelectItem>
              <SelectItem value="text-center">center</SelectItem>
              <SelectItem value="text-right">right</SelectItem>
              <SelectItem value="text-justify">justify</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Font size</Label>
          <Select onValueChange={(v) => set(v, ["text-xs","text-sm","text-base","text-lg","text-xl","text-2xl","text-3xl"]) }>
            <SelectTrigger><SelectValue placeholder="text-base" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="text-xs">xs</SelectItem>
              <SelectItem value="text-sm">sm</SelectItem>
              <SelectItem value="text-base">base</SelectItem>
              <SelectItem value="text-lg">lg</SelectItem>
              <SelectItem value="text-xl">xl</SelectItem>
              <SelectItem value="text-2xl">2xl</SelectItem>
              <SelectItem value="text-3xl">3xl</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Margin</Label>
        <Input placeholder="e.g. m-4 mx-2" value={cls.split(" ").filter((x)=>/^m[trblxy]?-/.test(x)).join(" ")}
          onChange={(e) => {
            const tokens = cls.split(" ").filter((x)=>!/^[m][trblxy]?-/.test(x));
            update(node.id, { className: [...tokens, e.target.value].join(" ") });
          }} />
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
