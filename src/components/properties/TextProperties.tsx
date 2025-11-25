'use client';
import { Widget, TextWidgetProperties } from '@/lib/types';
import { useEditorDispatch } from '@/context/EditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDebouncedCallback } from 'use-debounce';

interface TextPropertiesProps {
  widget: Widget<TextWidgetProperties>;
}

export default function TextProperties({ widget }: TextPropertiesProps) {
  const dispatch = useEditorDispatch();
  
  const debouncedDispatch = useDebouncedCallback((payload) => {
    dispatch({ type: 'UPDATE_WIDGET_PROPERTIES', payload });
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newProperties = {
      ...widget.properties,
      [name]: name === 'fontSize' ? Number(value) : value,
    };
    debouncedDispatch({ id: widget.id, properties: newProperties });
  };

  return (
    <div className="space-y-4">
        <h4 className="font-medium text-md">Text Options</h4>
        <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
            id="content"
            name="content"
            defaultValue={widget.properties.content}
            onChange={handleChange}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                    id="color"
                    name="color"
                    type="color"
                    defaultValue={widget.properties.color}
                    onChange={handleChange}
                    className="p-1"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Input
                    id="fontSize"
                    name="fontSize"
                    type="number"
                    defaultValue={widget.properties.fontSize}
                    onChange={handleChange}
                />
            </div>
      </div>
    </div>
  );
}
