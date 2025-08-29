import { WorkflowAction } from "@/editor/types";
import { toast } from "sonner";

export function executeActions(actions: WorkflowAction[], ctx: { vars: Record<string, any> }) {
  for (const a of actions) {
    if (a.type === "toast") {
      toast(a.messageExpr.replace(/\{\{([^}]+)\}\}/g, (_, e) => {
        const key = String(e).trim().replace(/^vars\./, "");
        return ctx.vars[key] ?? "";
      }), { description: a.variant });
    }
    if (a.type === "setVar") {
      ctx.vars[a.name] = a.valueExpr.replace(/\{\{([^}]+)\}\}/g, (_, e) => {
        const key = String(e).trim().replace(/^vars\./, "");
        return ctx.vars[key] ?? "";
      });
    }
  }
}
