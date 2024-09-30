const router = require('express').Router();
const controler = require('./controler.js');

router.get('/test', controler.test);

// User Routes
router.post('/user/create', controler.user.create)
router.get('/user/access', controler.user.access)
router.get('/pack', controler.pack.get)
router.put('/card/claim', controler.card.claim)
router.put('/card/unclaim', controler.card.unClaim)
// router.put('/set/complete', controler.set.complete)

module.exports = router;