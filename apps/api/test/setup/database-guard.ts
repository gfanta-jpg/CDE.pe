import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { parse } from "dotenv";

/**
 * Integration tests create and drop databases on the server behind DATABASE_URL.
 * They must never reach the active (e.g. Supabase) database: only local hosts are
 * accepted. TEST_DATABASE_URL, when set and local, takes precedence. Any other URL
 * is replaced by an unreachable sentinel so those suites fail fast instead.
 * Only the database variables are read from .env; nothing else leaks into tests.
 */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1", "postgres"]);
const REFUSED_URL = "postgresql://refused:refused@non-local-database-refused.invalid:5432/refused";

function isLocal(value: string): boolean {
  try { return LOCAL_HOSTS.has(new URL(value).hostname); } catch { return false; }
}

const envFile = resolve(process.cwd(), ".env");
const fileValues = existsSync(envFile) ? parse(readFileSync(envFile)) : {};
const candidate = process.env.TEST_DATABASE_URL ?? fileValues.TEST_DATABASE_URL
  ?? process.env.DATABASE_URL ?? fileValues.DATABASE_URL;
if (candidate !== undefined) {
  process.env.DATABASE_URL = isLocal(candidate) ? candidate : REFUSED_URL;
}
