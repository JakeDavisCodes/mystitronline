const db = require('./db.js');

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

      db.check(user)
        .then((result) => {
          if (result) {
            db.create(user)
              .then(() => res.sendStatus(200))
              .catch((error) => res.status(500).json(error))
          } else {
            throw new Error('Username or Phone number already in use!');
            res.sendStatus(409);
          }
      })
    }
  },
};

module.exports = functions;