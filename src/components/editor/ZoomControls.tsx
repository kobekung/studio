'use client';

import { useEditorStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Maximize, RefreshCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRef, useEffect } from 'react';

export default function ZoomControls() {
  const { viewState, zoomIn, zoomOut, fitToScreen, resetView } = useEditorStore();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Hacky way to get viewport size. A proper solution would use a shared context or prop drilling.
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const editorEl = document.querySelector('[class*="bg-muted/40"]');
        if (editorEl) {
            containerRef.current = editorEl as HTMLDivElement;
        }
    }
  }, []);

  const handleFitToScreen = () => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      fitToScreen(width, height);
    }
  };

  const handleResetView = () => {
    if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        resetView(width, height);
    }
  };


  return (
    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-lg bg-background p-1 shadow-md border">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={zoomOut} disabled={viewState.scale <= 0.2}>
                        <Minus className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Zoom Out</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      
        <div className="text-sm font-semibold w-12 text-center select-none">{Math.round(viewState.scale * 100)}%</div>

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
                    <Button variant="ghost" size="icon" onClick={handleFitToScreen}>
                        <Maximize className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Fit to Screen</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleResetView}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Reset View (100%)</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
  );
}
