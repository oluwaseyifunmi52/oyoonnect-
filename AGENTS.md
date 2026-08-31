# Help/Support System Redesign Plan

## Current State Snapshot

### Files
| File | Purpose |
|------|---------|
| `src/pages/help/HelpLandingPage.tsx` | Landing: hero + category tiles + stats |
| `src/pages/help/HelpRequestsPage.tsx` | Table of requests with search/filter |
| `src/pages/help/RequestHelpPage.tsx` | Multi-step form (category → amount → details) |
| `src/pages/help/SupportRequestDetailsPage.tsx` | View single request + support button |
| `src/pages/HelpAuth.tsx` | Auth wrapper (delegates to AuthPage) |
| `src/components/help/ReportButton.tsx` | Report button + modal (bug: shows "svg" text) |
| `src/components/help/SupportAmountSelector.tsx` | Support amount selector (bug: shows "svg" text) |
| `src/components/help/VerificationBadge.tsx` | Simple verification badge |
| `src/components/help/IconMapping.tsx` | Category→icon map |
| `src/types/help.ts` | HelpCategory, HelpRequest, SupportOffer |
| `src/services/helpService.ts` | Mock data + service functions |
| `src/index.css` | All CSS inline, 15,831 lines, help styles scattered |

### Known Issues
1. **3 TypeScript errors** in `HelpRequestsPage.tsx:136-137` — union type `HelpCategory | {value,label}` breaks `.value`/`.label` access
2. **Visible "svg" text** — `ReportButton.tsx:28` and `SupportAmountSelector.tsx:11` render `{label}` where label="svg"
3. **Scattered CSS** — no dedicated help section; styles mixed with transactions, wallet, data-form, etc.
4. **No shared UI primitives** — everything is inline JSX + CSS class strings
5. **No barrel export** for help module
6. **No layout shell** — no shared header/footer/breadcrumb for the help section

## Redesign Plan

### Phase 1: Foundation (design tokens + UI primitives)

**1a. Create `src/styles/theme.css`**
- Move design tokens into a dedicated file with clear sections:
  - Spacing scale (`--space-0` through `--space-12`)
  - Colors (brand, surface, ink, muted, subtle, line, error, success, warning + soft variants)
  - Typography (font sizes, weights, line heights)
  - Border radius (`--radius`, `--radius-sm`, `--radius-full`)
  - Shadows, transitions
- Import in `main.tsx` before `index.css`

**1b. Create shared UI primitives in `src/components/ui/`:**
- `Button.tsx` — variants: primary, secondary, ghost, danger; sizes: sm, md, lg; loading state
- `Input.tsx` — text, email, number with label + error states
- `Select.tsx` — native select styled with arrow icon
- `Badge.tsx` — status badges: success, pending, error, neutral, info
- `Card.tsx` — surface container with optional padding/elevation variants
- `Skeleton.tsx` — loading placeholder bars/blocks
- `FormField.tsx` — label + field + helper text + error
- `SearchInput.tsx` — input with search icon + clear button
- `Modal.tsx` — overlay + dialog + actions

### Phase 2: Refactor Components

**2a. `SupportAmountSelector.tsx`**
- Replace inline radio buttons with `Card` + `FormField` primitives
- Remove `{label}` bug → use proper icon or amount text

**2b. `ReportButton.tsx`**
- Replace modal with `Modal` primitive
- Remove `{label}` bug → use proper label text

### Phase 3: Refactor Pages

**3a. `HelpLandingPage.tsx`**
- Use `Card`, `Button`, `Badge`, `SearchInput`, `Skeleton`
- Hero section with search
- Category tiles grid (responsive)
- Stats cards

**3b. `HelpRequestsPage.tsx`**
- Fix union type bug (normalize options to `{value,label,icon}`)
- Use `SearchInput`, `Select`, `Badge`, `Skeleton`, `Card`
- Table/grid layout responsive
- Filter pills

**3c. `RequestHelpPage.tsx`**
- Multi-step form refactored with `FormField`, `Input`, `Select`, `Card`, `Button`
- Clean step indicator

**3d. `SupportRequestDetailsPage.tsx`**
- Use `Card`, `Badge`, `Button`
- Clean layout for request details + support section

### Phase 4: Infrastructure

**4a. Create `src/pages/help/HelpLayout.tsx`**
- Shared header with nav links
- Footer
- Breadcrumb

**4b. Create `src/pages/help/helpRoutes.tsx`**
- Route config using `<Route>` with `<Outlet>` for layout

**4c. Wire into `App.tsx`**
- Replace flat routes with nested layout route

**4d. Create `src/components/help/index.ts`**
- Barrel export for all help components

**4e. Fix `types/help.ts`**
- Normalize `HelpCategory` to include `value` and `label` so union type is not needed

### Phase 5: Quality

**5a. Remove visible "svg" text artifacts**
- `ReportButton.tsx:28`
- `SupportAmountSelector.tsx:11`

**5b. Clean up `index.css`**
- Remove scattered help styles (now using component-scoped CSS modules or shared classes)

**5c. Run `tsc --noEmit` + `eslint`**
- Ensure zero errors

## Execution Order
1. theme.css
2. UI primitives (Button, Input, Select, Badge, Card, Skeleton, FormField, SearchInput, Modal)
3. Fix types/help.ts union type
4. Refactor ReportButton + SupportAmountSelector
5. Refactor all 4 help pages
6. HelpLayout + helpRoutes + App.tsx wiring
7. Barrel export + CSS cleanup
8. Typecheck + lint
