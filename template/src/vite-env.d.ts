/// <reference types="vite/client" />

// md-computer transforms .md imports into React components at build time.
// Each page's bindings prop is loosely typed here; for stricter typing,
// import the matching `Bindings` type from your page's sibling .actions.ts.
declare module "*.md" {
  import type { ComponentType } from "react";

  const Page: ComponentType<Record<string, unknown>>;
  export default Page;
}
