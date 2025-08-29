import { ComponentNode } from "@/editor/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    default:
      return <div className="text-xs text-muted-foreground">Unsupported: {n.type}</div>;
  }
}
