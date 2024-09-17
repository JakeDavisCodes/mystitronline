const router = require('express').Router();
const controler = require('./controler.js');

router.get('/test', controler.test);

module.exports = router;