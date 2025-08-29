import { useAppStore } from "@/editor/store/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function DataTab() {
  const addDS = useAppStore((s) => s.addDataSource);
  const hist = useAppStore((s) => s.history);
  const [json, setJson] = useState<string>("");
  const app = hist?.present;
  if (!app) return null;

  async function testGet(baseUrl: string, path: string) {
    const res = await fetch(`${baseUrl}${path}`);
    const data = await res.json();
    setJson(JSON.stringify(data, null, 2));
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium">Data Sources</h4>
      {app.dataSources.map((d) => (
        <Card key={d.id}><CardContent className="p-3 text-sm">{d.name}</CardContent></Card>
      ))}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Name</Label>
          <Input id="dsn" placeholder="jsonplaceholder" />
        </div>
        <div>
          <Label>Base URL</Label>
          <Input id="dsu" placeholder="https://jsonplaceholder.typicode.com" />
        </div>
      </div>
      <Button onClick={() => {
        const name = (document.getElementById("dsn") as HTMLInputElement).value;
        const baseUrl = (document.getElementById("dsu") as HTMLInputElement).value;
        if (name && baseUrl) addDS({ id: crypto.randomUUID(), kind: "rest", name, baseUrl });
      }}>Add REST</Button>

      <div className="grid grid-cols-2 gap-2 pt-2">
        <div>
          <Label>Test path</Label>
          <Input id="tpath" placeholder="/posts" />
        </div>
        <Button className="self-end" onClick={() => {
          const baseUrl = (document.getElementById("dsu") as HTMLInputElement).value || "https://jsonplaceholder.typicode.com";
          const path = (document.getElementById("tpath") as HTMLInputElement).value || "/posts";
          testGet(baseUrl, path);
        }}>Test GET</Button>
      </div>
      {json && (<pre className="max-h-64 overflow-auto rounded border p-2 text-xs">{json}</pre>)}
    </div>
  );
}
