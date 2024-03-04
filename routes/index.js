const express = require('express');
const router = express.Router();

const controller = require('./index.controller');
const auth = require('../middlewares/auth');

router.get('/', auth, (req, res) => {
    console.log(res.session);
    res.render('index', {
        homePage: true,
        isAuth: req.session?.user
    })
})
const blogsRoutes = require('./blogs/index')
const purchaseRoutes = require('./purchase/index')
const authRoutes = require('./auth/index')


router.use('/auth', authRoutes)
router.use('/blogs',auth, blogsRoutes)
router.use('/purchase',auth, purchaseRoutes)

module.exports = router;
