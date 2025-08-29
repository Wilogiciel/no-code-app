import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

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
  useEffect(() => { setItems(listProjects()); }, []);
  function create() {
    const id = crypto.randomUUID();
    localStorage.setItem(`app:${id}`, JSON.stringify({ id, name: "New App", pages: [{ id: crypto.randomUUID(), name: "Home", root: { id: crypto.randomUUID(), type: "Root", props: {}, children: [] } }], variables: [], dataSources: [] }));
    setItems(listProjects());
  }
  return (
    <section className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={create}>New Project</Button>
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
                  <Button variant="outline" asChild><Link to={`/projects/${p.id}/builder`}>Open</Link></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
