'use client';
import { WebviewWidgetProperties } from '@/lib/types';

interface WebviewWidgetProps {
  properties: WebviewWidgetProperties;
}

export default function WebviewWidget({ properties }: WebviewWidgetProps) {
  const { url } = properties;

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  if (!url || !isValidUrl(url)) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground p-4">
        <p className="text-center">Invalid or missing URL. Please provide a valid URL in the properties panel (e.g., https://www.google.com).</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full bg-background">
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="Webview Content"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
