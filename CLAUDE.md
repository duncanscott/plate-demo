# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with turbopack (opens at http://localhost:3000)
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

This is a Next.js 15 application with App Router using TypeScript and Tailwind CSS. The project demonstrates a resizable column layout pattern with a sticky header and tools panel.

### Key Components

- **ResizableColumns** (`src/components/ResizableColumns.tsx`) - Core reusable component that creates a resizable two-column layout with:
  - Pointer Events API for drag handling (mouse, touch, pen support)
  - Keyboard navigation (arrow keys, Home/End, Escape)
  - Collapse/expand functionality with localStorage persistence
  - Accessibility features (ARIA labels, focus management)
  - CSS custom properties for dynamic width control

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