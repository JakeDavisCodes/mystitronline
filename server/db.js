const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASS,
     connectionLimit: 1
});

var conn;

pool.getConnection()
     .then((connection) => {
          conn = connection
          console.log('connection made')
          connection.query('USE mystitronline')
     })