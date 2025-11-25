# **App Name**: Signage Canvas

## Core Features:

- Layout Management: Create and manage digital signage layouts with specific dimensions.
- Mock Data Service: Simulate fetching layout data, including widgets with properties.
- Drag and Drop Widgets: Enable drag and drop and resizing functionalities for widgets on the canvas using react-rnd.
- Widget Registry: Dynamically render widgets (Clock, Text, Image) based on their types with a WidgetRenderer component.
- Properties Panel: Display a dynamic form in the right sidebar to edit widget properties, updating the widget in real-time.
- Preview Mode: Switch to a full-screen player mode, hiding all edit handles and displaying only the widgets on a black background, scaling to fit the browser window while maintaining aspect ratio.
- Dynamic Data tool for Widget Configuration: AI driven configuration tool. The LLM determines optimal initial values based on type of widget.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey professionalism and stability.
- Background color: Light gray (#F5F5F5) to provide a neutral workspace backdrop.
- Accent color: Soft orange (#FFAB40) to highlight interactive elements and calls to action.
- Body and headline font: 'Inter', a grotesque-style sans-serif, provides a modern, machined, objective, and neutral look; suitable for headlines and body text
- Utilize Lucide React icons for a consistent and clean interface.
- Left Sidebar: Dark theme with navigation menu (Layouts, Media, Schedules) and a 'Tools' section.
- Top Header: Light theme with layout name, 'Add Widget' buttons, and a 'Preview' button.