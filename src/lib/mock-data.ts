import type { Layout } from './types';
import { PlaceHolderImages } from './placeholder-images';

const initialImage = PlaceHolderImages.find(img => img.id === 'mock-image-1');

export const mockLayout: Layout = {
  id: 'layout-1',
  name: 'Sample Layout',
  width: 1920,
  height: 1080,
  backgroundColor: '#FFFFFF',
  widgets: [],
};
