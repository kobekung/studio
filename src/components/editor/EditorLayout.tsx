'use client';
import { useEditor } from '@/context/EditorContext';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Canvas from './Canvas';
import Player from '@/components/player/Player';

export default function EditorLayout() {
  const { isPreviewMode, layout } = useEditor();

  if (isPreviewMode && layout) {
    return <Player layout={layout} />;
  }

  return (
    <div className="flex h-screen w-screen bg-background font-body overflow-hidden">
      <LeftSidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 relative bg-muted/40">
            <Canvas />
          </div>
          <RightSidebar />
        </main>
      </div>
    </div>
  );
}
