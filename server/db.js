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
    packCheck: (uid) => conn.query(`SELECT last_pack FROM USERS
                                    WHERE ID = ${uid}`),
    access: (user) => conn.query(`SELECT * FROM USERS
                                  WHERE (username = '${user.access}' OR phone = '${user.access}'
                                      AND pass_hash = '${user.pass_hash}')`),
    check: (user) => conn.query(`SELECT * FROM USERS
                                 WHERE username = '${user.username}'
                                 OR phone = '${user.phone}'`)
        .then((result) => result.length === 0 ? true : false),
    create: (user) => conn.query(`INSERT INTO users
                                 (username, pass_hash, phone)
                                 VALUES ('${user.username}', '${user.pass_hash}', '${user.phone}')`),
  }
};

module.exports = functions;