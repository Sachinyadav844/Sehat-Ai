import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

// ES Module ke liye __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawDataPath = path.join(__dirname, 'raw-data');
const processedDataPath = path.join(__dirname, 'processed-data');

// Agar processed-data folder nahi hai, toh bana do
if (!fs.existsSync(processedDataPath)) {
  fs.mkdirSync(processedDataPath, { recursive: true });
}

function processEmergencyCSV(fileName: string) {
  const filePath = path.join(rawDataPath, fileName);
  const processedData: any[] = [];
  
  console.log(`Processing Emergency File: ${fileName} ... please wait.`);
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // Kyunki har file ke columns alag hain, hum sabko dynamically ek sentence mein jodenge
      const conditions: string[] = [];
      
      for (const [key, value] of Object.entries(row)) {
        if (value && typeof value === 'string' && value.trim() !== '') {
           // Underscores ko space mein badal rahe hain taaki RAG aasaani se padh sake
           const cleanKey = key.trim().replace(/_/g, ' ');
           conditions.push(`${cleanKey}: ${value.trim()}`);
        }
      }

      // RAG-Friendly JSON Format for Emergency Cases
      if (conditions.length > 0) {
         processedData.push({
           source_file: fileName,
           raw_data: row, // Original data bhi rakh rahe hain taaki koi value miss na ho
           rag_context: `Emergency Case Record -> ${conditions.join(', ')}.`
         });
      }
    })
    .on('end', () => {
      // Output file ko JSON mein save karna
      const outputFileName = fileName.replace('.csv', '_processed.json');
      const outputPath = path.join(processedDataPath, outputFileName);
      
      fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
      console.log(`✅ Success! Cleaned Emergency Data saved to: ${outputFileName}`);
      console.log(`Total records converted: ${processedData.length}\n`);
    });
}

// raw-data folder ki saari CSV files ko process karo
if (fs.existsSync(rawDataPath)) {
    fs.readdirSync(rawDataPath).forEach(file => {
      if (file.endsWith('.csv')) {
        processEmergencyCSV(file);
      }
    });
} else {
    console.log("❌ Error: 'raw-data' folder nahi mila!");
}