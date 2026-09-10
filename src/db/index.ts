import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  try {
    const { config } = require("dotenv");
    config({ path: ".env.local" });
  } catch (e) {
    // Ignore in environments where dotenv is not needed or bundler handles it
  }
}

const connectionString = process.env.DATABASE_URL || "";

// Supabase pooler / serverless client setup
// Disable prefetch as it is not supported for Transaction Pooler
const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
export * from "./schema";
