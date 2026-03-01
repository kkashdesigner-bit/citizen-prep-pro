import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

async function runMigration() {
    const migrationSQL = `
-- Drop the old category constraint
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_category_check;

-- Add the new exact 5 category strings
ALTER TABLE public.questions ADD CONSTRAINT questions_category_check 
  CHECK (category IN (
    'Principles and values of the Republic', 
    'Institutional and political system', 
    'Rights and duties', 
    'History, geography and culture', 
    'Living in French society'
  ));

-- Delete existing questions since they don't conform to the new constraint
DELETE FROM public.questions;
`;

    // Format date dynamically: YYYYMMDDHHmmss
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

    const uuid = crypto.randomUUID();

    const migrationParams = `${timestamp}_${uuid}.sql`;
    const migrationsPath = path.join(process.cwd(), 'supabase', 'migrations', migrationParams);

    fs.writeFileSync(migrationsPath, migrationSQL);
    console.log(`Created migration file: ${migrationsPath}`);
}

runMigration();
