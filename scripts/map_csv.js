import fs from 'fs';
import path from 'path';

// Define the 5 target categories
const TARGET_CATEGORIES = [
  "Principles and values of the Republic",
  "Institutional and political system",
  "Rights and duties",
  "History, geography and culture",
  "Living in French society"
];

// Map input categories/subcategories to the target categories
// Using a heuristic mapping since there are many subcategories in the CSV
function mapCategory(categoryText) {
  const c = categoryText.toLowerCase();
  
  // History, Geography and Culture
  if (c.includes('histoire') || c.includes('géographie') || c.includes('culture') || c.includes('roi') || c.includes('guerre') || c.includes('révolution') || c.includes('période') || c.includes('moyen âge') || c.includes('personnages') || c.includes('patrimoine') || c.includes('fleuve') || c.includes('fête') || c.includes('paysage')) {
    return TARGET_CATEGORIES[3];
  }
  
  // Principles and Values
  if (c.includes('principe') || c.includes('valeur') || c.includes('devise') || c.includes('laïcité') || c.includes('symbole') || c.includes('marianne') || c.includes('drapeau') || c.includes('marseillaise') || c.includes('hymne') || c.includes('république')) {
    return TARGET_CATEGORIES[0];
  }
  
  // Institutions and System
  if (c.includes('institution') || c.includes('politique') || c.includes('système') || c.includes('président') || c.includes('assemblée') || c.includes('sénat') || c.includes('maire') || c.includes('commune') || c.includes('parlement') || c.includes('gouvernement') || c.includes('loi') || c.includes('ministre') || c.includes('démocratie') || c.includes('justice') || c.includes('voting') || c.includes('vote') || c.includes('élection')) {
    return TARGET_CATEGORIES[1];
  }
  
  // Rights and Duties
  if (c.includes('droit') || c.includes('devoir') || c.includes('impôt') || c.includes('liberté') || c.includes('égalité') || c.includes('loi') || c.includes('obligation') || c.includes('citoyen')) {
    return TARGET_CATEGORIES[2];
  }
  
  // Living in French society (fallback)
  if (c.includes('vivre') || c.includes('société') || c.includes('école') || c.includes('famille') || c.includes('travail') || c.includes('santé') || c.includes('quotidien') || c.includes('femme') || c.includes('homme')) {
    return TARGET_CATEGORIES[4];
  }
  
  // Catchall
  return TARGET_CATEGORIES[4];
}

const csvFilePath = path.join(process.cwd(), 'public', 'questions_V2.csv');
const outFilePath = path.join(process.cwd(), 'public', 'questions_mapped.csv');

try {
  const content = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  
  const catIndex = headers.indexOf('category');
  
  if (catIndex === -1) {
    console.error("Could not find 'category' header");
    process.exit(1);
  }
  
  const mappedLines = [lines[0]]; // keep headers
  let unmappedCats = new Set();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Use regex to carefully parse CSV handling quotes
    const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
    let match;
    const columns = [];
    
    let isInsideQuote = false;
    let currentColumn = '';
    
    for (let char of line) {
        if (char === '"' && (!isInsideQuote || (isInsideQuote && currentColumn[currentColumn.length-1] !== '\\'))) {
            isInsideQuote = !isInsideQuote;
            currentColumn += char;
        } else if (char === ',' && !isInsideQuote) {
            columns.push(currentColumn);
            currentColumn = '';
        } else {
            currentColumn += char;
        }
    }
    columns.push(currentColumn); // pushes the last column

    if (columns.length <= catIndex) {
        // malformed line
        mappedLines.push(line);
        continue;
    }
    
    const originalCategory = columns[catIndex].replace(/"/g, '');
    const mappedCat = mapCategory(originalCategory);
    
    columns[catIndex] = `"${mappedCat}"`;
    unmappedCats.add(originalCategory + " => " + mappedCat);
    
    mappedLines.push(columns.join(','));
  }
  
  fs.writeFileSync(outFilePath, mappedLines.join('\n'));
  console.log("SUCCESS. Created questions_mapped.csv");
  console.log("--- MAPPING SUMMARY ---");
  for (const mapping of Array.from(unmappedCats).sort()) {
      console.log(mapping);
  }

} catch (e) {
  console.error(e);
}
