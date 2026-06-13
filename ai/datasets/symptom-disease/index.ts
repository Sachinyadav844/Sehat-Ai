import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

// ES Module mein __dirname nikalne ka naya aur sahi tarika
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folders ka rasta (path) set kar rahe hain
const rawDataPath = path.join(__dirname, 'raw-data');
const processedDataPath = path.join(__dirname, 'processed-data');

// Agar processed-data folder nahi hai, toh yeh code khud bana dega
if (!fs.existsSync(processedDataPath)) {
  fs.mkdirSync(processedDataPath, { recursive: true });
}

// CSV process karne ka function
function processCSV(fileName: string) {
  const filePath = path.join(rawDataPath, fileName);
  const processedData: any[] = [];
  
  console.log(`Processing file: ${fileName} ... please wait.`);
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // CSV mein disease column ka naam alag-alag ho sakta hai
      const disease = row['Disease'] || row['label'] || row['disease_name'] || row['prognosis'] || 'Unknown Disease';
      
      // Baki bache columns se symptoms nikalna aur clean karna
      const symptoms = Object.values(row)
        .filter(val => val && typeof val === 'string' && val.trim() !== '' && val !== disease)
        .map((val: any) => val.trim().replace(/_/g, ' ')); 

      // RAG-Friendly JSON Format
      if (symptoms.length > 0 && disease !== 'Unknown Disease') {
         processedData.push({
           disease: disease,
           symptoms: symptoms,
           rag_context: `A patient suffering from ${disease} typically presents with the following symptoms: ${symptoms.join(', ')}.`
         });
      }
    })
    .on('end', () => {
      // File poori padhne ke baad JSON mein save karna
      const outputFileName = fileName.replace('.csv', '_processed.json');
      const outputPath = path.join(processedDataPath, outputFileName);
      
      fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
      console.log(`✅ Success! Cleaned Data saved to: ${outputFileName}`);
      console.log(`Total records converted: ${processedData.length}\n`);
    });
}

// raw-data folder mein jitni bhi CSV hain, sabko ek-ek karke process karo
fs.readdirSync(rawDataPath).forEach(file => {
  if (file.endsWith('.csv')) {
    processCSV(file);
  }
});