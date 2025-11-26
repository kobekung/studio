'use client';
import { useEditorStore } from '@/stores';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Plus, Tv, Clock, Image as ImageIcon, Loader2, Newspaper, Globe } from 'lucide-react';
import { WidgetType } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useDebouncedCallback } from 'use-debounce';

export default function Header() {
  const { layout, addNewWidget, isWidgetLoading, togglePreviewMode, updateLayoutDimensions, fitToScreen } = useEditorStore();

  const handleAddWidget = (type: WidgetType) => {
    addNewWidget(type);
  };
  
  const debouncedUpdate = useDebouncedCallback((newDims: {width?: number, height?: number}) => {
    if (!layout) return;
    updateLayoutDimensions({
      width: newDims.width ?? layout.width,
      height: newDims.height ?? layout.height,
    });
  }, 500);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-card">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">{layout?.name || 'Loading...'}</h2>
        <div className="flex items-center gap-2">
            <Label htmlFor="canvas-width" className="text-sm">W:</Label>
            <Input
                id="canvas-width"
                type="number"
                defaultValue={layout?.width}
                key={`w-${layout?.width}`}
                onChange={(e) => debouncedUpdate({ width: Number(e.target.value) })}
                className="w-20 h-8"
            />
        </div>
         <div className="flex items-center gap-2">
            <Label htmlFor="canvas-height" className="text-sm">H:</Label>
            <Input
                id="canvas-height"
                type="number"
                defaultValue={layout?.height}
                key={`h-${layout?.height}`}
                onChange={(e) => debouncedUpdate({ height: Number(e.target.value) })}
                className="w-20 h-8"
            />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isWidgetLoading}>
              {isWidgetLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus />
              )}
              Add Widget
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleAddWidget('text')}>
              <Tv />
              <span>Text</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddWidget('clock')}>
              <Clock />
              <span>Clock</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddWidget('image')}>
              <ImageIcon />
              <span>Image</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddWidget('ticker')}>
              <Newspaper />
              <span>Ticker</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddWidget('webview')}>
              <Globe />
              <span>Web Page</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          onClick={togglePreviewMode}
        >
          <Eye />
          Preview
        </Button>
      </div>
    </header>
  );
}
