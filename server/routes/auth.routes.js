const express = require('express')

const router = express.Router({mergeParams: true})

// /api/auth/signUp
router.post('/signUp', async (request, response) => {
    try {
        console.log(request.url, request.body)
    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

router.post('/signInWithPassword', async (request, response) => {
    try {
        console.log(request.url, request.body)
    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

router.post('/token', async (request, response) => {
    try {
        console.log(request.url, request.body)
    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

module.exports = router

