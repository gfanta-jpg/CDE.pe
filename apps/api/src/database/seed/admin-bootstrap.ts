import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { z } from "zod";

import { databaseConnectionOptions } from "../connection-options.js";
import { roleAssignments, users } from "../schema/index.js";
import * as schema from "../schema/index.js";
import { hashSeedPassword, seedPasswordNeedsRehash, verifySeedPassword } from "./password.js";

const ADMIN_DISPLAY_NAME = "Administrator";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test"]),
  DATABASE_URL: z.string().trim().url().startsWith("postgresql://"),
  DATABASE_TLS_VERIFY_SERVER: z.enum(["true", "false"]).default("true"),
  DATABASE_TLS_CA: z.string().optional(),
  SEED_ADMIN_EMAIL: z.string().trim().toLowerCase().max(320).pipe(z.email()),
  SEED_ADMIN_PASSWORD: z.string().min(12).max(128),
});

export type AdminBootstrapOptions = Readonly<{
  databaseUrl: string;
  tlsVerifyServer: "true" | "false";
  tlsCaCertificate?: string;
  email: string;
  password: string;
}>;

/** Only the ADMIN account: no catalog, store profile or other demo users. */
export function parseAdminBootstrapEnvironment(
  environment: Record<string, string | undefined>,
): AdminBootstrapOptions {
  if (environment.NODE_ENV === "production") {
    throw new Error("Admin bootstrap is disabled in production");
  }
  const parsed = environmentSchema.parse(environment);
  return {
    databaseUrl: parsed.DATABASE_URL,
    tlsVerifyServer: parsed.DATABASE_TLS_VERIFY_SERVER,
    tlsCaCertificate: parsed.DATABASE_TLS_CA,
    email: parsed.SEED_ADMIN_EMAIL,
    password: parsed.SEED_ADMIN_PASSWORD,
  };
}

/** Idempotent: creates or reactivates the account and keeps an unchanged password hash. */
export async function runAdminBootstrap(
  options: AdminBootstrapOptions,
): Promise<{ created: boolean }> {
  const pool = new Pool({
    ...databaseConnectionOptions(options.databaseUrl, options.tlsVerifyServer, options.tlsCaCertificate),
    application_name: "technology-ecommerce-admin-bootstrap",
    connectionTimeoutMillis: 10_000,
    max: 1,
  });
  const database = drizzle({ client: pool, schema });

  try {
    return await database.transaction(async (transaction) => {
      await transaction.execute(sql`select pg_advisory_xact_lock(2042026)`);
      const [existingUser] = await transaction
        .select({ id: users.id, passwordHash: users.passwordHash })
        .from(users)
        .where(sql`lower(${users.email}) = ${options.email}`)
        .limit(1);
      const passwordHash =
        existingUser &&
        !seedPasswordNeedsRehash(existingUser.passwordHash) &&
        (await verifySeedPassword(options.password, existingUser.passwordHash))
          ? existingUser.passwordHash
          : await hashSeedPassword(options.password);
      const values = {
        email: options.email,
        passwordHash,
        displayName: ADMIN_DISPLAY_NAME,
        status: "ACTIVE" as const,
        deletedAt: null,
        updatedAt: new Date(),
      };

      const [admin] = existingUser
        ? await transaction
            .update(users)
            .set(values)
            .where(sql`${users.id} = ${existingUser.id}`)
            .returning({ id: users.id })
        : await transaction.insert(users).values(values).returning({ id: users.id });

      if (!admin) {
        throw new Error("Could not persist the ADMIN account");
      }

      await transaction
        .insert(roleAssignments)
        .values({ userId: admin.id, role: "ADMIN", assignedByUserId: admin.id })
        .onConflictDoUpdate({
          target: roleAssignments.userId,
          set: { role: "ADMIN", assignedByUserId: admin.id, updatedAt: new Date() },
        });

      return { created: !existingUser };
    });
  } finally {
    await pool.end();
  }
}
