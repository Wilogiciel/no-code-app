import { ComponentNode } from "@/editor/types";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerHeader } from "@/components/ui/drawer";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { evalTemplate } from "@/editor/runtime/evalExpr";
import { Separator } from "@/components/ui/separator";

export function renderChildren(n: ComponentNode, ctx: any, handlers: Record<string, any>) {
  return (n.children || []).map((c) => renderNode(c, ctx, handlers));
}

export function renderNode(n: ComponentNode, ctx: any, handlers: Record<string, any>): JSX.Element | null {
  const common = { className: n.props.className } as any;
  switch (n.type) {
    case "Text":
      return <p {...common}>{n.props.text}</p>;
    case "Heading":
      const H = (`h${n.props.level || 2}` as any);
      return <H {...common}>{n.props.text || "Heading"}</H>;
    case "Button":
      return <Button {...common} onClick={() => {
        if (n.props.onClickToast) {
          toast(evalTemplate(String(n.props.onClickToast), ctx));
        }
      }}>{n.props.text || "Button"}</Button>;
    case "Input":
      return <Input {...common} placeholder={n.props.placeholder} />;
    case "Date":
      return <Input {...common} type="date" />;
    case "Time":
      return <Input {...common} type="time" />;
    case "Textarea":
      return <Textarea {...common} placeholder={n.props.placeholder} />;
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
              <Calendar mode="single" selected={date} onSelect={(d: any) => { setDate(d); setOpen(false); }} />
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
          <SelectTrigger className={common.className}>
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
      return <Switch className={common.className} defaultChecked={!!n.props.checked} />;
    case "Card":
      return (
        <Card {...common}>
          {n.props.title && (
            <CardHeader><CardTitle>{n.props.title}</CardTitle></CardHeader>
          )}
          <CardContent>{renderChildren(n, ctx, handlers)}</CardContent>
        </Card>
      );
    case "Row": {
      const cls = `flex flex-row items-${n.props.align || "center"} justify-${n.props.justify || "start"} gap-${n.props.gap || "4"}`;
      return <div {...common} className={`${cls} ${common.className || ""}`.trim()}>{renderChildren(n, ctx, handlers)}</div>;
    }
    case "Column": {
      const cls = `flex flex-col items-${n.props.align || "start"} justify-${n.props.justify || "start"} gap-${n.props.gap || "4"}`;
      return <div {...common} className={`${cls} ${common.className || ""}`.trim()}>{renderChildren(n, ctx, handlers)}</div>;
    }
    case "Grid": {
      const cols = Number(n.props.cols || 2);
      const cls = `grid grid-cols-${cols} gap-${n.props.gap || "4"}`;
      return <div {...common} className={`${cls} ${common.className || ""}`.trim()}>{renderChildren(n, ctx, handlers)}</div>;
    }
    case "Separator":
      return <Separator />;
    case "Table": {
      const rows: any[] = (ctx.vars?.posts || []).slice(0, 5);
      if (!rows?.length) return <div className="text-sm text-muted-foreground">No data</div>;
      const cols = Object.keys(rows[0]);
      return (
        <Table {...common}>
          <TableHeader>
            <TableRow>{cols.map((c) => (<TableHead key={c}>{c}</TableHead>))}</TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>{cols.map((c) => (<TableCell key={c}>{String(r[c])}</TableCell>))}</TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    case "Tabs": {
      const tabs: any[] = Array.isArray(n.props.tabs) ? n.props.tabs : ["One", "Two"];
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
                <div className="mt-2 text-sm text-muted-foreground">Tab {String(t)}</div>
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
      return <Badge className={common.className} variant={n.props.variant as any}>{n.props.text || "Badge"}</Badge>;
    case "Image":
      return <img className={common.className} src={n.props.src} alt={n.props.alt || ""} />;
    case "Dialog":
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className={common.className} variant="outline">{n.props.triggerText || "Open Dialog"}</Button>
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
            <Button className={common.className} variant="outline">{n.props.triggerText || "Open Sheet"}</Button>
          </SheetTrigger>
          <SheetContent side={n.props.side || "right"}>
            <SheetHeader>
              {n.props.title && <SheetTitle>{n.props.title}</SheetTitle>}
              {n.props.description && <SheetDescription>{n.props.description}</SheetDescription>}
            </SheetHeader>
            <div className="mt-2">{renderChildren(n, ctx, handlers)}</div>
          </SheetContent>
        </Sheet>
      );
    case "Drawer":
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <Button className={common.className} variant="outline">{n.props.triggerText || "Open Drawer"}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              {n.props.title && <DrawerTitle>{n.props.title}</DrawerTitle>}
              {n.props.description && <DrawerDescription>{n.props.description}</DrawerDescription>}
            </DrawerHeader>
            <div className="mt-2 px-4 pb-4">{renderChildren(n, ctx, handlers)}</div>
          </DrawerContent>
        </Drawer>
      );
    default:
      return <div className="text-xs text-muted-foreground">Unsupported: {n.type}</div>;
  }
}
