# Codebase Guidelines

## Architecture Pattern: Server Page -> Client Screen

To ensure separation of concerns and leverage Next.js App Router effectively:

1.  **Pages (`page.tsx`)**:
    - Must be **Server Components** by default.
    - Role: Fetch data, access headers/cookies, validate parameters, and structure metadata.
    - Logic: Minimal. Delegates UI and interaction to a "Screen" component.
    - Path: `src/app/[route]/page.tsx`

2.  **Screens (`*Screen.tsx`)**:
    - Must be **Client Components** (`"use client"`).
    - Role: Handle UI state, interactivity, hooks (useState, useEffect), and browser-only logic.
    - Path: `src/components/screens/[Feature]Screen.tsx`

### Example

**Page (Server):**

```tsx
// src/app/game/page.tsx
import { GameScreen } from '@/components/screens/game/game-screen.tsx'

export default function GamePage() {
  // Server-side logic (e.g., auth check, initial data fetch)
  const initialData = fetchGameData()

  return <GameScreen initialData={initialData} />
}
```

**Screen (Client):**

## Component Reuse Guidelines

- **Reuse Existing Components:** Check `src/components/common` (e.g., `Header`, `Footer`, `GameContainer`) before building new UI.
- **Do Not Duplicate:** If a component exists (like a global Header), use it instead of hardcoding similar HTML.

## Naming Conventions

- **File Names:** MUST be **all lowercase** (kebab-case recommended for multi-word, e.g., `game-screen.tsx`, `user-profile.tsx`).
- **Component Names:** PascalCase (e.g., `GameScreen`).
- **Folder Names:** lowercase (kebab-case).
