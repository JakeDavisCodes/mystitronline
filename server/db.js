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

const functions = {
  test: () => conn.query('SELECT * FROM USERS'),
  user: {
    check: (user) => {
      conn.query(`SELECT * FROM USERS
                  WHERE username = '${user.username}'
                  OR phone = ${user.phone}`)
        .then((result) => results.length === 0 ? true : false)
    },
    create: (user) => {

    },
  }
};

module.exports = functions;