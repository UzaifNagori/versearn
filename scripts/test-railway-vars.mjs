import mysql from 'mysql2/promise';

// Test with Railway's auto-generated variable names
const configs = [
  {
    name: 'MYSQL_* vars',
    host: 'autorack.proxy.rlwy.net',
    port: 20072,
    user: 'root',
    password: 'jfiQsfCqSFdySxjeuDezuCNDmJNUMYch',
    database: 'railway',
  }
];

for (const config of configs) {
  try {
    const conn = await mysql.createConnection(config);
    const [rows] = await conn.query('SHOW TABLES;');
    console.log(`✅ ${config.name} - Connected! Tables: ${rows.length}`);
    await conn.end();
  } catch (err) {
    console.log(`❌ ${config.name} - Error: ${err.message}`);
  }
}
