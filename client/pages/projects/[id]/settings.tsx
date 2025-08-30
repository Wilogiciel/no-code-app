import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProjectSettings() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [primary, setPrimary] = useState("258 85% 58%");
  const [secondary, setSecondary] = useState("220 40% 96%");
  const [darkPrimary, setDarkPrimary] = useState("260 85% 70%");
  const [darkSecondary, setDarkSecondary] = useState("240 25% 14%");
  const [backendKind, setBackendKind] = useState<"rest" | "webhook">("rest");
  const [backendBaseUrl, setBackendBaseUrl] = useState("");

  function hslToHex(hsl: string): string {
    const [h, s, l] = hsl
      .split(/\s+/)
      .map((v) => parseFloat(String(v).replace("%", "")));
    const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
    function f(n: number) {
      const k = (n + h / 30) % 12;
      const c = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c)
        .toString(16)
        .padStart(2, "0");
    }
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  function hexToHsl(hex: string): string {
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

  useEffect(() => {
    if (!id) return;
    const raw = localStorage.getItem(`app:${id}`);
    if (!raw) return;
    const app = JSON.parse(raw);
    setName(app.name || "");
    setPrimary(app.theme?.primary || primary);
    setSecondary(app.theme?.secondary || secondary);
    setDarkPrimary(app.theme?.darkPrimary || darkPrimary);
    setDarkSecondary(app.theme?.darkSecondary || darkSecondary);
    setBackendKind(app.backend?.kind || "rest");
    setBackendBaseUrl(app.backend?.baseUrl || "");
  }, [id]);

  function save() {
    if (!id) return;
    const raw = localStorage.getItem(`app:${id}`);
    if (!raw) return;
    const app = JSON.parse(raw);
    const next = {
      ...app,
      name,
      theme: {
        primary,
        secondary,
        darkPrimary,
        darkSecondary,
      },
      backend: { kind: backendKind, baseUrl: backendBaseUrl },
    };
    localStorage.setItem(`app:${id}`, JSON.stringify(next));
  }

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-sm text-muted-foreground">Project ID: {id}</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="nm">Name</Label>
              <Input
                id="nm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hslToHex(primary)}
                    onChange={(e) => setPrimary(hexToHsl(e.target.value))}
                  />
                  <Input
                    value={primary}
                    onChange={(e) => setPrimary(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Secondary</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hslToHex(secondary)}
                    onChange={(e) => setSecondary(hexToHsl(e.target.value))}
                  />
                  <Input
                    value={secondary}
                    onChange={(e) => setSecondary(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Dark primary</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hslToHex(darkPrimary)}
                    onChange={(e) => setDarkPrimary(hexToHsl(e.target.value))}
                  />
                  <Input
                    value={darkPrimary}
                    onChange={(e) => setDarkPrimary(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Dark secondary</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hslToHex(darkSecondary)}
                    onChange={(e) => setDarkSecondary(hexToHsl(e.target.value))}
                  />
                  <Input
                    value={darkSecondary}
                    onChange={(e) => setDarkSecondary(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={save}>
              Save
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Backend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Provider</Label>
              <Select value={backendKind} onValueChange={(v: any) => setBackendKind(v)}>
                <SelectTrigger><SelectValue placeholder="provider" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rest">REST (Base URL)</SelectItem>
                  <SelectItem value="webhook">Webhook (full URL set per form)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {backendKind === "rest" && (
              <div>
                <Label htmlFor="base">Base URL</Label>
                <Input id="base" placeholder="https://api.example.com" value={backendBaseUrl} onChange={(e) => setBackendBaseUrl(e.target.value)} />
              </div>
            )}
            <Button variant="outline" onClick={save}>Save</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
