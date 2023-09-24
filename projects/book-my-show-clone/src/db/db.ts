import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv';
import * as schema from './schema';

const sql = postgres(
  `postgresql://postgres:QaZlJBsljHNG57WH@db.sjwzstsdjljsutokwbio.supabase.co:5432/postgres`,
  { max: 1 }
);
const db = drizzle(sql, { schema });
export default db;
