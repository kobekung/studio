'use client';
import { useEditorStore } from '@/stores';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Canvas from './Canvas';
import Player from '@/components/player/Player';
import { useEffect, useState, useRef, useCallback, MouseEvent } from 'react';
import { mockLayout } from '@/lib/mock-data';
import { PanelLeftClose, PanelRightClose, PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ZoomControls from './ZoomControls';
import TemplateSelectionModal from './TemplateSelectionModal';

export default function EditorLayout() {
  const { 
    isPreviewMode, 
    layout, 
    loadLayout, 
    applyTemplate,
    viewState,
    setViewState,
    fitToScreen,
    deleteWidget,
    selectedWidgetId,
  } = useEditorStore(state => ({
    isPreviewMode: state.isPreviewMode,
    layout: state.layout,
    loadLayout: state.loadLayout,
    applyTemplate: state.applyTemplate,
    viewState: state.viewState,
    setViewState: state.setViewState,
    fitToScreen: state.fitToScreen,
    deleteWidget: state.deleteWidget,
    selectedWidgetId: state.selectedWidgetId,
  }));

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);

  useEffect(() => {
    if (!layout) {
      loadLayout(mockLayout);
    }
  }, [layout, loadLayout]);

  useEffect(() => {
    if (layout && layout.widgets.length === 0) {
      setIsTemplateModalOpen(true);
    }
  }, [layout]);
  
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const handleResize = () => {
      if (canvasContainerRef.current) {
        const { width, height } = canvasContainerRef.current.getBoundingClientRect();
        fitToScreen(width, height);
      }
    };
    
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize(); // Initial fit

    return () => resizeObserver.unobserve(container);
  }, [layout, fitToScreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedWidgetId) {
        e.preventDefault();
        deleteWidget(selectedWidgetId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedWidgetId, deleteWidget]);


  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // Pan on right-click or space+left-click
    if (e.button === 2 || (e.button === 0 && e.nativeEvent.altKey)) {
      e.preventDefault();
      isPanning.current = true;
      e.currentTarget.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isPanning.current) {
      setViewState({
        panX: viewState.panX + e.movementX,
        panY: viewState.panY + e.movementY,
      });
    }
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (isPanning.current) {
      isPanning.current = false;
      e.currentTarget.style.cursor = 'grab';
    }
  };
  
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const newScale = viewState.scale - e.deltaY * 0.001;
      setViewState({ scale: Math.max(0.1, newScale) });
    }
  }, [viewState.scale, setViewState]);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);


  const handleTemplateSelect = (template: any) => {
    applyTemplate(template);
    setIsTemplateModalOpen(false);
  };

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
            <div 
              ref={canvasContainerRef}
              className="flex-1 relative bg-muted/40 overflow-hidden cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onContextMenu={(e) => e.preventDefault()}
            >
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
              <Canvas />
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
              <ZoomControls />
            </div>
            {isRightSidebarOpen && <RightSidebar />}
          </main>
        </div>
        <TemplateSelectionModal
          isOpen={isTemplateModalOpen}
          onSelect={handleTemplateSelect}
          onClose={() => setIsTemplateModalOpen(false)}
        />
      </div>
    </TooltipProvider>
  );
}

    