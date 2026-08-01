import { defineConfig } from "tsdown";
import type { UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  entry: [
    "index.ts",
    { middleware: "src/middleware/index.ts" },
    { toolbar: "src/toolbar/index.ts" }
  ],
  deps: {
    neverBundle: true
  },
  publint: true,
  exports: true
});

export default config;
