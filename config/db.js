const { Pool } = require('pg');
require('dotenv').config(); // Essential to pull your password from the .env file

// 1. Create the single, unified database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE, // Ensure this matches your local DB name
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// 2. A quick verification script that fires automatically on server startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL Database Connection Failed:', err.message);
  } else {
    console.log('✅ PostgreSQL Connected Successfully at:', res.rows[0].now);
  }
});

// 3. 🌟 THE CRUCIAL LINE: Export the raw pool instance directly!
// Do NOT use curly braces here. This ensures pool.query() works in your routes.
module.exports = pool; 
