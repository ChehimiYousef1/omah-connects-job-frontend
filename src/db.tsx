import * as sql from 'mssql';
import * as sqlPkg from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sqlPkg.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true',
    enableArithAbort: true,
    instanceName: process.env.DB_INSTANCE || undefined,
  },
  port: Number(process.env.DB_PORT) || 1433,
};

/**
 * Execute a SQL query with optional parameters
 */
export async function query(queryString: string, params?: Record<string, any>) {
  let pool: sql.ConnectionPool | null = null;
  try {
    pool = await sql.connect(config);
    const request = pool.request();

    if (params) {
      for (const key in params) {
        request.input(key, params[key]);
      }
    }

    const result = await request.query(queryString);
    return result.recordset;
  } catch (err) {
    console.error('❌ SQL Query Error:', err);
    throw err;
  } finally {
    if (pool) await pool.close();
  }
}

/**
 * Test the database connection
 */
export async function testConnection() {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server!');
    await pool.close();
  } catch (err) {
    console.error('❌ SQL Connection Error:', err);
  }
}
