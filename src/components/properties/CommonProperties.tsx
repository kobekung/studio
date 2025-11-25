'use client';

import { Widget } from '@/lib/types';
import { useEditorDispatch } from '@/context/EditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CommonPropertiesProps {
  widget: Widget;
}

export default function CommonProperties({ widget }: CommonPropertiesProps) {
  const dispatch = useEditorDispatch();

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_WIDGET_POSITION',
      payload: { ...widget, id: widget.id, [name]: Number(value) },
    });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_WIDGET_SIZE',
      payload: { ...widget, id: widget.id, [name]: Number(value) },
    });
  };

  return (
    <div className="space-y-4">
        <h4 className="font-medium text-md">Transform</h4>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="x">X</Label>
                <Input id="x" name="x" type="number" value={Math.round(widget.x)} onChange={handlePositionChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="y">Y</Label>
                <Input id="y" name="y" type="number" value={Math.round(widget.y)} onChange={handlePositionChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input id="width" name="width" type="number" value={Math.round(widget.width)} onChange={handleSizeChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" name="height" type="number" value={Math.round(widget.height)} onChange={handleSizeChange} />
            </div>
        </div>
    </div>
  );
}
