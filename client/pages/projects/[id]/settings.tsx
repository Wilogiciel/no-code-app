import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ProjectSettings() {
  const { id } = useParams();
  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-sm text-muted-foreground">Project ID: {id}</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Environment variables</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="api">API_URL</Label>
              <Input id="api" placeholder="https://api.example.com" />
            </div>
            <div>
              <Label htmlFor="key">PUBLIC_KEY</Label>
              <Input id="key" placeholder="pk_..." />
            </div>
            <Button variant="outline">Save</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Secrets</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="sk">SECRET_TOKEN</Label>
              <Input id="sk" type="password" placeholder="••••••" />
            </div>
            <Button variant="outline">Save</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
