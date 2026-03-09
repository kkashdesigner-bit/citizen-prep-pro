const xlsx = require('xlsx');

const workbook = xlsx.readFile(process.argv[2]);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

console.log("Columns:", data[0]);
console.log("First Row:", data[1]);
