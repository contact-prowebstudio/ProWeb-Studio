# Z-Index Hierarchy and Layer Management

## Site-wide Z-Index Hygiene Implementation

This document outlines the proper z-index hierarchy and pointer-events configuration to ensure clean layering throughout the application.

## Z-Index Hierarchy (Lowest to Highest)

### Background Layer (`-z-10`)
- **HeroBackground.tsx**: Static background images
  - Class: `fixed inset-0 -z-10 pointer-events-none`
  - Purpose: Cosmic background imagery behind all content

### Decorative 3D Layer (`z-0`)
All 3D canvases and decorative elements stay behind interactive content:

#### R3F Canvas Components:
- **Scene3D.tsx**: `absolute inset-0 z-0 pointer-events-none`
- **HeroCanvas.tsx**: `absolute inset-0 z-0 pointer-events-none`
- **PortalScene.tsx**: `absolute inset-0 z-0 pointer-events-none`
- **HexagonalPrism.tsx**: `absolute inset-0 z-0 pointer-events-none`
- **AboutScene.tsx**: `absolute inset-0 z-0 pointer-events-none`
- **FlowingRibbons.tsx**: `absolute inset-0 z-0 pointer-events-none`
- **TechPlaygroundScene.tsx**: `z-0` (interactive canvas - no pointer-events-none)

### Content Layer (`z-10`)
Interactive content and text overlays:
- Hero text content: `relative z-10`
- Service page content: `relative z-10`
- Control buttons and overlays: `absolute ... z-10`

### Header Layer (`z-50`)
Main site navigation:
- **Header.tsx**: `fixed top-0 w-full z-50`

### Cursor Effects (`z-[100]`)
- **CursorTrail.tsx**: `fixed inset-0 pointer-events-none z-[100]`

### Mobile Menu Portal (`z-[9999]`)
Highest priority for mobile navigation:
- **Header.tsx Mobile Menu**: Rendered via **Portal.tsx** with `fixed inset-0 z-[9999]`

## Key Principles

### 1. 3D Canvas Guidelines
✅ **DO:**
- Wrap all decorative R3F Canvas components with `absolute inset-0 z-0 pointer-events-none`
- Use `z-0` for all background/decorative 3D elements
- Keep interactive canvases (like TechPlaygroundScene) at `z-0` but without `pointer-events-none`

❌ **DON'T:**
- Apply z-index higher than `z-10` to decorative canvases
- Add pointer-events to decorative 3D elements
- Use relative positioning for background canvases

### 2. Header and Navigation
✅ **DO:**
- Keep header at `z-50` for normal content overlay
- Use Portal for mobile menu with `z-[9999]` for guaranteed top layer
- Ensure no transform properties on header ancestors

❌ **DON'T:**
- Apply transform properties to header container elements
- Use z-index values between `z-50` and `z-[9999]` unnecessarily

### 3. Content Layering
✅ **DO:**
- Use `relative z-10` for content that should appear above 3D backgrounds
- Keep content z-index values reasonable (z-10, z-20, etc.)
- Use absolute positioning with z-index for overlays and controls

❌ **DON'T:**
- Use extremely high z-index values unnecessarily
- Mix relative and absolute positioning without considering stacking context

## Portal Implementation

### Portal.tsx
- Creates isolated stacking context for modal/overlay content
- Appends directly to document.body for guaranteed top-level positioning
- Used exclusively for mobile menu to avoid stacking context conflicts

### Benefits:
- Clean separation of navigation from page content
- Guaranteed overlay behavior regardless of page structure
- Automatic cleanup of empty portal containers

## Implementation Status

### ✅ Completed Changes:
1. **All decorative Canvas components**: Wrapped with `z-0 pointer-events-none`
2. **Header mobile menu**: Uses Portal with `z-[9999]`
3. **Background elements**: Properly set to `-z-10`
4. **Content overlays**: Consistent `z-10` usage
5. **No transform conflicts**: Clean header ancestor structure

### 🎯 Result:
- Clean z-index hierarchy with no conflicts
- Proper pointer-events for decorative vs interactive elements
- Mobile menu guaranteed to appear above all content
- 3D backgrounds stay behind all interactive content
- No accidental transform issues on header

## Future Maintenance

When adding new components:

1. **3D/Canvas elements**: Always wrap with `absolute inset-0 z-0 pointer-events-none` for decoration
2. **Interactive overlays**: Use `z-10` or specific values within the established hierarchy
3. **Modal/popup content**: Consider using Portal for isolation
4. **Avoid high z-index values**: Stay within the established ranges unless absolutely necessary

This hierarchy ensures clean layering, proper interaction behavior, and maintainable CSS architecture.