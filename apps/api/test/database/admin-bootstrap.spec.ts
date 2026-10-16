import { describe, expect, it } from "vitest";

import { parseAdminBootstrapEnvironment } from "../../src/database/seed/admin-bootstrap.js";

// Test-only credentials, never connected to a real database.
const environment = {
  NODE_ENV: "development",
  DATABASE_URL: "postgresql://test:TestDatabasePassword@localhost/isolated_admin_test",
  SEED_ADMIN_EMAIL: " Admin@Example.invalid ",
  SEED_ADMIN_PASSWORD: "TestOnlyAdminPassword123!",
};

describe("admin-only bootstrap configuration", () => {
  it("normalizes the email, defaults TLS verification and needs no other seed accounts", () => {
    const options = parseAdminBootstrapEnvironment(environment);
    expect(options.email).toBe("admin@example.invalid");
    expect(options.tlsVerifyServer).toBe("true");
    expect(parseAdminBootstrapEnvironment({ ...environment, DATABASE_TLS_VERIFY_SERVER: "false" }).tlsVerifyServer).toBe("false");
  });

  it.each([undefined, "", "production", "staging"])("rejects NODE_ENV=%s", (NODE_ENV) => {
    expect(() => parseAdminBootstrapEnvironment({ ...environment, NODE_ENV })).toThrow();
  });

  it("rejects short passwords, invalid emails and non-PostgreSQL URLs", () => {
    expect(() => parseAdminBootstrapEnvironment({ ...environment, SEED_ADMIN_PASSWORD: "short" })).toThrow();
    expect(() => parseAdminBootstrapEnvironment({ ...environment, SEED_ADMIN_EMAIL: "not-an-email" })).toThrow();
    expect(() => parseAdminBootstrapEnvironment({ ...environment, DATABASE_URL: "mysql://x@localhost/db" })).toThrow();
  });
});
