export type WidgetType = 'text' | 'clock' | 'image';

export interface TextWidgetProperties {
  content: string;
  color: string;
  fontSize: number;
}

export interface ImageWidgetProperties {
  imageUrl: string;
  altText: string;
}

export interface ClockWidgetProperties {
  showSeconds: boolean;
  format: '12h' | '24h';
  color: string;
  fontSize: number;
}

export type WidgetProperties = TextWidgetProperties | ImageWidgetProperties | ClockWidgetProperties;

export interface Widget<T extends WidgetProperties = WidgetProperties> {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  properties: T;
}

export interface Layout {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  widgets: Widget<any>[];
}
