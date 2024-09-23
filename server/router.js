const router = require('express').Router();
const controler = require('./controler.js');

router.get('/test', controler.test);

// User Routes
router.post('/user/create', controler.user.create)
router.get('/user/access', controler.user.access)
router.get('/pack', controler.pack.get)

module.exports = router;