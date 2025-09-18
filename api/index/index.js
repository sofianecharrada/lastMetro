const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'postgres-db',
  database: 'mon-projet-db',
  password: 'mypassword',
  port: 5432,
});
module.exports = pool;
