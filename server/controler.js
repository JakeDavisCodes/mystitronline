const db = require('./db.js');
const { datetime } = require('./funcs.js');

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
      const uid = req.body.id;

      db.pack.check(uid)
        .then((result) => {
          if (result.length !== 1) throw new Error('somethin wrong here')
          Date.now() - result[0].last_pack > 79200
            ? db.pack.create(uid).then(() => res.sendStatus(200))
            : res.status(401).json({error: "Please Wait", time: Date.now() - new Date(result[0].last_pack).getTime() + 79200000})
        })
        .catch((err) => res.status(500).json({error:err}))
    },
  },
  set: {
    complete: (req, res) => {

    }
  }
};

module.exports = functions;