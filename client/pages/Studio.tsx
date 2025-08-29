import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Studio() {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Visual Studio
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Drag, drop, and configure UI. When you’re ready, export clean React
          code.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Canvas</CardTitle>
            <CardDescription>Arrange components visually</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md border border-dashed bg-muted/40" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>Fine-tune styles and behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md border border-dashed bg-muted/40" />
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <Button size="lg">Start a new project</Button>
        <Button size="lg" variant="outline">
          Explore templates
        </Button>
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Want this page to be fully functional? Keep prompting with the specifics
        and I’ll build it.
      </p>
    </section>
  );
}
