import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { getEnvVar } from './utils';


const pool = new Pool({ connectionString: getEnvVar('DATABASE_URL') })
export const db = drizzle(pool)

