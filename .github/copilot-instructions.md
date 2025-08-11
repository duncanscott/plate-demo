# Copilot Instructions for plate-demo

## Project Overview
- **Monorepo** with Next.js 15 app (`src/`), UI/feature/layout components, and two packages:
  - `packages/react-well-plates`: React components for rendering well plates
  - `packages/well-plates`: Utility library for well plate position manipulation
- **TypeScript** and **Tailwind CSS** throughout
- **App Router** structure (Next.js)

## Key Workflows
- **Start dev server:** `npm run dev` (http://localhost:3000)
- **Build:** `npm run build`
- **Production:** `npm start`
- **Lint:** `npm run lint`
- **Storybook:** See `packages/react-well-plates/stories/` and [storybook site](https://react-well-plates.pages.dev/)

## Architecture & Patterns
- **Component organization:**
  - `src/components/layout/`: Layout (e.g., `ResizableColumns`)
  - `src/components/ui/`: Reusable UI
  - `src/components/features/`: Feature-specific
- **Root layout:** `src/app/layout.tsx` (sticky header, resizable columns, tools panel)
- **Global styles:** `src/app/globals.css` (CSS Grid, custom properties, dark theme)
- **Path alias:** `@/*` → `src/*`
- **State persistence:** LocalStorage for sidebar width/collapse in `ResizableColumns`
- **Hydration-safe patterns** for SSR/client state
- **Accessibility:** ARIA, keyboard navigation, focus management in layout components
- **Responsive design:** CSS Grid, custom properties, breakpoint at 800px

## Packages
- **react-well-plates:**
  - React components for well plate visualization
  - Usage examples in Storybook (`stories/`)
- **well-plates:**
  - Utility functions for well plate positions
  - API docs: https://cheminfo.github.io/well-plates

## Conventions
- **TypeScript** for all code
- **Tailwind CSS** for styling
- **Dark theme** and mobile-first design
- **LocalStorage keys:** `sidebarWidth`, `sidebarCollapsed`
- **No custom test runner documented** (see package READMEs for details)

## External Integrations
- **Vercel** for deployment (see Next.js docs)
- **Zakodium** maintains `react-well-plates`
- **Cheminfo** maintains `well-plates`

## Example: ResizableColumns Usage
- See `src/components/layout/ResizableColumns.tsx` for pointer/keyboard handling, ARIA, and persistence logic

---
_If any section is unclear or missing, please provide feedback to improve these instructions._
