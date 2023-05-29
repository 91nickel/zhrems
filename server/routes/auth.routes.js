const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('models/User')
const tokenService = require('services/token.service')
const {generateUserData} = require('helpers')

const router = express.Router({mergeParams: true})

// /api/auth/signUp
router.post('/signUp', async (request, response) => {
    try {
        console.log(request.url, request.body)
        const {email, password} = request.body

        const existingUser = await User.findOne({email})
        if (existingUser) {
            return response.status(400).json({
                error: {
                    message: 'EMAIL_EXISTS',
                    code: 400,
                }
            })
        }
        const pwHash = await bcrypt.hash(password.toString(), 12)

        const newUser = await User.create({
            ...generateUserData(),
            ...request.body,
            password: pwHash,
        })

        const tokens = tokenService.generate({_id: newUser._id})
        await tokenService.save(newUser._id, tokens.refreshToken)

        return response.status(201).json({...tokens, userId: newUser._id})

    } catch (error) {
        console.error(error)
        response.status(500).json({
            message: `Server error: [${error.message}]. Try later.`
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

