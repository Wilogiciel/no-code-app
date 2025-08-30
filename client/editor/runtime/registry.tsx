import { ComponentNode } from "@/editor/types";
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/editor/store/appStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { evalTemplate } from "@/editor/runtime/evalExpr";
import { Separator } from "@/components/ui/separator";

export function renderChildren(
  n: ComponentNode,
  ctx: any,
  handlers: Record<string, any>,
) {
  return (n.children || []).map((c) => renderNode(c, ctx, handlers));
}

export function renderNode(
  n: ComponentNode,
  ctx: any,
  handlers: Record<string, any>,
): JSX.Element | null {
  const common = { className: n.props.className } as any;
  switch (n.type) {
    case "Text":
      return <p {...common}>{n.props.text}</p>;
    case "Heading":
      const H = `h${n.props.level || 2}` as any;
      return <H {...common}>{n.props.text || "Heading"}</H>;
    case "Button":
      return (
        <Button
          {...common}
          type={n.props.submit ? "submit" : undefined}
          onClick={() => {
            if (n.props.onClickToast) {
              toast(evalTemplate(String(n.props.onClickToast), ctx));
            }
          }}
        >
          {n.props.text || "Button"}
        </Button>
      );
    case "Input":
      return (
        <Input
          {...common}
          id={n.props.id}
          name={n.props.name}
          placeholder={n.props.placeholder}
          defaultValue={n.props.defaultValue}
          type={n.props.type}
        />
      );
    case "Date":
      return <Input {...common} type="date" />;
    case "Time":
      return <Input {...common} type="time" />;
    case "Textarea":
      return (
        <Textarea
          {...common}
          id={n.props.id}
          name={n.props.name}
          placeholder={n.props.placeholder}
          defaultValue={n.props.defaultValue}
        />
      );
    case "DatePicker": {
      function DatePickerComp() {
        const [open, setOpen] = React.useState(false);
        const [date, setDate] = React.useState<Date | undefined>(undefined);
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={common.className}>
                {date ? date.toDateString() : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d: any) => {
                  setDate(d);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        );
      }
      return <DatePickerComp />;
    }
    case "Select": {
      const opts: any[] = Array.isArray(n.props.options) ? n.props.options : [];
      const first = String(opts[0] ?? "");
      return (
        <Select defaultValue={first}>
          <SelectTrigger id={n.props.id} className={common.className}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {opts.map((o) => (
              <SelectItem key={String(o)} value={String(o)}>
                {String(o)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    case "Switch":
      return (
        <Switch
          className={common.className}
          defaultChecked={!!n.props.checked}
        />
      );
    case "Card":
      return (
        <Card {...common}>
          {n.props.title && (
            <CardHeader>
              <CardTitle>{n.props.title}</CardTitle>
            </CardHeader>
          )}
          <CardContent>{renderChildren(n, ctx, handlers)}</CardContent>
        </Card>
      );
    case "Row": {
      const cls = `flex flex-row items-${n.props.align || "center"} justify-${n.props.justify || "start"} gap-${n.props.gap || "4"}`;
      return (
        <div {...common} className={`${cls} ${common.className || ""}`.trim()}>
          {renderChildren(n, ctx, handlers)}
        </div>
      );
    }
    case "Column": {
      const cls = `flex flex-col items-${n.props.align || "start"} justify-${n.props.justify || "start"} gap-${n.props.gap || "4"}`;
      return (
        <div {...common} className={`${cls} ${common.className || ""}`.trim()}>
          {renderChildren(n, ctx, handlers)}
        </div>
      );
    }
    case "Grid": {
      const cols = Number(n.props.cols || 2);
      const cls = `grid grid-cols-${cols} gap-${n.props.gap || "4"}`;
      return (
        <div {...common} className={`${cls} ${common.className || ""}`.trim()}>
          {renderChildren(n, ctx, handlers)}
        </div>
      );
    }
    case "Separator":
      return <Separator />;
    case "Table": {
      const rows: any[] = (ctx.vars?.posts || []).slice(0, 5);
      if (!rows?.length)
        return <div className="text-sm text-muted-foreground">No data</div>;
      const cols = Object.keys(rows[0]);
      return (
        <Table {...common}>
          <TableHeader>
            <TableRow>
              {cols.map((c) => (
                <TableHead key={c}>{c}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                {cols.map((c) => (
                  <TableCell key={c}>{String(r[c])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    case "Tabs": {
      const tabs: any[] = Array.isArray(n.props.tabs)
        ? n.props.tabs
        : ["One", "Two"];
      const first = String(tabs[0] ?? "one");
      return (
        <Tabs defaultValue={first} className={common.className}>
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={String(t)} value={String(t)}>
                {String(t)}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t, i) => (
            <TabsContent key={String(t)} value={String(t)}>
              {i === 0 ? (
                <div className="mt-2">{renderChildren(n, ctx, handlers)}</div>
              ) : (
                <div className="mt-2 text-sm text-muted-foreground">
                  Tab {String(t)}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      );
    }
    case "Alert":
      return (
        <Alert variant={n.props.variant as any} className={common.className}>
          {n.props.title && <AlertTitle>{n.props.title}</AlertTitle>}
          {n.props.text && <AlertDescription>{n.props.text}</AlertDescription>}
        </Alert>
      );
    case "Badge":
      return (
        <Badge className={common.className} variant={n.props.variant as any}>
          {n.props.text || "Badge"}
        </Badge>
      );
    case "Image":
      return (
        <img
          className={common.className}
          src={n.props.src}
          alt={n.props.alt || ""}
        />
      );
    case "Form": {
      function FormComp() {
        const hist = useAppStore((s) => s.history);
        const app = hist?.present;
        async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const data = Object.fromEntries(Array.from(fd.entries()));
          const method = (n.props.method || "POST").toUpperCase();
          const path = String(n.props.path || "/submit");
          const backend = app?.backend || { kind: "rest", baseUrl: "" };
          try {
            let url = path;
            const baseKinds = new Set(["rest", "firebase", "supabase", "netlify", "vercel"]);
            if (baseKinds.has(String(backend.kind))) {
              const base = backend.baseUrl || "";
              url = base.endsWith("/") || path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
            }
            const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: method === "GET" ? undefined : JSON.stringify(data),
            });
            if (!res.ok) throw new Error(`${res.status}`);
            toast("Form submitted");
          } catch (err: any) {
            toast(`Submit failed: ${err?.message || err}`);
          }
        }
        return (
          <form className={common.className} onSubmit={onSubmit}>
            {renderChildren(n, ctx, handlers)}
          </form>
        );
      }
      return <FormComp />;
    }
    case "Forms": {
      function FormsComp() {
        const hist = useAppStore((s) => s.history);
        const app = hist?.present;
        const cols = Number(n.props.cols || 2);
        const gridCls = `grid grid-cols-${cols} gap-4`;
        const isField = (t: string) => ["Input", "Textarea", "Select", "Date", "Time", "Switch"].includes(t);
        function renderWithLabel(child: ComponentNode) {
          const id = child.props.id || child.id;
          const labelText = child.props.label || child.props.name || child.name || child.type;
          const copy: ComponentNode = { ...child, props: { ...child.props, id, name: child.props.name || id } };
          return (
            <div key={child.id} className="flex flex-col gap-1">
              <Label htmlFor={id}>{labelText}</Label>
              {renderNode(copy, ctx, handlers)}
            </div>
          );
        }
        async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const data = Object.fromEntries(Array.from(fd.entries()));
          const method = (n.props.method || "POST").toUpperCase();
          const path = String(n.props.path || "/submit");
          const backend = app?.backend || { kind: "rest", baseUrl: "" };
          try {
            let url = path;
            const baseKinds = new Set(["rest", "firebase", "supabase", "netlify", "vercel"]);
            if (baseKinds.has(String(backend.kind))) {
              const base = backend.baseUrl || "";
              url = base.endsWith("/") || path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
            }
            const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: method === "GET" ? undefined : JSON.stringify(data),
            });
            if (!res.ok) throw new Error(`${res.status}`);
            toast("Form submitted");
          } catch (err: any) {
            toast(`Submit failed: ${err?.message || err}`);
          }
        }
        return (
          <form className={common.className} onSubmit={onSubmit}>
            <div className={gridCls}>
              {(n.children || []).map((c) => (isField(c.type) ? renderWithLabel(c) : renderNode(c, ctx, handlers)))}
            </div>
            <div className="mt-3 flex justify-end gap-2">
              {n.props.showReset && (
                <Button type="reset" variant="outline">{n.props.resetText || "Reset"}</Button>
              )}
              <Button type="submit">{n.props.submitText || "Submit"}</Button>
            </div>
          </form>
        );
      }
      return <FormsComp />;
    }
    case "Menu": {
      function MenuComp() {
        const hist = useAppStore((s) => s.history);
        const app = hist?.present;
        const pages = app?.pages || [];
        const cur = useAppStore((s) => s.currentPageId);
        const setPage = useAppStore((s) => s.setCurrentPage);
        const canvasDark = useAppStore((s) => s.canvasDark);
        const setCanvasDark = useAppStore((s) => s.setCanvasDark);
        const justify =
          n.props.align === "center"
            ? "justify-center"
            : n.props.align === "right"
              ? "justify-end"
              : "justify-start";
        const hasDark = !!(
          app?.theme?.darkPrimary && app?.theme?.darkSecondary
        );
        return (
          <div
            className={`flex items-center gap-2 border-b bg-background/70 px-3 py-2 ${common.className || ""}`}
          >
            <div
              className={`flex flex-1 flex-wrap items-center gap-2 ${justify}`}
            >
              {pages.map((p) => (
                <Button
                  key={p.id}
                  variant={cur === p.id ? "default" : "outline"}
                  onClick={() => setPage(p.id)}
                >
                  {p.name}
                </Button>
              ))}
            </div>
            {n.props.showTheme && hasDark && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Dark</span>
                <Switch checked={canvasDark} onCheckedChange={setCanvasDark} />
              </div>
            )}
          </div>
        );
      }
      return <MenuComp />;
    }
    case "Dialog":
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className={common.className} variant="outline">
              {n.props.triggerText || "Open Dialog"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            {n.props.title && <DialogTitle>{n.props.title}</DialogTitle>}
            {n.props.description && (
              <DialogDescription>{n.props.description}</DialogDescription>
            )}
            <div className="mt-2">{renderChildren(n, ctx, handlers)}</div>
          </DialogContent>
        </Dialog>
      );
    case "Sheet":
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button className={common.className} variant="outline">
              {n.props.triggerText || "Open Sheet"}
            </Button>
          </SheetTrigger>
          <SheetContent side={n.props.side || "right"}>
            <SheetHeader>
              {n.props.title && <SheetTitle>{n.props.title}</SheetTitle>}
              {n.props.description && (
                <SheetDescription>{n.props.description}</SheetDescription>
              )}
            </SheetHeader>
            <div className="mt-2">{renderChildren(n, ctx, handlers)}</div>
          </SheetContent>
        </Sheet>
      );
    case "Drawer":
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <Button className={common.className} variant="outline">
              {n.props.triggerText || "Open Drawer"}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              {n.props.title && <DrawerTitle>{n.props.title}</DrawerTitle>}
              {n.props.description && (
                <DrawerDescription>{n.props.description}</DrawerDescription>
              )}
            </DrawerHeader>
            <div className="mt-2 px-4 pb-4">
              {renderChildren(n, ctx, handlers)}
            </div>
          </DrawerContent>
        </Drawer>
      );
    default:
      return (
        <div className="text-xs text-muted-foreground">
          Unsupported: {n.type}
        </div>
      );
  }
}
