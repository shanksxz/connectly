import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getEnvVar } from "./utils";

export const client = postgres(getEnvVar("DATABASE_URL"));
export const db = drizzle(client, { schema, logger: true });
