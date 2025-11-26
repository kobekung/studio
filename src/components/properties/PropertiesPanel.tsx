'use client';
import { Widget } from '@/lib/types';
import CommonProperties from './CommonProperties';
import TextProperties from './TextProperties';
import ImageProperties from './ImageProperties';
import ClockProperties from './ClockProperties';
import TickerProperties from './TickerProperties';
import WebviewProperties from './WebviewProperties';
import { Separator } from '../ui/separator';

interface PropertiesPanelProps {
  widget: Widget;
}

export default function PropertiesPanel({ widget }: PropertiesPanelProps) {
  const renderWidgetProperties = () => {
    switch (widget.type) {
      case 'text':
        return <TextProperties widget={widget} />;
      case 'image':
        return <ImageProperties widget={widget} />;
      case 'clock':
        return <ClockProperties widget={widget} />;
      case 'ticker':
        return <TickerProperties widget={widget} />;
      case 'webview':
        return <WebviewProperties widget={widget} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <CommonProperties widget={widget} />
      <Separator />
      {renderWidgetProperties()}
    </div>
  );
}
