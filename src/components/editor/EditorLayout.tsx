'use client';
import { useEditorStore } from '@/stores';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Canvas from './Canvas';
import Player from '@/components/player/Player';
import { useEffect, useState, useRef, useCallback } from 'react';
import { mockLayout } from '@/lib/mock-data';
import { PanelLeftClose, PanelRightClose, PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ZoomControls from './ZoomControls';

export default function EditorLayout() {
  const { isPreviewMode, layout, loadLayout, setZoom } = useEditorStore(state => ({
    isPreviewMode: state.isPreviewMode,
    layout: state.layout,
    loadLayout: state.loadLayout,
    setZoom: state.setZoom,
  }));

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasContainerSize, setCanvasContainerSize] = useState({ width: 0, height: 0 });
  
  // Load initial layout into the store
  useEffect(() => {
    if (!layout) {
      loadLayout(mockLayout);
    }
  }, [layout, loadLayout]);

  const calculateFitToScreenZoom = useCallback(() => {
    if (!layout || canvasContainerSize.width === 0 || canvasContainerSize.height === 0) {
      return 1;
    }
    const scaleX = canvasContainerSize.width / layout.width;
    const scaleY = canvasContainerSize.height / layout.height;
    return Math.min(scaleX, scaleY) * 0.9;
  }, [layout, canvasContainerSize]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasContainerRef.current) {
        const { width, height } = canvasContainerRef.current.getBoundingClientRect();
        setCanvasContainerSize({ width, height });
        // Recalculate and set fit-to-screen zoom on resize
        const newZoom = calculateFitToScreenZoom();
        setZoom(newZoom);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    const container = canvasContainerRef.current;
    if (container) {
      resizeObserver.observe(container);
      handleResize(); // Initial calculation
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [calculateFitToScreenZoom, setZoom]);

  const fitToScreen = () => {
    const newZoom = calculateFitToScreenZoom();
    setZoom(newZoom);
  }

  if (isPreviewMode && layout) {
    return <Player layout={layout} />;
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen bg-background font-body overflow-hidden">
        {isLeftSidebarOpen && <LeftSidebar />}
        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main className="flex flex-1 min-h-0">
            <div ref={canvasContainerRef} className="flex-1 relative bg-muted/40 overflow-hidden">
              <div className="absolute top-2 left-2 z-10">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}>
                      {isLeftSidebarOpen ? <PanelLeftClose /> : <PanelLeft />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{isLeftSidebarOpen ? 'Collapse' : 'Expand'} Left Sidebar</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Canvas containerSize={canvasContainerSize} />
               <div className="absolute top-2 right-2 z-10">
                 <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}>
                      {isRightSidebarOpen ? <PanelRightClose /> : <PanelRight />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{isRightSidebarOpen ? 'Collapse' : 'Expand'} Right Sidebar</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <ZoomControls onFitToScreen={fitToScreen}/>
            </div>
            {isRightSidebarOpen && <RightSidebar />}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
