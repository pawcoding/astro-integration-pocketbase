import { defineConfig } from "tsdown";
import type { UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  entry: [
    "index.ts",
    { middleware: "src/middleware/index.ts" },
    { toolbar: "src/toolbar/index.ts" }
  ],
  dts: {
    sourcemap: true
  },
  deps: {
    skipNodeModulesBundle: true
  },
  publint: true,
  exports: true
});

export default config;
