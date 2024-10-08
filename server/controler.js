const db = require('./db.js');
const { datetime, error } = require('./funcs.js');

const functions = {
  test: (req, res) =>{
    db.test()
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error))
  },
  user: {
    create: (req, res) =>{
      const { username, pass_hash, phone } = req.body
      const user = {
        username,
        pass_hash,
        phone
      };
      console.log(user);
      if (username === undefined ||
          pass_hash === undefined ||
          phone === undefined) {
            res.status(400).json({error : 'Username, Password, and Phone required'});
            return;
          }

      db.user.check(user)
        .then((result) => {
          if (result) {
            db.user.create(user)
              .then(() => res.sendStatus(201))
              .catch((error) => res.status(500).json(error))
          } else {
            res.status(409).json({error: 'Username or Phone number already in use!'});
          }
      })
    },
    access: (req, res) =>{
      const user = {
        access: req.body.access,
        pass_hash: req.body.pass_hash
      };

      db.user.access(user)
        .then((result) => result.length > 0 ? res.status(201).json(result[0]) : res.status(401).json({error: "Username, Phone, or Password are incorrect"}))
        .catch((error) => res.status(500).json)
    }
  },
  pack: {
    get: (req, res) =>{
      const { uid, pass } = req.body;
      if (uid === undefined || pass === undefined) { res.status(400).json({error: "missing info"}); return }

      db.user.auth(uid, pass) // ENSURE USER AUTH
        .then((results) => results.length > 0
          ? db.pack.check(uid) // CHECK PACK STATUS
            .then((result) => {
              if (result.length !== 1) throw new Error('somethin wrong here')
              Date.now() - result[0].last_pack > 79200 // IF THEY ARE READY
                ? db.pack.prune(uid).then(db.pack.create(uid).then(() => res.sendStatus(200))) // CREATE A NEW PACK
                : res.status(401).json({error: "Please Wait", time: Date.now() - new Date(result[0]. last_pack).getTime() + 79200000}) // OR TELL THEM TO WAIT
            })
          : res.sendStatus(401))
        // .catch((err) => res.status(500).json({error:err}))
    },
  },
  set: {
    complete: (req, res) => {
      const { uid, pass, sid } = req.body;

      db.user.auth(uid, pass) // ENSURE USER AUTH
        .then((results) => results.length > 0
          ? db.set.check(uid, sid)
              .then((result) => {
                const cardCount = Number(result[0].cardCount)
                console.log('set.complete.cardCount ', cardCount)

                cardCount === 9
                  ? db.set.claim(uid, sid)
                      .then(() => res.sendStatus(200))
                  : res.status(400).json({error: 'Could not complete set'})
                    return;
              })
              .catch((error) => res.status(500).json({error: error}))
          : res.sendStatus(401)) // END FOR UNAUTH
    }
  },
  card: {
    claim: (req, res) => {
      const { uid, pass, cid } = req.body;

      db.user.auth(uid, pass)
        .then((auth) => auth.length === 1
          ? db.card.count(uid)
            .then((results) => {
              if (results.length >= 9) { res.status(401).json({error: "you have too many cards"}); return;}
              db.card.claim(uid, cid)
              .then((results) => {
                if (results.affectedRows === 0) {
                  error.cardNotFound('error', res)
                  return;
                }
                res.sendStatus(200)
              })})
            .catch((err) => error.cardNotFound(err, res))
          : res.status(401).json({error: 'no auth'}))
    },
    unClaim: (req, res) => {
      const { uid, pass, cid } = req.body;
      db.user.auth(uid, pass) // ENSURE USER AUTH
        .then((results) => results.length > 0
          ? db.card.unClaim(uid, cid) // ACTION TO RUN
            .then((result) => {
              result.affectedRows === 0
                ? res.status(400).json({error: 'no card found'})
                : res.sendStatus(200)
            })
            .catch(() => res.sendStatus(500))
          : res.sendStatus(401)) // END FOR UNAUTH
    }
  },

  AUTHEX: () => {
    const { uid, pass } = req.body;
      db.user.auth(uid, pass) // ENSURE USER AUTH
        .then((results) => results.length > 0
          ? foo(bar) // ACTION TO RUN
          : res.sendStatus(401)) // END FOR UNAUTH
  }

};

module.exports = functions;