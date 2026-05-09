# {{name}}

Vite + React + Tailwind v4 + shadcn/ui scaffolded with [md-computer](https://github.com/vladzima/md-computer).

## Develop

```bash
pnpm dev
```

The first dev run will install any shadcn primitives the demo page references (Card, Button, Input, etc.) into `src/components/ui/`.

## How it's wired

- `src/pages/settings/page.md` — the page, written as a structured Markdown spec
- `src/pages/settings/page.actions.ts` — typed `Bindings` + action handlers for the page
- `src/App.tsx` — imports `page.md` like any React component and renders it

Edit `page.md` and the browser reloads with the change.

To add another page:

1. Create `src/pages/<name>/page.md`
2. Create `src/pages/<name>/page.actions.ts` (the dev server will tell you what's expected)
3. Import it where you need it: `import MyPage from "@/pages/<name>/page.md"`

## Build

```bash
pnpm build      # type-check then production build
pnpm preview    # serve the production build locally
```

## Learn more

- [md-computer docs](https://github.com/vladzima/md-computer)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind v4](https://tailwindcss.com)
