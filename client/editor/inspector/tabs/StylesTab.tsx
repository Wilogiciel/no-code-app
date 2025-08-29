import { useAppStore, getNodeById } from "@/editor/store/appStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StylesTab() {
  const sel = useAppStore((s) => s.selection);
  const node = sel[0] ? getNodeById(sel[0]) : null;
  const update = useAppStore((s) => s.updateProps);
  if (!node) return <div className="text-sm text-muted-foreground">Select a component</div>;
  return (
    <div className="space-y-2">
      <Label htmlFor="class">Tailwind classes</Label>
      <Input id="class" value={node.props.className || ""} onChange={(e) => update(node.id, { className: e.target.value })} />
    </div>
  );
}
