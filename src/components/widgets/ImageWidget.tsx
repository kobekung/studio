'use client';
import Image from 'next/image';
import { ImageWidgetProperties } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ImageWidgetProps {
  properties: ImageWidgetProperties;
}

export default function ImageWidget({ properties }: ImageWidgetProps) {
  const { imageUrl, altText } = properties;
  
  const placeholder = PlaceHolderImages.find(img => img.id === 'default-image-widget');
  const finalImageUrl = imageUrl || placeholder?.imageUrl || "https://picsum.photos/seed/10/400/300";
  const finalAltText = altText || placeholder?.description || 'Placeholder image';
  const hint = PlaceHolderImages.find(i => i.imageUrl === finalImageUrl)?.imageHint || 'image';

  return (
    <div className="w-full h-full relative bg-muted">
      <Image
        src={finalImageUrl}
        alt={finalAltText}
        fill
        style={{ objectFit: 'cover' }}
        data-ai-hint={hint}
      />
    </div>
  );
}
