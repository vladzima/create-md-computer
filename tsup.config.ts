import { defineConfig } from "tsup";

export default defineConfig({
  entry: { cli: "src/cli.ts" },
  format: ["esm"],
  clean: true,
  sourcemap: true,
  // We don't ship type declarations from a CLI binary.
  dts: false,
});
