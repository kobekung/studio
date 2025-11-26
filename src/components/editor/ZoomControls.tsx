'use client';

import { useEditorStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Maximize } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ZoomControlsProps {
    onFitToScreen: () => void;
}

export default function ZoomControls({ onFitToScreen }: ZoomControlsProps) {
  const { zoom, zoomIn, zoomOut } = useEditorStore();

  return (
    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-lg bg-background p-1 shadow-md border">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={zoomOut} disabled={zoom <= 0.2}>
                        <Minus className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Zoom Out</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      
        <div className="text-sm font-semibold w-12 text-center select-none">{Math.round(zoom * 100)}%</div>

        <TooltipProvider>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={zoomIn}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Zoom In</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={onFitToScreen}>
                        <Maximize className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Fit to Screen</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
  );
}
