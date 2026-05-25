import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'autorack.proxy.rlwy.net',
  port: 20072,
  user: 'root',
  password: 'jfiQsfCqSFdySxjeuDezuCNDmJNUMYch',
  database: 'railway',
});

const [tables] = await conn.query('SHOW TABLES;');
console.log('Tables in Railway database:');
tables.forEach(t => console.log(' ✅', Object.values(t)[0]));
await conn.end();
