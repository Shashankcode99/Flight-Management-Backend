const { Pool } = require('pg');

// Create a new pool
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "admin",
    port: 5432
});

// Export the pool for use in other files
module.exports = pool;