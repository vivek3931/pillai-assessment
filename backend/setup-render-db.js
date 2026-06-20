const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// We use the External Hostname so we can connect from your local computer to Render
const client = new Client({
  host: 'dpg-d8r3lvvlk1mc73bcivf0-a.oregon-postgres.render.com',
  port: 5432,
  database: 'student_management_hiyd',
  user: 'student_management_hiyd_user',
  password: 'vjospETxel29vVUIz4WAieN4AxIGZR3T',
  ssl: {
    rejectUnauthorized: false // Required for connecting to Render from outside
  }
});

async function initializeDB() {
  try {
    console.log("Connecting to Render PostgreSQL Database...");
    await client.connect();
    
    console.log("Reading init.sql file...");
    const sqlPath = path.join(__dirname, 'init.sql');
    const sqlQuery = fs.readFileSync(sqlPath, 'utf8');
    
    console.log("Executing SQL queries to create tables...");
    await client.query(sqlQuery);
    
    console.log("✅ Success! Your tables have been created on Render.");
  } catch (err) {
    console.error("❌ Error running script:", err);
  } finally {
    await client.end();
  }
}

initializeDB();
