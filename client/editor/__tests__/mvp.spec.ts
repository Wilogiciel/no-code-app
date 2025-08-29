import { describe, it, expect } from "vitest";
import { createHistory, push, undo, redo } from "@/editor/history/undoRedo";
import { evalTemplate } from "@/editor/runtime/evalExpr";

describe("history", () => {
  it("push/undo/redo", () => {
    const h = createHistory({ v: 1 });
    const h2 = push(h, { v: 2 });
    const h3 = undo(h2);
    expect(h3.present.v).toBe(1);
    const h4 = redo(h3);
    expect(h4.present.v).toBe(2);
  });
});

describe("evalTemplate", () => {
  it("replaces vars", () => {
    const s = evalTemplate("Hello {{vars.name}}", { vars: { name: "World" } });
    expect(s).toBe("Hello World");
  });
});
