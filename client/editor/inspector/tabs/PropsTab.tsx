import { useAppStore, getNodeById } from "@/editor/store/appStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      {(node.type === "Input" || node.type === "Textarea" || node.type === "Select" || node.type === "Date" || node.type === "Time" || node.type === "Switch") && (
        <div>
          <Label htmlFor="lbl">Label</Label>
          <Input id="lbl" value={node.props.label || ""} onChange={(e) => update(node.id, { label: e.target.value })} />
        </div>
      )}
      {(node.type === "Row" || node.type === "Column") && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Align</Label>
            <Select value={node.props.align || "center"} onValueChange={(v) => update(node.id, { align: v })}>
              <SelectTrigger><SelectValue placeholder="align" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">start</SelectItem>
                <SelectItem value="center">center</SelectItem>
                <SelectItem value="end">end</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Justify</Label>
            <Select value={node.props.justify || "start"} onValueChange={(v) => update(node.id, { justify: v })}>
              <SelectTrigger><SelectValue placeholder="justify" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">start</SelectItem>
                <SelectItem value="between">between</SelectItem>
                <SelectItem value="center">center</SelectItem>
                <SelectItem value="end">end</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Gap</Label>
            <Input value={node.props.gap || "4"} onChange={(e) => update(node.id, { gap: e.target.value })} />
          </div>
        </div>
      )}
      {node.type === "Grid" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Cols</Label>
            <Input type="number" min={1} max={6} value={node.props.cols || 2} onChange={(e) => update(node.id, { cols: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Gap</Label>
            <Input value={node.props.gap || "4"} onChange={(e) => update(node.id, { gap: e.target.value })} />
          </div>
        </div>
      )}
      {(node.type === "Form" || node.type === "Forms") && (
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <Label>Path</Label>
            <Input value={node.props.path || "/submit"} onChange={(e) => update(node.id, { path: e.target.value })} />
          </div>
          <div>
            <Label>Method</Label>
            <Select value={node.props.method || "POST"} onValueChange={(v) => update(node.id, { method: v })}>
              <SelectTrigger><SelectValue placeholder="method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {node.type === "Forms" && (
            <>
              <div>
                <Label>Cols</Label>
                <Input type="number" min={1} max={6} value={node.props.cols || 2} onChange={(e) => update(node.id, { cols: Number(e.target.value) })} />
              </div>
              <div className="col-span-2 mt-2 flex items-center justify-between">
                <Label>Show reset button</Label>
                <Switch checked={!!node.props.showReset} onCheckedChange={(v) => update(node.id, { showReset: v })} />
              </div>
              <div>
                <Label>Submit text</Label>
                <Input value={node.props.submitText || "Submit"} onChange={(e) => update(node.id, { submitText: e.target.value })} />
              </div>
              <div>
                <Label>Reset text</Label>
                <Input value={node.props.resetText || "Reset"} onChange={(e) => update(node.id, { resetText: e.target.value })} />
              </div>
            </>
          )}
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
