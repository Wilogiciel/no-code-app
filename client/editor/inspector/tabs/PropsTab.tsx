import { useAppStore, getNodeById } from "@/editor/store/appStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PropsTab() {
  const sel = useAppStore((s) => s.selection);
  const update = useAppStore((s) => s.updateProps);
  const node = sel[0] ? getNodeById(sel[0]) : null;
  if (!node)
    return (
      <div className="text-sm text-muted-foreground">Select a component</div>
    );

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={node.name || ""}
          onChange={(e) => update(node.id, { name: e.target.value })}
        />
      </div>
      {typeof node.props.text !== "undefined" && (
        <div>
          <Label htmlFor="text">Text</Label>
          <Input
            id="text"
            value={node.props.text || ""}
            onChange={(e) => update(node.id, { text: e.target.value })}
          />
        </div>
      )}
      {typeof node.props.placeholder !== "undefined" && (
        <div>
          <Label htmlFor="ph">Placeholder</Label>
          <Input
            id="ph"
            value={node.props.placeholder || ""}
            onChange={(e) => update(node.id, { placeholder: e.target.value })}
          />
        </div>
      )}
      {(node.type === "Input" ||
        node.type === "Textarea" ||
        node.type === "Select" ||
        node.type === "Date" ||
        node.type === "Time" ||
        node.type === "Switch") && (
        <div>
          <Label htmlFor="lbl">Label</Label>
          <Input
            id="lbl"
            value={node.props.label || ""}
            onChange={(e) => update(node.id, { label: e.target.value })}
          />
        </div>
      )}
      {(node.type === "Row" || node.type === "Column") && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Align</Label>
            <Select
              value={node.props.align || "center"}
              onValueChange={(v) => update(node.id, { align: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="align" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">start</SelectItem>
                <SelectItem value="center">center</SelectItem>
                <SelectItem value="end">end</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Justify</Label>
            <Select
              value={node.props.justify || "start"}
              onValueChange={(v) => update(node.id, { justify: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="justify" />
              </SelectTrigger>
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
            <Input
              value={node.props.gap || "4"}
              onChange={(e) => update(node.id, { gap: e.target.value })}
            />
          </div>
        </div>
      )}
      {node.type === "Grid" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Cols</Label>
            <Input
              type="number"
              min={1}
              max={6}
              value={node.props.cols || 2}
              onChange={(e) =>
                update(node.id, { cols: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label>Gap</Label>
            <Input
              value={node.props.gap || "4"}
              onChange={(e) => update(node.id, { gap: e.target.value })}
            />
          </div>
        </div>
      )}
      {node.type === "Slide" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Items per view</Label>
            <Input
              type="number"
              min={1}
              max={6}
              value={node.props.itemsPerView || 1}
              onChange={(e) =>
                update(node.id, { itemsPerView: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label>Gap</Label>
            <Input
              value={node.props.gap || "4"}
              onChange={(e) => update(node.id, { gap: e.target.value })}
            />
          </div>
          <div className="col-span-2 mt-1 flex items-center justify-between">
            <Label>Show arrows</Label>
            <Switch
              checked={node.props.showArrows !== false}
              onCheckedChange={(v) => update(node.id, { showArrows: v })}
            />
          </div>
          <div className="col-span-2 mt-1 flex items-center justify-between">
            <Label>Show dots</Label>
            <Switch
              checked={node.props.showDots !== false}
              onCheckedChange={(v) => update(node.id, { showDots: v })}
            />
          </div>
          <div className="col-span-2 mt-1 flex items-center justify-between">
            <Label>Autoplay</Label>
            <Switch
              checked={!!node.props.autoplay}
              onCheckedChange={(v) => update(node.id, { autoplay: v })}
            />
          </div>
          <div>
            <Label>Autoplay (ms)</Label>
            <Input
              type="number"
              min={500}
              step={100}
              value={node.props.autoplayMs || 3000}
              onChange={(e) =>
                update(node.id, { autoplayMs: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Loop</Label>
            <Switch
              checked={node.props.loop !== false}
              onCheckedChange={(v) => update(node.id, { loop: v })}
            />
          </div>
        </div>
      )}
      {(node.type === "Form" || node.type === "Forms") && (
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <Label>Path</Label>
            <Input
              value={node.props.path || "/submit"}
              onChange={(e) => update(node.id, { path: e.target.value })}
            />
          </div>
          <div>
            <Label>Method</Label>
            <Select
              value={node.props.method || "POST"}
              onValueChange={(v) => update(node.id, { method: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="method" />
              </SelectTrigger>
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
                <Input
                  type="number"
                  min={1}
                  max={6}
                  value={node.props.cols || 2}
                  onChange={(e) =>
                    update(node.id, { cols: Number(e.target.value) })
                  }
                />
              </div>
              <div className="col-span-2 mt-2 flex items-center justify-between">
                <Label>Show reset button</Label>
                <Switch
                  checked={!!node.props.showReset}
                  onCheckedChange={(v) => update(node.id, { showReset: v })}
                />
              </div>
              <div>
                <Label>Submit text</Label>
                <Input
                  value={node.props.submitText || "Submit"}
                  onChange={(e) =>
                    update(node.id, { submitText: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Reset text</Label>
                <Input
                  value={node.props.resetText || "Reset"}
                  onChange={(e) =>
                    update(node.id, { resetText: e.target.value })
                  }
                />
              </div>
            </>
          )}
        </div>
      )}
      {node.type === "Animate" && (
        <div className="space-y-2">
          <div>
            <Label>Animation</Label>
            <Select
              value={node.props.animation || "fade-in"}
              onValueChange={(v) => update(node.id, { animation: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="animation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fade-in">fade-in</SelectItem>
                <SelectItem value="fade-in-up">fade-in-up</SelectItem>
                <SelectItem value="fade-in-down">fade-in-down</SelectItem>
                <SelectItem value="fade-in-left">fade-in-left</SelectItem>
                <SelectItem value="fade-in-right">fade-in-right</SelectItem>
                <SelectItem value="slide-in-left">slide-in-left</SelectItem>
                <SelectItem value="slide-in-right">slide-in-right</SelectItem>
                <SelectItem value="slide-in-up">slide-in-up</SelectItem>
                <SelectItem value="slide-in-down">slide-in-down</SelectItem>
                <SelectItem value="zoom-in">zoom-in</SelectItem>
                <SelectItem value="zoom-out">zoom-out</SelectItem>
                <SelectItem value="bounce">bounce</SelectItem>
                <SelectItem value="pulse">pulse</SelectItem>
                <SelectItem value="rotate-in">rotate-in</SelectItem>
                <SelectItem value="flip-in-x">flip-in-x</SelectItem>
                <SelectItem value="flip-in-y">flip-in-y</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Duration (ms)</Label>
              <Input
                type="number"
                min={50}
                step={50}
                value={node.props.durationMs || 600}
                onChange={(e) =>
                  update(node.id, { durationMs: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Delay (ms)</Label>
              <Input
                type="number"
                min={0}
                step={50}
                value={node.props.delayMs || 0}
                onChange={(e) =>
                  update(node.id, { delayMs: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Stagger (ms)</Label>
              <Input
                type="number"
                min={0}
                step={50}
                value={node.props.staggerMs || 0}
                onChange={(e) =>
                  update(node.id, { staggerMs: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Iterations</Label>
              <Input
                type="number"
                min={1}
                value={node.props.iteration || 1}
                onChange={(e) =>
                  update(node.id, { iteration: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Easing</Label>
              <Select
                value={node.props.easing || "ease"}
                onValueChange={(v) => update(node.id, { easing: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="easing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ease">ease</SelectItem>
                  <SelectItem value="linear">linear</SelectItem>
                  <SelectItem value="ease-in">ease-in</SelectItem>
                  <SelectItem value="ease-out">ease-out</SelectItem>
                  <SelectItem value="ease-in-out">ease-in-out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Direction</Label>
              <Select
                value={node.props.direction || "normal"}
                onValueChange={(v) => update(node.id, { direction: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">normal</SelectItem>
                  <SelectItem value="reverse">reverse</SelectItem>
                  <SelectItem value="alternate">alternate</SelectItem>
                  <SelectItem value="alternate-reverse">
                    alternate-reverse
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Infinite</Label>
            <Switch
              checked={!!node.props.infinite}
              onCheckedChange={(v) => update(node.id, { infinite: v })}
            />
          </div>
          <div>
            <Label>Trigger</Label>
            <Select
              value={node.props.trigger || "mount"}
              onValueChange={(v) => update(node.id, { trigger: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mount">on mount</SelectItem>
                <SelectItem value="hover">on hover</SelectItem>
                <SelectItem value="inView">on scroll into view</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {node.props.trigger === "inView" && (
            <div className="flex items-center justify-between">
              <Label>Once</Label>
              <Switch
                checked={node.props.once !== false}
                onCheckedChange={(v) => update(node.id, { once: v })}
              />
            </div>
          )}
        </div>
      )}
      <Separator />
      <div>
        <Label htmlFor="class">Classes</Label>
        <Input
          id="class"
          value={node.props.className || ""}
          onChange={(e) => update(node.id, { className: e.target.value })}
        />
      </div>
    </div>
  );
}
