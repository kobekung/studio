'use client';

import create from 'zustand';
import { Layout, Widget, WidgetType, TemplateType } from '@/lib/types';
import { getWidgetDefaults } from '@/app/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { mockLayout } from '@/lib/mock-data';
import { createLayoutFromTemplate } from '@/lib/template-helpers';

type ViewState = {
  scale: number;
  panX: number;
  panY: number;
};

type EditorState = {
  layout: Layout | null;
  selectedWidgetId: string | null;
  isPreviewMode: boolean;
  isWidgetLoading: boolean;

  // New state for panning and zooming
  viewState: ViewState;
  
  // Actions
  loadLayout: (layout: Layout) => void;
  selectWidget: (widgetId: string | null) => void;
  updateWidgetPosition: (payload: { id: string; x: number; y: number }) => void;
  updateWidgetSize: (payload: { id: string; width: number; height: number }) => void;
  updateWidgetProperties: (payload: { id: string; properties: any }) => void;
  updateLayoutDimensions: (payload: { width: number; height: number }) => void;
  addWidget: (widget: Widget) => void;
  addNewWidget: (type: WidgetType) => Promise<void>;
  deleteWidget: (widgetId: string) => void;
  togglePreviewMode: () => void;
  setWidgetLoading: (isLoading: boolean) => void;
  
  // ViewState Actions
  setViewState: (viewState: Partial<ViewState>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: (viewportWidth: number, viewportHeight: number) => void;
  resetView: (viewportWidth: number, viewportHeight: number) => void;

  applyTemplate: (template: TemplateType) => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  layout: null,
  selectedWidgetId: null,
  isPreviewMode: false,
  isWidgetLoading: false,
  viewState: {
    scale: 1,
    panX: 0,
    panY: 0,
  },

  loadLayout: (layout) => set({ layout }),

  selectWidget: (widgetId) => set({ selectedWidgetId: widgetId }),

  updateWidgetPosition: (payload) => set(state => {
    if (!state.layout) return {};
    return {
      layout: {
        ...state.layout,
        widgets: state.layout.widgets.map((widget) =>
          widget.id === payload.id ? { ...widget, ...payload } : widget
        ),
      },
    };
  }),

  updateWidgetSize: (payload) => set(state => {
    if (!state.layout) return {};
    return {
      layout: {
        ...state.layout,
        widgets: state.layout.widgets.map((widget) =>
          widget.id === payload.id ? { ...widget, ...payload } : widget
        ),
      },
    };
  }),

  updateWidgetProperties: (payload) => set(state => {
    if (!state.layout) return {};
    return {
      layout: {
        ...state.layout,
        widgets: state.layout.widgets.map((widget) =>
          widget.id === payload.id ? { ...widget, properties: payload.properties } : widget
        ),
      },
    };
  }),
  
  updateLayoutDimensions: (payload) => set(state => {
    if (!state.layout) return {};
    return {
      layout: {
        ...state.layout,
        width: payload.width,
        height: payload.height,
      },
    };
  }),

  addWidget: (widget) => set(state => {
    if (!state.layout) return {};
    return {
      layout: {
        ...state.layout,
        widgets: [...state.layout.widgets, widget],
      },
    };
  }),
  
  deleteWidget: (widgetId) => set(state => {
    if (!state.layout) return {};
    return {
      layout: {
        ...state.layout,
        widgets: state.layout.widgets.filter(w => w.id !== widgetId),
      },
      selectedWidgetId: state.selectedWidgetId === widgetId ? null : state.selectedWidgetId,
    };
  }),

  addNewWidget: async (type: WidgetType) => {
    set({ isWidgetLoading: true });
    try {
      const properties = await getWidgetDefaults(type);
      const state = get();
      
      const newWidget: Widget = {
        id: `widget-${Date.now()}`,
        type,
        x: 100,
        y: 100,
        width: (type === 'webview') ? 600 : 400,
        height: (type === 'webview') ? 400 : ((type === 'ticker') ? 100 : 200),
        zIndex: (state.layout?.widgets.length || 0) + 1,
        properties: { ...properties },
      };

      if (type === 'image') {
        newWidget.properties.fitMode = 'fill';
        if (!newWidget.properties.playlist) {
            const defaultImage = PlaceHolderImages.find(img => img.id === 'default-image-widget');
            newWidget.properties.playlist = [{
                id: `media-${Date.now()}`,
                url: defaultImage?.imageUrl || 'https://picsum.photos/seed/10/400/300',
                type: 'image',
                duration: 10
            }];
        }
      }

      if (type === 'ticker') {
        if (!newWidget.properties.text) {
            newWidget.properties = {
                text: 'This is a sample scrolling text. Change it in the properties panel!',
                direction: 'left',
                speed: 50,
                textColor: '#000000',
                backgroundColor: '#FFFFFF',
                fontSize: 48,
            }
        }
      }

      set(state => ({
        layout: state.layout ? {
          ...state.layout,
          widgets: [...state.layout.widgets, newWidget],
        } : state.layout,
        selectedWidgetId: newWidget.id,
      }));

    } catch (e) {
      console.error("Failed to add widget:", e);
    } finally {
      set({ isWidgetLoading: false });
    }
  },

  togglePreviewMode: () => set(state => ({ 
    isPreviewMode: !state.isPreviewMode, 
    selectedWidgetId: null 
  })),
  
  setWidgetLoading: (isLoading) => set({ isWidgetLoading: isLoading }),
  
  setViewState: (newViewState) => set(state => ({
    viewState: { ...state.viewState, ...newViewState },
  })),

  zoomIn: () => set(state => ({
    viewState: { ...state.viewState, scale: state.viewState.scale + 0.1 },
  })),

  zoomOut: () => set(state => ({
    viewState: { ...state.viewState, scale: Math.max(0.1, state.viewState.scale - 0.1) },
  })),

  fitToScreen: (viewportWidth, viewportHeight) => {
    const layout = get().layout;
    if (!layout) return;

    const padding = 50;
    const scaleX = (viewportWidth - padding * 2) / layout.width;
    const scaleY = (viewportHeight - padding * 2) / layout.height;
    const scale = Math.min(scaleX, scaleY);
    
    const panX = (viewportWidth - layout.width * scale) / 2;
    const panY = (viewportHeight - layout.height * scale) / 2;

    set({ viewState: { scale, panX, panY } });
  },

  resetView: (viewportWidth, viewportHeight) => {
    const layout = get().layout;
    if (!layout) return;

    const scale = 1;
    const panX = (viewportWidth - layout.width * scale) / 2;
    const panY = (viewportHeight - layout.height * scale) / 2;
    set({ viewState: { scale, panX, panY } });
  },
  
  applyTemplate: (template) => set(state => {
    if (!state.layout) {
        // If layout is null, create a new one from mockLayout and then apply template
        const newLayoutWithTemplate = createLayoutFromTemplate(mockLayout, template);
        return { layout: newLayoutWithTemplate };
    }
    const newLayout = createLayoutFromTemplate(state.layout, template);
    return { layout: newLayout, selectedWidgetId: null };
  }),
}));

// Initialize the store with mock data
useEditorStore.getState().loadLayout(mockLayout);

    