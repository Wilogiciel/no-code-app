import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropsTab from "@/editor/inspector/tabs/PropsTab";
import DataTab from "@/editor/inspector/tabs/DataTab";
import EventsTab from "@/editor/inspector/tabs/EventsTab";
import StylesTab from "@/editor/inspector/tabs/StylesTab";

export default function Inspector() {
  return (
    <div className="h-full border-l p-3">
      <Tabs defaultValue="props">
        <TabsList className="mb-2 grid w-full grid-cols-4">
          <TabsTrigger value="props">Props</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
        </TabsList>
        <TabsContent value="props"><PropsTab /></TabsContent>
        <TabsContent value="data"><DataTab /></TabsContent>
        <TabsContent value="events"><EventsTab /></TabsContent>
        <TabsContent value="styles"><StylesTab /></TabsContent>
      </Tabs>
    </div>
  );
}
