# Fishbone Diagram Engine Architecture

## Component Topology
- `FishboneDiagram` (integration wrapper with `DiagramContent` serialization)
- `FishboneCanvas` (stateful interaction surface, SVG viewport, pan/zoom)
- `Bone` (main cause branch: line, label, drag handle, actions)
- `SubBone` (secondary branch: line, inline editor, actions)
- `layout.ts` (pure geometry + spacing/collision rules)
- `adapter.ts` (model conversion between legacy flat keys and advanced JSON model)

## State Model Example
```ts
interface FishboneModel {
  effect: string;
  bones: Array<{
    id: string;
    label: string;
    side: 'top' | 'bottom';
    angle: number;
    manualDx?: number;
    manualDy?: number;
    subCauses: Array<{
      id: string;
      text: string;
    }>;
  }>;
}
```

## Improved SVG Structure (Production Pattern)
```tsx
<svg viewBox={`0 0 ${layout.width} ${layout.height}`}>
  <defs>
    <linearGradient id="fish-head-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFBBE1" />
      <stop offset="100%" stopColor="#DD7BDF" />
    </linearGradient>
    <filter id="head-shadow">...</filter>
  </defs>

  <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
    <line x1={spineStart.x} y1={spineStart.y} x2={spineEnd.x} y2={spineEnd.y} />
    <path d={fishHeadPath} fill="url(#fish-head-grad)" filter="url(#head-shadow)" />
    {boneLayouts.map(...)}
  </g>
</svg>
```

## Persistence Strategy
- Advanced model is persisted into `content.fishboneModel` (JSON string).
- Legacy compatibility is preserved:
  - `problem` remains mapped from `effect`
  - first 5 bones are mirrored to `people`, `process`, `materials`, `environment`, `methods`

This allows existing generation/evaluation flows to continue functioning while enabling richer editing.

## Layout Algorithm (Pure Function)
`calculateFishboneLayout(model, width, height)`

### Steps
1. Define spine, head center, and viewport-safe boundaries.
2. Partition bones by side (`top`, `bottom`).
3. Distribute each side using weighted spacing (bone density and sub-cause count).
4. For each bone:
   - compute base point on spine
   - apply manual drag offsets
  - compute endpoint by polar projection with fixed professional angles (`-45°`, `+45°`)
5. Generate sub-bones along normalized fractions over the parent bone.
6. Apply label collision mitigation:
   - maintain placed labels list
  - if near overlap, nudge both axis (`x`,`y`) to reduce cluster collisions

## Smart Spacing Logic
- Each side has a weighted lane model:
  - base weight per main bone
  - extra weight based on sub-cause count
- Anchor x positions are generated from accumulated weighted segments.
- This prevents dense categories from overlapping sparse categories and improves readability at scale.

### Why this scales
- Layout is deterministic and stateless
- Interaction changes only mutate model; layout recomputes from model
- Easy to plug advanced heuristics (force spacing, snap grids, overlap matrices)

## Interaction Model
### Inline Editing
- Text labels become editable with `foreignObject + contentEditable` on double-click.
- Commit on blur/Enter.

### Dragging
- Drag handle on each main bone.
- Pointer delta is converted to model offsets (`manualDx/manualDy`) normalized by zoom.
- No DOM transforms stored in layout; drag is model-based so rerenders are stable.

### Active/Hover States
- Hover: branch color and weight intensify.
- Selected: glow/outline overlay with stronger branch stroke.
- Context actions appear only on hover to reduce visual noise.

### Add/Remove
- Hover `+` on bone endpoint adds sub-cause.
- Spine-level `+` adds main category.
- Hover delete icon on bones/sub-bones removes nodes.

### Auto-Balance
- New main bone side chooses currently smaller side count.
- New angle uses side-aware defaults with variation by order.

### Context Menu
- Right-click stores target metadata (`bone` / `sub`) and opens custom menu.
- Actions are target-aware (add sub-cause, delete sub-cause, delete category).

### Pan/Zoom
- Wheel controls zoom (`0.55`–`1.8` range).
- Background drag pans viewport.
- View transform is applied to main SVG group.
- Fit-to-screen computes centered `pan + zoom` based on layout bounds.
- Mini-map reflects viewport rectangle for spatial orientation.

## Animation Approach
- Branch and sub-branch enter/exit animations are handled with `framer-motion` (`motion.g` + `AnimatePresence`).
- Transition timing stays short (180–220ms) for perceived responsiveness.
- Layout changes animate via transform and stroke transitions, not expensive reflow operations.

## Dynamic Recalculation Flow
1. User interaction mutates model (`setModel`).
2. `FishboneCanvas` recomputes geometry via `useMemo(calculateFishboneLayout)`.
3. `FishboneDiagram` serializes model and emits `onContentChange`.
4. Parent store/page persists updated `DiagramContent`.
5. On reload/edit, `adapter.ts` reconstructs the full interactive model.

## Reusability for Other Diagram Types
The same architecture maps to other engines by replacing shape generator + layout strategy:

### Mind Map
- Keep model/adapter/interactions.
- Swap layout with radial tree layout.
- Reuse `motion.g` node rendering and inline label editing.

### Tree Diagram
- Replace layout with layered DAG/tree layout (top-down or left-right).
- Keep toolbar, pan/zoom, minimap, and selection model.

### Flowchart
- Replace node/edge generator with orthogonal connectors + ports.
- Reuse state model patterns (`nodes`, `edges`, `manual offsets`, selection, context menus).

## Extension Hooks for Production
- Add history stack for undo/redo
- Add snap guides for drag
- Add pluggable collision engine (sweep-line / quadtree)
- Add keyboard shortcuts and multi-select
- Add SVG export with transform normalization
