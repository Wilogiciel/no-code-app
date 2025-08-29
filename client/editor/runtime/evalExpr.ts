type Ctx = { vars: Record<string, any>; params?: Record<string, any> };

function getByPath(obj: any, path: string) {
  return path.split(".").reduce((acc: any, key) => (acc ? acc[key] : undefined), obj);
}

export function evalTemplate(str: string, ctx: Ctx): string {
  return str.replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
    const trimmed = String(expr).trim();
    if (trimmed.startsWith("vars.")) {
      const v = getByPath(ctx.vars, trimmed.slice(5));
      return v == null ? "" : String(v);
    }
    if (trimmed.startsWith("params.")) {
      const v = getByPath(ctx.params || {}, trimmed.slice(7));
      return v == null ? "" : String(v);
    }
    return "";
  });
}
