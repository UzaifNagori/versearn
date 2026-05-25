import mysql from 'mysql2/promise';

// Connection pool — ek baar banao, baar baar use karo
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'versearn',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
});

// Query helper — use karo: await query('SELECT * FROM users WHERE id = ?', [id])
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Single row helper
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

// Transaction helper
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
