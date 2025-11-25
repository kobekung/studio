'use client';

import { TextWidgetProperties } from '@/lib/types';

interface TextWidgetProps {
  properties: TextWidgetProperties;
}

export default function TextWidget({ properties }: TextWidgetProps) {
  const { content, color, fontSize } = properties;

  return (
    <div
      className="w-full h-full flex items-center justify-center p-2 box-border"
      style={{
        color: color,
        fontSize: `${fontSize}px`,
        lineHeight: 1.2,
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
      }}
    >
      {content}
    </div>
  );
}
