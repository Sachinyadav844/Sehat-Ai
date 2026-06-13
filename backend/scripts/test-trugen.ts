import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env from multiple possible locations
const envCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(process.cwd(), '../../../.env'),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));
if (envPath) {
  console.log(`[INFO] Loading .env from: ${envPath}\n`);
  dotenv.config({ path: envPath });
} else {
  console.warn('[WARN] No .env file found. Using process.env.\n');
}

const TRUGEN_API_KEY = process.env.TRUGEN_API_KEY?.trim();
const TRUGEN_BASE_URL = (process.env.TRUGEN_BASE_URL?.trim() || 'https://api.trugen.ai/v1').replace(/\/+$/, '');

if (!TRUGEN_API_KEY) {
  console.error('[ERROR] TRUGEN_API_KEY is not set in environment');
  process.exit(1);
}

console.log(`[CONFIG]`);
console.log(`  API Key: ${TRUGEN_API_KEY.substring(0, 10)}...${TRUGEN_API_KEY.substring(TRUGEN_API_KEY.length - 5)}`);
console.log(`  Base URL: ${TRUGEN_BASE_URL}\n`);

const client = axios.create({
  baseURL: TRUGEN_BASE_URL,
  headers: {
    Authorization: TRUGEN_API_KEY,
    'x-api-key': TRUGEN_API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

async function testEndpoint(method: string, path: string) {
  try {
    console.log(`\n[TEST] ${method} ${path}`);
    const response = await (method === 'GET' ? client.get(path) : client.post(path, {}));
    console.log(`[SUCCESS] Status: ${response.status}`);
    console.log(`[RESPONSE]`);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(`[ERROR] Status: ${error.response?.status || 'unknown'}`);
      console.log(`[RESPONSE]`);
      console.log(JSON.stringify(error.response?.data || error.message, null, 2));
    } else {
      console.log(`[ERROR] ${error}`);
    }
  }
}

async function main() {
  console.log(`=== TruGen API Diagnostic ===\n`);

  // Test common endpoints
  const endpoints = [
    { method: 'GET', path: '/avatars' },
    { method: 'GET', path: '/agents' },
    { method: 'GET', path: '/models' },
    { method: 'GET', path: '/v1/avatars' },
    { method: 'GET', path: '/v1/agents' },
    { method: 'GET', path: '/v1/models' },
    { method: 'GET', path: '/' },
    { method: 'GET', path: '/health' },
  ];

  for (const { method, path: p } of endpoints) {
    await testEndpoint(method, p);
  }

  console.log(`\n=== Test Complete ===\n`);
}

main().catch(console.error);
