'use client';
import { Widget, ImageWidgetProperties } from '@/lib/types';
import { useEditorDispatch } from '@/context/EditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebouncedCallback } from 'use-debounce';
import { Textarea } from '../ui/textarea';

interface ImagePropertiesProps {
  widget: Widget<ImageWidgetProperties>;
}

export default function ImageProperties({ widget }: ImagePropertiesProps) {
  const dispatch = useEditorDispatch();

  const debouncedDispatch = useDebouncedCallback((payload) => {
    dispatch({ type: 'UPDATE_WIDGET_PROPERTIES', payload });
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newProperties = { ...widget.properties, [name]: value };
    debouncedDispatch({ id: widget.id, properties: newProperties });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-md">Image Options</h4>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          defaultValue={widget.properties.imageUrl}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="altText">Alt Text</Label>
        <Textarea
          id="altText"
          name="altText"
          defaultValue={widget.properties.altText}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
