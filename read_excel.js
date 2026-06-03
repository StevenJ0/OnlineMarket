const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('Kelompok05_Tugas Uji Perangkat Lunak.xlsx');
const sheetName = workbook.SheetNames.find(name => name.includes('Deskripsi dan Hasil Uji') || name.includes('Deskripsi'));

let data;
if (sheetName) {
  const sheet = workbook.Sheets[sheetName];
  data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
} else {
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
}
fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
console.log('Done writing to output.json');
