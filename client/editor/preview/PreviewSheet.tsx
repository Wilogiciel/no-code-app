import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAppStore, getCurrentPage } from "@/editor/store/appStore";
import { renderNode } from "@/editor/runtime/registry";

export default function PreviewSheet() {
  const hist = useAppStore((s) => s.history);
  const page = getCurrentPage();
  const app = hist?.present;
  const ctx = { vars: Object.fromEntries((app?.variables || []).map((v) => [v.name, v.initial])) } as any;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Preview</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[600px] sm:w-[720px]">
        <SheetHeader>
          <SheetTitle>Preview — {page?.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {page ? renderNode(page.root, ctx, { onClick: () => {} }) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
