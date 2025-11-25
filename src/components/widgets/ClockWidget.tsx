'use client';

import { useState, useEffect } from 'react';
import { ClockWidgetProperties } from '@/lib/types';

interface ClockWidgetProps {
  properties: ClockWidgetProperties;
}

export default function ClockWidget({ properties }: ClockWidgetProps) {
  const { showSeconds, format, color, fontSize } = properties;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: showSeconds ? 'numeric' : undefined,
      hour12: format === '12h',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  if (!time) {
    return null; // Or a loading state
  }

  return (
    <div 
      className="w-full h-full flex items-center justify-center font-mono"
      style={{
        color: color,
        fontSize: `${fontSize}px`,
      }}
    >
      {formatTime(time)}
    </div>
  );
}
