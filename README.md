# create-md-computer

Scaffold a Vite + React + Tailwind v4 + shadcn/ui project pre-wired for [md-computer](https://github.com/vladzima/md-computer).

```bash
npm create md-computer@latest my-app
# or: pnpm create md-computer my-app
# or: bun create md-computer my-app
# or: yarn create md-computer my-app
```

You'll be asked for a project name (if not passed) and a package manager. The scaffolder copies the template, installs deps, and inits a git repo.

```bash
cd my-app
pnpm dev
```

The first dev run installs whatever shadcn primitives the demo `.md` page references (Card, Button, Input, etc.) into `src/components/ui/`. After that, edit `src/pages/settings/page.md` and the page hot-reloads.

## What's in the box

- **Vite 7** + **React 19** + **TypeScript 5** with strict config
- **Tailwind v4** via `@tailwindcss/vite` (no PostCSS config needed)
- **shadcn/ui** initialized (`components.json`, `src/lib/utils.ts`, CSS variables) — primitives JIT-installed by md-computer
- **md-computer** + its Vite plugin wired into `vite.config.ts`
- An `@/*` path alias (TS + Vite both)
- An example settings page in `src/pages/settings/page.md` with working actions

## Flags

```bash
create-md-computer my-app --pm pnpm                  # skip the package-manager prompt
create-md-computer my-app --no-install               # skip dep install
create-md-computer my-app --no-git                   # skip git init + initial commit
create-md-computer my-app --preset <id>              # apply a shadcn theme preset
```

## Theming

The default scaffold ships with shadcn's `neutral` / `new-york` defaults. To use a custom theme:

1. Pick colors / radius / font on https://ui.shadcn.com
2. Copy the preset ID out of the install command shadcn shows you (the `--preset` value)
3. Pass it to the scaffolder:

```bash
npm create md-computer@latest my-app -- --preset bdzH1zUBM
```

After your base scaffold installs, `npx shadcn@latest init --preset <id> --template vite --yes --force` runs in the target dir. shadcn overwrites `components.json`, `src/index.css`, and `src/lib/utils.ts` with the preset's theme. You can re-run that command later if you want to switch presets.

## License

MIT
