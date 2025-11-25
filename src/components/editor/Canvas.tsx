'use client';
import { Rnd } from 'react-rnd';
import { useEditorStore } from '@/stores';
import WidgetRenderer from '@/components/widgets/WidgetRenderer';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';

export default function Canvas() {
  const { layout, selectedWidgetId, selectWidget, updateWidgetPosition, updateWidgetSize } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const resizeCanvas = () => {
    if (containerRef.current && layout) {
      const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
      const scaleX = containerWidth / layout.width;
      const scaleY = containerHeight / layout.height;
      setScale(Math.min(scaleX, scaleY) * 0.9); // 90% of the available space
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [layout]);
  
  useEffect(resizeCanvas, []);


  if (!layout) {
    return <div className="flex items-center justify-center h-full">Loading Canvas...</div>;
  }

  const handleDragStop = (id: string, d: any) => {
    updateWidgetPosition({ id, x: d.x / scale, y: d.y / scale });
  };

  const handleResizeStop = (id: string, ref: any, position: any) => {
    updateWidgetSize({
      id,
      width: ref.offsetWidth / scale,
      height: ref.offsetHeight / scale,
    });
    updateWidgetPosition({ id, x: position.x / scale, y: position.y / scale });
  };

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-auto">
        <div
          id="canvas"
          className="relative shadow-lg bg-background"
          style={{
            width: layout.width,
            height: layout.height,
            backgroundColor: layout.backgroundColor,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              selectWidget(null);
            }
          }}
        >
          {layout.widgets.map((widget) => (
            <Rnd
              key={widget.id}
              size={{ width: widget.width, height: widget.height }}
              position={{ x: widget.x, y: widget.y }}
              onDragStop={(_e, d) => updateWidgetPosition({ id: widget.id, x: d.x, y: d.y })}
              onResizeStop={(_e, _direction, ref, _delta, position) => {
                updateWidgetSize({
                    id: widget.id,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                });
                updateWidgetPosition({ id: widget.id, x: position.x, y: position.y });
              }}
              bounds="parent"
              className={cn(
                'group focus:outline-none',
                selectedWidgetId === widget.id ? 'ring-2 ring-primary ring-offset-2 z-20' : `z-${widget.zIndex}`
              )}
              onClick={(e) => {
                e.stopPropagation();
                selectWidget(widget.id);
              }}
            >
              <div className="w-full h-full overflow-hidden relative">
                <WidgetRenderer widget={widget} />
              </div>
            </Rnd>
          ))}
        </div>
    </div>
  );
}
