import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";
// Match local Next.js configuration while preserving environment supplied by the shell.
for (const file of [".env.local", ".env"]) {
  try {
    loadEnvFile(file);
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
  }
}
export default defineConfig({
 schema: "prisma/schema.prisma",
 migrations: { path: "prisma/migrations", seed: "node --conditions=react-server --experimental-strip-types prisma/seed.ts" },
 datasource: { url: process.env.DIRECT_URL },
});
