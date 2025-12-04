const { Pool } = require('pg');
require('dotenv').config();

const DATABASE_URL = 'postgresql://neondb_owner:npg_CJBbUaI6i4NS@ep-solitary-dew-ah45qlvy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
process.env.DATABASE_URL = process.env.DATABASE_URL || DATABASE_URL;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for most Vercel/Neon connections
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};