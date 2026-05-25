import mysql from 'mysql2/promise';

// MYSQL_PUBLIC_URL use karo agar available ho (Vercel + Railway)
// Otherwise fallback to individual vars
let pool;

if (process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL) {
  // Use connection URL directly
  const url = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;
  pool = mysql.createPool({
    uri: url,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00',
  });
} else {
  pool = mysql.createPool({
    host:     process.env.MYSQLHOST     || process.env.MYSQL_HOST     || process.env.DB_HOST     || '127.0.0.1',
    port:     parseInt(process.env.MYSQLPORT     || process.env.MYSQL_PORT     || process.env.DB_PORT     || '3306'),
    database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME     || 'versearn',
    user:     process.env.MYSQLUSER     || process.env.MYSQL_USER     || process.env.DB_USER     || 'root',
    password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00',
  });
}

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

export async function withTransaction(callback) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export default pool;
