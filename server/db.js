const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASS,
     connectionLimit: 1
});

const { datetime } = require('./funcs.js');

var conn;

pool.getConnection()
     .then((connection) => {
          conn = connection
          console.log('connection made')
          connection.query('USE mystitronline')
     })

const functions = {
  test: () => conn.query('SELECT * FROM USERS'),
  pack: {
    check: (uid) => conn.query(`SELECT last_pack FROM USERS
                                WHERE ID = ${uid}`),
    create: (uid) => {
      let cardIds = [];
      return conn.query(`SELECT ID FROM CARDS
                                 WHERE userId IS null
                                 AND packId IS null
                                 ORDER BY RAND()
                                 LIMIT 6`)
              .then((results) => {
                if (results.length !== 6) throw new Error('Not enough cards available')
                cardIds = results.map((i) => i.ID)
                console.log(cardIds);

                return conn.query(`INSERT INTO packs
                                  (userId, card1, card2, card3, card4, card5, card6)
                                  VALUES
                                  (${uid}, ${results[0].ID}, ${results[1].ID}, ${results[2].ID}, ${results[3].ID}, ${results[4].ID}, ${results[5].ID})`)
                        .then((insertResult) => {
                          cardIds.forEach((id) => conn.query(`UPDATE cards
                                                              SET packId = ${Number(insertResult.insertId)}
                                                              WHERE ID = ${id}`))
                        })
                        .then(() => conn.query(`UPDATE users
                                                SET last_pack = '${datetime(Date.now())}'
                                                WHERE ID = ${uid}`))
              })
    },
  },
  user: {
    auth: (uid, pass) => conn.query(`SELECT * FROM USERS
                                     WHERE ID = ${uid}
                                     AND pass_hash = ${pass}`)
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