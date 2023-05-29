const express = require('express')
const Transaction = require('../models/Transaction')

const router = express.Router({mergeParams: true})

router.get('/', async (request, response) => {
    try {

    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

module.exports = router

