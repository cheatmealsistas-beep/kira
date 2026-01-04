import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = 'https://emhknndcgkyezmwqrzfn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtaGtubmRjZ2t5ZXptd3FyemZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcxNDgxMSwiZXhwIjoyMDgxMjkwODExfQ.XokfJebmkFQvceIeMPgQWtdsrOtnrF-heZPWXKKuMUQ';

const supabase = createClient(supabaseUrl, serviceKey);

// Get migration file path from args or use default
const migrationFile = process.argv[2] || join(__dirname, '../supabase/migrations/20260103000001_fitness_profiles.sql');
const sql = readFileSync(migrationFile, 'utf8');

console.log('Running migration...');

// Split by semicolons and execute statements one by one
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

let successCount = 0;
let errorCount = 0;

for (const statement of statements) {
  if (statement.length < 5) continue;

  try {
    // Use raw SQL via postgrest-js isn't possible directly
    // We need to use the postgres extension or dashboard
    console.log(`Statement: ${statement.substring(0, 50)}...`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
    errorCount++;
  }
}

console.log('\n⚠️  La API de Supabase no permite ejecutar DDL directamente.');
console.log('📋 Por favor, copia y pega el SQL en el SQL Editor de Supabase:');
console.log('\n   https://supabase.com/dashboard/project/emhknndcgkyezmwqrzfn/sql/new\n');
