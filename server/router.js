const router = require('express').Router();
const controler = require('./controler.js');

router.get('/test', controler.test);

// User Routes
router.post('/user/create', controler.user.create)

module.exports = router;