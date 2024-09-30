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
  pack: {
    check: (uid) => conn.query(`SELECT last_pack FROM USERS
                                WHERE ID = ?`,
                                [uid]),
    prune: (uid) => conn.query(`SELECT * FROM packs
                                WHERE userId = ?`,
                                [uid])
                      .then((results) => results.forEach((i) => conn.query(`UPDATE cards
                                                                            SET packId = null
                                                                            WHERE ID IN (?, ?, ?, ?, ?, ?)`, [i.card1, i.card2, i.card3, i.card4, i.card5, i.card6])
                                                                    .then(() => conn.query(`DELETE FROM packs
                                                                                            WHERE ID = ?`,
                                                                                            [i.ID])))),
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
                cardIds.unshift(uid)
                console.log('UID and CardIDS', cardIds);

                return conn.query(`INSERT INTO packs
                                  (userId, card1, card2, card3, card4, card5, card6)
                                  VALUES
                                  (?, ?, ?, ?, ?, ?, ?)`,
                                  cardIds)
                        .then((insertResult) => {
                          const packID = Number(insertResult.insertId)

                          cardIds.forEach((id) => conn.query(`UPDATE cards
                                                              SET packId = ?
                                                              WHERE ID = ?`,
                                                              [packID, id]))
                        })
                        .then(() => conn.query(`UPDATE users
                                                SET last_pack = '${datetime(Date.now())}'
                                                WHERE ID = ?`,
                                                [uid]))
              })
    },
  },
  user: {
    auth: (uid, pass) => conn.query(`SELECT * FROM USERS
                                     WHERE ID = ?
                                     AND pass_hash = ?`,
                                     [uid, pass]),
    access: (user) => conn.query(`SELECT * FROM USERS
                                  WHERE (username = '?' OR phone = '?'
                                      AND pass_hash = '?')`,
                                      [user.access, user.access, user.pass_hash]),
    check: (user) => conn.query(`SELECT * FROM USERS
                                 WHERE username = '?'
                                 OR phone = '?'`,
                                 [user.username, user.phone])
        .then((result) => result.length === 0 ? true : false),
    create: (user) => conn.query(`INSERT INTO users
                                 (username, pass_hash, phone)
                                 VALUES ('?', '?', '?')`,
                                 [user.username, user.pass_hash, user.phone]),
  },
  card: {
    count: (uid) => conn.query(`SELECT * FROM cards
                                WHERE userId = ?`
                                , [uid]),
    claim: (uid, cid) => conn.query(`UPDATE cards c
                                     JOIN packs p ON c.packId = p.ID
                                     SET c.packId = null, c.userId = ?
                                     WHERE c.ID = ?
                                     and p.userId = ?`,
                                     [uid, cid, uid]),
    unClaim: (uid, cid) => conn.query(`UPDATE cards
                                       SET userId = null
                                       WHERE userId = ?
                                       AND ID = ?`,
                                       [uid, cid])

  },
  set: {
    check: (uid) => conn.query(`SELECT COUNT(DISTINCT num) AS cardCount
                                FROM cards
                                WHERE userId = 1
                                AND setId = 1
                                AND num BETWEEN 1 AND 9`),
    /*
      So this above is actually pretty cool Jake! Using 'COUNT() AS x
      after SELECT alows you to count different things, typically this
      might just return the number of items, but by using DISTINCT, we
      can count the number of DISTINCT or unique columns!
    */
    claim: (uid) => conn.query(``)
  }
};

module.exports = functions;