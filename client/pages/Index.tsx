import { useEffect, useState } from "react";
import { DemoResponse } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="relative overflow-x-auto rounded-lg border bg-background/60 p-4 text-xs leading-relaxed shadow-sm">
      <code>{code}</code>
    </pre>
  );
}

function VisualMock() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-secondary">
        <div className="h-3 w-24 rounded bg-primary/20" />
        <div className="mt-3 h-24 rounded-md bg-gradient-to-br from-primary/15 to-accent/20" />
        <div className="mt-3 flex gap-2">
          <div className="h-8 w-20 rounded-md bg-primary/20" />
          <div className="h-8 w-20 rounded-md bg-accent/30" />
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-secondary">
        <div className="h-3 w-20 rounded bg-primary/20" />
        <div className="mt-3 h-10 rounded-md bg-muted" />
        <div className="mt-3 h-10 rounded-md bg-muted" />
        <div className="mt-3 h-8 w-24 rounded-md bg-primary/30" />
      </div>
    </div>
  );
}

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/demo");
        const data = (await response.json()) as DemoResponse;
        setExampleFromServer(data.message);
      } catch (err) {
        // noop
      }
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_20%_20%,hsl(var(--primary)/0.15),transparent_60%),radial-gradient(40%_40%_at_80%_10%,hsl(var(--accent)/0.15),transparent_60%),radial-gradient(50%_50%_at_50%_100%,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="container py-24 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-500" />
              Live: build visually, export code
            </span>
            <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl">
              Build apps visually. Export clean code.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A low-code and no-code platform that helps you design, iterate, and export production-ready React code without vendor lock-in.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="px-8">
                <a href="#preview">Try live preview</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <a href="/studio">Start building</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-10 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[{
            title: "Visual builder",
            desc: "Drag, drop, and configure components with pixel-perfect control",
          },{
            title: "Code export",
            desc: "Export readable React + Tailwind code any time",
          },{
            title: "Data ready",
            desc: "Connect APIs and data sources without complexity",
          },{
            title: "Theme system",
            desc: "Design tokens and dark mode out of the box",
          },{
            title: "Reusable blocks",
            desc: "Create and reuse components across projects",
          },{
            title: "Production focused",
            desc: "Accessibility, performance, and best practices",
          }].map((f) => (
            <Card key={f.title} className="border-muted/60">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Live Preview */}
      <section id="preview" className="container py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Design to code in one place</h2>
            <p className="mt-3 text-muted-foreground">
              Toggle between a visual canvas and the exact code you’ll export. What you see is what you ship.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <a href="/studio">Open Studio</a>
              </Button>
              <Button variant="outline">Explore templates</Button>
            </div>
            {exampleFromServer && (
              <p className="mt-4 text-xs text-muted-foreground">{exampleFromServer}</p>
            )}
          </div>
          <Card className="border-muted/60">
            <CardContent className="p-4 sm:p-6">
              <Tabs defaultValue="visual">
                <TabsList className="mb-2">
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                <TabsContent value="visual" className="mt-4">
                  <VisualMock />
                </TabsContent>
                <TabsContent value="code" className="mt-4">
                  <CodeBlock
                    code={`import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="px-6 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight">Build apps visually. Export clean code.</h1>
      <p className="mt-4 text-lg text-muted-foreground">A low-code and no-code platform for creators.</p>
      <div className="mt-8 flex gap-3">
        <Button size="lg">Try live preview</Button>
        <Button size="lg" variant="outline">Start building</Button>
      </div>
    </section>
  );
}`}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20 pt-4">
        <div className={cn(
          "relative overflow-hidden rounded-2xl border p-8 sm:p-12",
          "bg-gradient-to-br from-primary/10 via-accent/10 to-transparent",
        )}>
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Start building today</h3>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Click Start building to open the Studio. Keep prompting with the features you need and I’ll make it happen.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="px-8">
              <a href="/studio">Start building</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
