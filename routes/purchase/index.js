const express = require('express');
const router = express.Router();

const controller = require('./index.controller');

router.get('/',controller.getPurchaseHome)
router.post('/creator',controller.postCreator)

router.get('/creator/success',controller.creatorSuccess)
router.get('/creator/cancel',(req, res)=>{
    res.redirect('/purchase')
})

router.post('/sub',controller.postSub)

router.get('/sub/success',controller.subSuccess)
router.get('/sub/cancel',(req, res)=>{
    res.redirect('/purchase')
})

router.get('/cancel', controller.getCancelSubscription)

router.get('/data', controller.getData)
module.exports = router;