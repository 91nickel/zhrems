const express = require('express')
const Weight = require('../models/Weight')

const router = express.Router({mergeParams: true})

router.get('/:userId', async (request, response) => {
    try {

    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

module.exports = router

