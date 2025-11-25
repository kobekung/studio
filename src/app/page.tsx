import { EditorProvider } from '@/context/EditorContext';
import EditorLayout from '@/components/editor/EditorLayout';

export default function Home() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}
