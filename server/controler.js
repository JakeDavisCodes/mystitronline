const db = require('./db.js');

const functions = {
  test: (req, res) =>{
    db.test()
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error))
  },
  user: {
    create: (req, res) =>{
      const { username, passHash, phone } = req.body
      const user = {
        username,
        passHash,
        phone
      };


    }
  },
};

module.exports = functions;