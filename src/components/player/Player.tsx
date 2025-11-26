'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/lib/types';
import WidgetRenderer from '@/components/widgets/WidgetRenderer';
import { useEditorStore } from '@/stores';

interface PlayerProps {
  layout: Layout;
}

export default function Player({ layout }: PlayerProps) {
  const togglePreviewMode = useEditorStore(state => state.togglePreviewMode);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const exitPreview = () => {
    togglePreviewMode();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        exitPreview();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    window.addEventListener('resize', updateSize);
    updateSize(); 
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const scale = useMemo(() => {
    if (!layout || containerSize.width === 0 || containerSize.height === 0) {
      return 1;
    }
    const scaleX = containerSize.width / layout.width;
    const scaleY = containerSize.height / layout.height;
    return Math.min(scaleX, scaleY);
  }, [layout, containerSize]);


  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20 hover:text-white z-50"
        onClick={exitPreview}
      >
        <X className="h-6 w-6" />
        <span className="sr-only">Exit Preview</span>
      </Button>

      <div
        className="relative shadow-lg"
        style={{
          width: layout.width,
          height: layout.height,
          backgroundColor: layout.backgroundColor,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {layout.widgets.map((widget) => (
          <div
            key={widget.id}
            style={{
              position: 'absolute',
              left: widget.x,
              top: widget.y,
              width: widget.width,
              height: widget.height,
              zIndex: widget.zIndex,
            }}
          >
            <div className="w-full h-full overflow-hidden relative">
              <WidgetRenderer widget={widget} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
