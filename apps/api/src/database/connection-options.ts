import type { PoolConfig } from "pg";

export const DATABASE_TLS_WARNING =
  "Course PostgreSQL TLS exception: traffic is encrypted but server identity is not verified";

const PEM_CERTIFICATE = /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g;

/**
 * Accepts the PEM certificate(s) of the database CA as an environment value.
 * Escaped "\n" sequences (single-line env imports) are restored. Returns the
 * normalized bundle, or undefined when no CA is configured.
 */
export function normalizeDatabaseCa(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const pem = trimmed.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  const certificates = pem.match(PEM_CERTIFICATE);
  if (!certificates?.length) {
    throw new Error("DATABASE_TLS_CA must contain at least one PEM certificate (-----BEGIN CERTIFICATE-----)");
  }
  return `${certificates.join("\n")}\n`;
}

/** One policy for runtime and migration connections; never changes global TLS. */
export function databaseConnectionOptions(
  databaseUrl: string,
  verifyServer: boolean | string = true,
  caCertificate?: string,
): Pick<PoolConfig, "connectionString" | "ssl"> {
  if (![true, false, "true", "false"].includes(verifyServer)) {
    throw new Error("DATABASE_TLS_VERIFY_SERVER must be true or false");
  }
  let url: URL;
  try { url = new URL(databaseUrl); }
  catch { throw new Error("DATABASE_URL must be a valid PostgreSQL URL"); }
  if (url.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must use the postgresql:// scheme");
  }
  const supabase = url.hostname.endsWith(".supabase.co") ||
    url.hostname.endsWith(".pooler.supabase.com");
  if (supabase && url.port === "6543") {
    throw new Error("Supabase requires a direct or session connection, not transaction pooling");
  }
  const local = ["localhost", "127.0.0.1", "[::1]", "postgres"].includes(url.hostname);
  const verify = verifyServer === true || verifyServer === "true";
  const sslMode = url.searchParams.get("sslmode");
  if (!local && sslMode === "disable") {
    throw new Error("Remote PostgreSQL connections require TLS");
  }
  const useTls = !local || !verify || (sslMode !== null && sslMode !== "disable");
  // pg parses URI SSL parameters after config: remove them so they cannot
  // silently override rejectUnauthorized or the explicit course opt-in.
  for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert", "uselibpqcompat", "ssl"]) {
    url.searchParams.delete(key);
  }
  // A configured CA (e.g. Supabase root) is trusted only for this pool, keeping
  // identity verification without NODE_EXTRA_CA_CERTS or a file on disk.
  const ca = normalizeDatabaseCa(caCertificate);
  return {
    connectionString: url.toString(),
    ssl: useTls ? { rejectUnauthorized: verify, ...(ca ? { ca } : {}) } : false,
  };
}
