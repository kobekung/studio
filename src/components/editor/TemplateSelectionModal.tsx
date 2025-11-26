'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutGrid, RectangleVertical, RectangleHorizontal, PanelLeft, Square } from 'lucide-react';
import { TemplateType } from '@/lib/types';

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onSelect: (template: TemplateType) => void;
}

const templates = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    icon: <Square size={32} />,
  },
  {
    id: 'split-horizontal',
    name: 'Split Horizontal',
    icon: <RectangleVertical size={32} />,
  },
  {
    id: 'split-vertical',
    name: 'Split Vertical',
    icon: <RectangleHorizontal size={32} />,
  },
  {
    id: 'sidebar-left',
    name: 'Sidebar Left',
    icon: <PanelLeft size={32} />,
  },
  {
    id: 'quad-grid',
    name: 'Quad Grid',
    icon: <LayoutGrid size={32} />,
  },
];

export default function TemplateSelectionModal({ isOpen, onSelect }: TemplateSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Choose a Layout Template</DialogTitle>
          <DialogDescription>
            Select a starting point for your new layout. You can always add, remove, or resize regions later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => onSelect(template.id as TemplateType)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                {template.icon}
                <span className="text-sm font-medium">{template.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
