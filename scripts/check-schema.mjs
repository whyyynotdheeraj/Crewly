import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const [key, ...val] = line.split('=');
  if (key && val.length) {
    let v = val.join('=').trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[key.trim()] = v;
  }
}

const sql = neon(process.env.DATABASE_URL);

// Check table structure
const cols = await sql`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'upcoming_events' 
  ORDER BY ordinal_position
`;
console.log('📊 upcoming_events table columns:');
cols.forEach(c => console.log(`  - ${c.column_name} (${c.data_type})`));
