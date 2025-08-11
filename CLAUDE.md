# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with turbopack (opens at http://localhost:3000)
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

This is a Next.js 15 application with App Router using TypeScript and Tailwind CSS. The project features dual Excel-like data grids with advanced functionality, a resizable layout system, and page-specific tools panels.

### Component Organization

Components are organized by purpose:
- `src/components/layout/` - Layout components (ResizableColumns, etc.)
- `src/components/ui/` - Reusable UI components (buttons, inputs, etc.)
- `src/components/features/` - Feature-specific components

### Key Components

- **ResizableColumns** (`src/components/layout/ResizableColumns.tsx`) - Core reusable component that creates a resizable two-column layout with:
  - Pointer Events API for drag handling (mouse, touch, pen support)
  - Keyboard navigation (arrow keys, Home/End, Escape)
  - Collapse/expand functionality with localStorage persistence
  - Accessibility features (ARIA labels, focus management)
  - CSS custom properties for dynamic width control

- **ToolsContext** (`src/components/layout/ToolsContext.tsx`) - Context system for page-specific tools panels:
  - `useTools(content, deps)` hook for setting tools content
  - Dependency-aware updates to prevent infinite re-renders
  - Default fallback tools for pages without custom tools

- **Grid Page** (`src/app/grid/page.tsx`) - Dual data grid implementation with:
  - Main data grid with native Excel/CSV paste support (Ctrl+V/⌘V)
  - Token processing grid with 5-column layout
  - Column sorting (click headers for asc/desc)
  - Column resizing (drag borders)
  - Token lookup and processing workflow

### Layout Structure

- **Root Layout** (`src/app/layout.tsx`) - Implements the shell structure:
  - Sticky header with navigation
  - ResizableColumns wrapper with tools panel
  - Page content as children
- **Global Styles** (`src/app/globals.css`) - CSS Grid-based layout system:
  - CSS custom properties for theming and responsive design
  - Grid template: `header` / `content` with tools | handle | main columns
  - Responsive breakpoint at 800px (stacks columns on mobile)

### Path Aliases

- `@/*` maps to `src/*` for clean imports

### State Management

- ResizableColumns uses localStorage for persistence:
  - `sidebarWidth` - stores panel width
  - `sidebarCollapsed` - stores collapsed state
- Hydration-safe pattern prevents SSR/client mismatches

### Styling Approach

- CSS custom properties for dynamic values (e.g., `--sidebar-px`)
- Grid-based layout with CSS Grid
- Dark theme color scheme
- Mobile-first responsive design

## Key Dependencies

- **@glideapps/glide-data-grid** - High-performance data grid with Excel-like functionality
- **react-well-plates** - MIT-licensed well plate visualization components
- **marked** - Markdown parsing for content rendering
- **react-responsive-carousel** - Carousel component for UI elements

## Grid Functionality

The `/grid` page demonstrates advanced data grid capabilities:

### Main Data Grid
- Native paste support from Excel, Google Sheets, CSV
- Dynamic column generation based on pasted data
- Intelligent data type detection (numbers, strings, booleans)
- Column sorting with visual feedback
- Column resizing with persistent widths

### Token Processing Grid  
- Fixed 5-column structure (Token, Result, Status, Notes, Extra)
- Token input via tools panel text area
- Process tokens into leftmost column with mock results
- Independent sorting and resizing from main grid

### Usage Patterns
- Paste data: Copy from Excel → Ctrl+V/⌘V directly into grid
- Sort columns: Click column headers to toggle asc/desc
- Resize columns: Drag column borders to adjust widths
- Process tokens: Enter tokens in tools panel → click "Process Tokens"