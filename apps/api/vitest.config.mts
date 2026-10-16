import shared from "@technology-ecommerce/config-testing/vitest";
import { defineConfig, mergeConfig } from "vitest/config";

// The guard keeps integration suites away from non-local databases (see test/setup).
export default mergeConfig(shared, defineConfig({
  test: { setupFiles: ["./test/setup/database-guard.ts"] },
}));
