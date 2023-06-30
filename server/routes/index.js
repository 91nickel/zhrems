const express = require('express')

const router = express.Router({mergeParams: true})

// /api/auth/...
router.use('/auth', require('./auth.routes'))
router.use('/product', require('./product.routes'))
router.use('/meal', require('./meal.routes'))
router.use('/feed', require('./feed.routes'))
router.use('/weight', require('./weight.routes'))
router.use('/user', require('./user.routes'))

module.exports = router
