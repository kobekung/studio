'use client';
import { Widget, WebviewWidgetProperties } from '@/lib/types';
import { useEditorStore } from '@/stores';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebouncedCallback } from 'use-debounce';

interface WebviewPropertiesProps {
  widget: Widget<WebviewWidgetProperties>;
}

export default function WebviewProperties({ widget }: WebviewPropertiesProps) {
  const updateWidgetProperties = useEditorStore(state => state.updateWidgetProperties);
  
  const debouncedDispatch = useDebouncedCallback((newProperties: WebviewWidgetProperties) => {
    updateWidgetProperties({ id: widget.id, properties: newProperties });
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newProperties = {
      ...widget.properties,
      [name]: value,
    };
    debouncedDispatch(newProperties);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-md">Web Page Options</h4>
      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          defaultValue={widget.properties.url}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </div>
    </div>
  );
}
