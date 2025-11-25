'use client';

import { useEditorState } from '@/context/EditorContext';
import PropertiesPanel from '@/components/properties/PropertiesPanel';
import { ScrollArea } from '../ui/scroll-area';

export default function RightSidebar() {
  const { selectedWidgetId, layout } = useEditorState();

  const selectedWidget = layout?.widgets.find(w => w.id === selectedWidgetId);

  return (
    <aside className="w-80 border-l bg-card flex flex-col">
      <div className="h-16 flex items-center px-4 border-b">
        <h3 className="font-semibold text-lg">Properties</h3>
      </div>
      <ScrollArea className="flex-1">
        {selectedWidget ? (
          <PropertiesPanel widget={selectedWidget} key={selectedWidget.id} />
        ) : (
          <div className="p-4 text-center text-muted-foreground mt-8">
            <p>Select a widget to see its properties.</p>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
