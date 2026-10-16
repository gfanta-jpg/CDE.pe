import process from "node:process";

import "dotenv/config";

import { parseAdminBootstrapEnvironment, runAdminBootstrap } from "./admin-bootstrap.js";

/** Allowlisted logs only: never serialize environment, credentials or error details. */
async function main(): Promise<0 | 1> {
  try {
    const result = await runAdminBootstrap(parseAdminBootstrapEnvironment(process.env));
    console.info(JSON.stringify({ event: "database.admin_bootstrap.completed", level: "info", created: result.created }));
    return 0;
  } catch (error: unknown) {
    console.error(JSON.stringify({
      event: "database.admin_bootstrap.failed", level: "error",
      errorType: error instanceof Error ? error.name : "UnknownError",
      errorCode: (error as { code?: unknown } | null)?.code ?? null,
    }));
    return 1;
  }
}

void main().then((exitCode) => {
  process.exitCode = exitCode;
});
