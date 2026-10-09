import type { Config } from "drizzle-kit";
import { config } from "dotenv";
config({"path":'.env.local'})

export default {
  schema: "./app/db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;