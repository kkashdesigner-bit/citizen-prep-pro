const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://jblhxpzqbbarpqstcbvq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGh4cHpxYmJhcnBxc3RjYnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMxMDIsImV4cCI6MjA4NjE0OTEwMn0.vrHjiLjI67zsTGzSooqkREEVrzUAC353iuI0nA-zrH8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const files = [
  { file: 'public/questions_fr en-US.xlsx', lang: 'en' },
  { file: 'public/questions_fr es-ES.xlsx', lang: 'es' },
  { file: 'public/questions_fr pt-PT.xlsx', lang: 'pt' },
  { file: 'public/questions_fr zh-Hans.xlsx', lang: 'zh' },
  { file: 'public/questions_fr ar.xlsx', lang: 'ar' },
  { file: 'public/questions_fr tr.xlsx', lang: 'tr' }
];

async function main() {
  console.log("Loading valid question IDs from valid_ids.json...");
  const validQ = JSON.parse(fs.readFileSync('valid_ids.json', 'utf8'));
  const validIds = new Set(validQ);
  console.log(`Found ${validIds.size} valid questions in valid_ids.json.`);

  for (const { file, lang } of files) {
    if (!fs.existsSync(file)) {
      console.warn(`File not found: ${file}`);
      continue;
    }
    
    console.log(`Processing ${lang} from ${file}...`);
    const workbook = xlsx.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    const records = data.map(row => ({
      question_id: row.id,
      language: lang,
      question_text: row.question_text || null,
      option_a: row.option_a || null,
      option_b: row.option_b || null,
      option_c: row.option_c || null,
      option_d: row.option_d || null,
      explanation: row.explanation || null
    })).filter(r => r.question_id && validIds.has(r.question_id)); // ensure valid ID

    console.log(`Prepared ${records.length} records for ${lang}. Starting insert...`);
    
    // Insert in batches of 500
    const BATCH_SIZE = 500;
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const { data: res, error } = await supabase
        .from('question_translations')
        .upsert(batch, { onConflict: 'question_id,language' })
        .select('id');
        
      if (error) {
        console.error(`Error inserting batch for ${lang}:`, error.message);
      } else {
        console.log(`Inserted batch ${i} to ${i + batch.length} for ${lang}`);
      }
    }
  }
  console.log("Finished importing all translations!");
}

main().catch(console.error);
