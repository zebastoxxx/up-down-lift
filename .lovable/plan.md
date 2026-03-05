

## Diagnosis

The issue is clear: the previous design changes were **not fully applied** to several page files. Specifically:

1. **Preoperational.tsx** (line 841) still has the large `<h1>` header "Preoperacional" with subtitle and operator info — this is exactly what both screenshots show.
2. The `renderHeader()` function (line 498) also renders a duplicate header inside the form steps.
3. Other pages may have similar leftover headers.

The green palette and sidebar changes from `index.css`, `tailwind.config.ts`, and `AppSidebar.tsx` **are** in the code, but the preview may be showing a cached/stale version. The published version (second screenshot) shows the sidebar correctly but still has the large headers.

## Plan

### 1. Remove all redundant headers from every page module

**Preoperational.tsx:**
- Remove lines 840-850 (the large `<h1>`, subtitle, and operator badge)
- Simplify `renderHeader()` (lines 498-530) to remove the back button + title block, keeping only the step indicator badge and offline badge as a compact inline bar
- Remove the `min-h-screen` wrapper and redundant nested containers

**Machines.tsx, Clients.tsx, Projects.tsx, Settings.tsx, WarehouseInspection.tsx:**
- Audit each for any remaining `<h1>` or `ModuleHeader` with title/subtitle and remove them
- Keep only action bars (search, filters, buttons) at the top

### 2. Compact the page containers

- Change container padding from `p-4 sm:p-6` to `p-4` with `space-y-4` (tighter)
- Ensure all modules use consistent compact padding (`16px` cards, `24px` page)

### 3. Ensure CSS/Tailwind changes are properly referenced

- Verify `index.css` has the green palette variables (already confirmed — they're there)
- Verify `tailwind.config.ts` maps to the correct CSS variables (already confirmed)

### Technical Details

Files to modify:
- `src/pages/Preoperational.tsx` — remove h1 header block (lines 840-850), simplify renderHeader
- `src/pages/Machines.tsx` — remove any remaining header
- `src/pages/Clients.tsx` — remove any remaining header  
- `src/pages/Projects.tsx` — remove any remaining header
- `src/pages/Settings.tsx` — remove any remaining header
- `src/pages/WarehouseInspection.tsx` — remove any remaining header

