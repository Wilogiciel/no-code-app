import { CATALOG, CATEGORIES } from "@/editor/components-catalog/catalog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMemo, useState } from "react";
import { useDraggable } from "@dnd-kit/core";

function DraggableItem({ type, title }: { type: string; title: string }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: `palette:${type}`, data: { type } });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="flex cursor-grab items-center justify-between rounded-md border p-2 text-sm hover:bg-accent">
      <span>{title}</span>
      <span className="text-xs text-muted-foreground">drag</span>
    </div>
  );
}

export default function Palette() {
  const [q, setQ] = useState("");
  const items = useMemo(() => CATALOG.filter((i) => i.title.toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <div className="flex h-full flex-col border-r">
      <div className="p-2">
        <Command>
          <CommandInput placeholder="Search components..." value={q} onValueChange={setQ} />
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
            {items.map((i) => (
              <CommandItem key={i.type} value={i.title} asChild>
                <div>
                  <DraggableItem type={i.type} title={i.title} />
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="w-full">
          {CATEGORIES.map((cat) => (
            <AccordionItem key={cat} value={cat}>
              <AccordionTrigger className="px-3">{cat}</AccordionTrigger>
              <AccordionContent className="px-2 pb-2">
                <div className="space-y-2">
                  {CATALOG.filter((c) => c.category === cat).map((c) => (
                    <TooltipProvider key={c.type}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <DraggableItem type={c.type} title={c.title} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Drag to canvas</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
