import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

function listProjects() {
  const apps: { id: string; name: string }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    if (k.startsWith("app:")) {
      const app = JSON.parse(localStorage.getItem(k) || "{}");
      apps.push({ id: app.id, name: app.name || app.id });
    }
  }
  return apps;
}

export default function ProjectsIndex() {
  const [items, setItems] = useState(() => listProjects());
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("New App");
  const [primaryHex, setPrimaryHex] = useState("#6D28D9");
  const [secondaryHex, setSecondaryHex] = useState("#EEF2F7");
  const [darkPrimaryHex, setDarkPrimaryHex] = useState("#A78BFA");
  const [darkSecondaryHex, setDarkSecondaryHex] = useState("#1F2937");
  const [backendKind, setBackendKind] = useState<"rest" | "webhook" | "firebase" | "supabase" | "netlify" | "vercel">("rest");
  const [backendBaseUrl, setBackendBaseUrl] = useState("");
  useEffect(() => {
    setItems(listProjects());
  }, []);

  function hexToHslString(hex: string): string {
    const res = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
    if (!res) return "258 85% 58%";
    const r = parseInt(res[1], 16) / 255;
    const g = parseInt(res[2], 16) / 255;
    const b = parseInt(res[3], 16) / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 1);
          break;
        case g:
          h = (b - r) / d + 3;
          break;
        case b:
          h = (r - g) / d + 5;
          break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }

  function createWithTheme() {
    const id = crypto.randomUUID();
    const theme = {
      primary: hexToHslString(primaryHex),
      secondary: hexToHslString(secondaryHex),
      darkPrimary: hexToHslString(darkPrimaryHex),
      darkSecondary: hexToHslString(darkSecondaryHex),
    };
    const app = {
      id,
      name,
      pages: [
        {
          id: crypto.randomUUID(),
          name: "Home",
          root: {
            id: crypto.randomUUID(),
            type: "Root",
            props: {},
            children: [
              {
                id: crypto.randomUUID(),
                type: "Menu",
                props: { align: "left", showTheme: true },
                children: [],
              },
            ],
          },
        },
      ],
      variables: [],
      dataSources: [],
      theme,
      backend: { kind: backendKind, baseUrl: backendBaseUrl },
    };
    localStorage.setItem(`app:${id}`, JSON.stringify(app));
    setItems(listProjects());
    setOpen(false);
  }

  return (
    <section className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>New Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary">Primary color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="primary"
                      type="color"
                      value={primaryHex}
                      onChange={(e) => setPrimaryHex(e.target.value)}
                    />
                    <Input
                      value={primaryHex}
                      onChange={(e) => setPrimaryHex(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary">Secondary color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="secondary"
                      type="color"
                      value={secondaryHex}
                      onChange={(e) => setSecondaryHex(e.target.value)}
                    />
                    <Input
                      value={secondaryHex}
                      onChange={(e) => setSecondaryHex(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="darkPrimary">Dark primary</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="darkPrimary"
                      type="color"
                      value={darkPrimaryHex}
                      onChange={(e) => setDarkPrimaryHex(e.target.value)}
                    />
                    <Input
                      value={darkPrimaryHex}
                      onChange={(e) => setDarkPrimaryHex(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="darkSecondary">Dark secondary</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="darkSecondary"
                      type="color"
                      value={darkSecondaryHex}
                      onChange={(e) => setDarkSecondaryHex(e.target.value)}
                    />
                    <Input
                      value={darkSecondaryHex}
                      onChange={(e) => setDarkSecondaryHex(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Backend service</Label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => setBackendKind("rest")} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${backendKind === "rest" ? "border-primary" : "border-input hover:bg-accent"}`}>
                    <span className="inline-flex size-5 items-center justify-center rounded bg-primary/10">🌐</span> REST
                  </button>
                  <button type="button" onClick={() => setBackendKind("firebase")} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${backendKind === "firebase" ? "border-primary" : "border-input hover:bg-accent"}`}>
                    <span className="inline-flex size-5 items-center justify-center rounded bg-primary/10">☁️</span> Firebase
                  </button>
                  <button type="button" onClick={() => setBackendKind("supabase")} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${backendKind === "supabase" ? "border-primary" : "border-input hover:bg-accent"}`}>
                    <span className="inline-flex size-5 items-center justify-center rounded bg-primary/10">🗄️</span> Supabase
                  </button>
                  <button type="button" onClick={() => setBackendKind("netlify")} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${backendKind === "netlify" ? "border-primary" : "border-input hover:bg-accent"}`}>
                    <span className="inline-flex size-5 items-center justify-center rounded bg-primary/10">ƒ</span> Netlify
                  </button>
                  <button type="button" onClick={() => setBackendKind("vercel")} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${backendKind === "vercel" ? "border-primary" : "border-input hover:bg-accent"}`}>
                    <span className="inline-flex size-5 items-center justify-center rounded bg-primary/10">⚡</span> Vercel
                  </button>
                  <button type="button" onClick={() => setBackendKind("webhook")} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${backendKind === "webhook" ? "border-primary" : "border-input hover:bg-accent"}`}>
                    <span className="inline-flex size-5 items-center justify-center rounded bg-primary/10">🔗</span> Webhook
                  </button>
                </div>
                {backendKind !== "webhook" && (
                  <div className="mt-3">
                    <Label htmlFor="baseUrl">Base URL</Label>
                    <Input id="baseUrl" placeholder="https://api.example.com" value={backendBaseUrl} onChange={(e) => setBackendBaseUrl(e.target.value)} />
                  </div>
                )}
                {backendKind === "webhook" && (
                  <p className="mt-2 text-xs text-muted-foreground">For Webhook, set the full URL per form using its path property.</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createWithTheme}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell className="font-mono text-xs">{p.id}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" asChild>
                    <Link to={`/projects/${p.id}/builder`}>Open</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
