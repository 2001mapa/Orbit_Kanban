import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// We need the postgres connection string. Supabase URL is REST.
// But we can construct it if we know the DB password. The user didn't give it.
// Oh wait, I don't have the PostgreSQL password!
