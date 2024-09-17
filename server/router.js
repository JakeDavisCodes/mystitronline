const router = require('express').Router();
const controler = require('./controler.js');

router.get('/access', (req, res) => {
  const json = {
    access: 'granted'
  };
  res.status(200).json(json);
});

module.exports = router;