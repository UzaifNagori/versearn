import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const conn = await mysql.createConnection({
  host: 'autorack.proxy.rlwy.net',
  port: 20072,
  user: 'root',
  password: 'jfiQsfCqSFdySxjeuDezuCNDmJNUMYch',
  database: 'railway',
  multipleStatements: true,
});

console.log('Connected to Railway MySQL!');

const sql = readFileSync(join(__dirname, '../railway_import.sql'), 'utf8');

try {
  await conn.query(sql);
  console.log('✅ All tables created successfully!');
} catch (err) {
  console.error('❌ Error:', err.message);
}

await conn.end();
