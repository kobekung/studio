'use client';

import { TickerWidgetProperties } from '@/lib/types';
import Marquee from 'react-fast-marquee';

interface TickerWidgetProps {
  properties: TickerWidgetProperties;
}

export default function TickerWidget({ properties }: TickerWidgetProps) {
  const { text, direction, speed, textColor, backgroundColor, fontSize } = properties;

  const isVertical = direction === 'up' || direction === 'down';

  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
        fontSize: `${fontSize}px`,
      }}
    >
      <Marquee
        direction={direction}
        speed={speed}
        gradient={false}
        play={true}
        loop={0}
        vertical={isVertical}
        className="w-full h-full"
      >
        <div style={{ 
            whiteSpace: isVertical ? 'pre-wrap' : 'nowrap',
            wordBreak: isVertical ? 'break-word' : 'normal', 
            padding: isVertical ? '0 10px' : '0',
            width: isVertical ? '100%' : 'auto',
            display: 'inline-block'
          }}>
            {text}{!isVertical && '\u00A0\u00A0\u00A0\u00A0'}
        </div>
      </Marquee>
    </div>
  );
}
