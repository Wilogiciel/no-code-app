import { useAppStore, getNodeById } from "@/editor/store/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EventsTab() {
  const sel = useAppStore((s) => s.selection);
  const node = sel[0] ? getNodeById(sel[0]) : null;
  const update = useAppStore((s) => s.updateProps);
  if (!node) return <div className="text-sm text-muted-foreground">Select a component</div>;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">MVP: define onClick toast message</p>
      <div>
        <Label htmlFor="msg">Toast message</Label>
        <Input id="msg" placeholder="Hello {{vars.username}}" value={node.props.onClickToast || ""} onChange={(e) => update(node.id, { onClickToast: e.target.value })} />
      </div>
      <Button onClick={() => update(node.id, { onClickToast: node.props.onClickToast || "Hello" })}>Save</Button>
    </div>
  );
}
