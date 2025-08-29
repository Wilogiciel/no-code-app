import { useAppStore, getNodeById } from "@/editor/store/appStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function PropsTab() {
  const sel = useAppStore((s) => s.selection);
  const update = useAppStore((s) => s.updateProps);
  const node = sel[0] ? getNodeById(sel[0]) : null;
  if (!node) return <div className="text-sm text-muted-foreground">Select a component</div>;

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={node.name || ""} onChange={(e) => update(node.id, { name: e.target.value })} />
      </div>
      {typeof node.props.text !== "undefined" && (
        <div>
          <Label htmlFor="text">Text</Label>
          <Input id="text" value={node.props.text || ""} onChange={(e) => update(node.id, { text: e.target.value })} />
        </div>
      )}
      {typeof node.props.placeholder !== "undefined" && (
        <div>
          <Label htmlFor="ph">Placeholder</Label>
          <Input id="ph" value={node.props.placeholder || ""} onChange={(e) => update(node.id, { placeholder: e.target.value })} />
        </div>
      )}
      {typeof node.props.checked !== "undefined" && (
        <div className="flex items-center gap-2">
          <Switch checked={!!node.props.checked} onCheckedChange={(v) => update(node.id, { checked: v })} />
          <Label>Checked</Label>
        </div>
      )}
      <Separator />
      <div>
        <Label htmlFor="class">Classes</Label>
        <Input id="class" value={node.props.className || ""} onChange={(e) => update(node.id, { className: e.target.value })} />
      </div>
    </div>
  );
}
