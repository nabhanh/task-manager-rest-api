import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const sql = postgres(
  `postgresql://postgres:${process.env.DB_PASSWORD}@db.sjwzstsdjljsutokwbio.supabase.co:5432/postgres`,
  { max: 1 }
);
const db = drizzle(sql);

await migrate(db, { migrationsFolder: 'drizzle' });
