const express = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('models/User')
const tokenService = require('services/token.service')
const auth = require('middleware/auth.middleware')
const {generateUserData} = require('helpers')

const router = express.Router({mergeParams: true})

// 1. validate data from request
// 2. check if user exists
// 3. hash password
// 4. create user
// 5. generate tokens
// /api/auth/signUp
router.post('/signUp', [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля - 8 символов').isLength({min: 8}),
    async (request, response) => {
        try {
            console.log(request.url, request.body)

            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({error: {message: 'Invalid data', code: 400, errors: errors.array()}})
            }
            const {email, password} = request.body

            const existingUser = await User.findOne({email})
            if (existingUser) {
                return response.status(400).json({error: {message: 'EMAIL_EXISTS', code: 400}})
            }

            const newUser = await User.create({
                ...generateUserData(),
                ...request.body,
                role: 'user',
                password: await bcrypt.hash(password.toString(), 12),
            })

            const tokens = tokenService.generate({_id: newUser._id, role: newUser.role})
            await tokenService.save(newUser._id, tokens.refreshToken)

            return response.status(201).json({...tokens, userId: newUser._id})

        } catch (error) {
            console.error(error)
            response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
        }
    }
])

// 1. validate
// 2. check if user exists
// 3. compare hash
// 4. generate token
// 5. return data
router.post('/signInWithPassword', [
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('password', 'Пароль не может быть пустым').exists(),
    async (request, response) => {
        try {
            console.log(request.url, request.body)

            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({error: {message: 'Invalid data', code: 400, errors: errors.array()}})
            }

            const {email, password} = request.body

            const existingUser = await User.findOne({email})
            if (!existingUser) {
                return response.status(404).json({error: {message: 'USER_NOT_FOUND', code: 404}})
            }

            const isPasswordsEqual = await bcrypt.compare(password.toString(), existingUser.password)

            if (!isPasswordsEqual) {
                return response.status(403).json({error: {message: 'INVALID_PASSWORD', code: 403}})
            }

            const tokens = tokenService.generate({_id: existingUser._id, role: existingUser.role})
            await tokenService.save(existingUser._id, tokens.refreshToken)

            return response.status(200).json({...tokens, userId: existingUser._id})

        } catch (error) {
            console.error(error)
            response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
        }
    }
])

router.post('/signOut', auth, async (request, response) => {
    try {
        console.log(request.url, request.body)
        await tokenService.delete(request.user._id)
        response.json({})
    } catch (error) {
        console.error(error)
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

router.post('/token', async (request, response) => {
    try {
        console.log(request.url, request.body)

        const {refresh_token: refreshToken} = request.body

        const data = await tokenService.validateRefresh(refreshToken)
        const dbToken = await tokenService.findToken(refreshToken)

        if (isTokenInvalid(data, dbToken)) {
            return response.status(401).json({error: {message: 'Unauthorized', code: 401}})
        }

        const tokens = await tokenService.generate({
            id: data._id
        })
        await tokenService.save(data._id, tokens.refreshToken)

        return response.status(200).json({...tokens, userId: data._id})

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

function isTokenInvalid (data, dbToken) {
    return !data || !dbToken || data?._id !== dbToken?.user?.toString()
}

module.exports = router

