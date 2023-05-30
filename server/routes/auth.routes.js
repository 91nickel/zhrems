const express = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('models/User')
const tokenService = require('services/token.service')
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
                return response.status(400).json({
                    error: {
                        message: 'Invalid data',
                        code: 400,
                        errors: errors.array(),
                    }
                })
            }
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
                return response.status(400).json({
                    error: {
                        message: 'Invalid data',
                        code: 400,
                        errors: errors.array(),
                    }
                })
            }

            const {email, password} = request.body

            const existingUser = await User.findOne({email})
            if (!existingUser) {
                return response.status(404).json({
                    error: {
                        message: 'USER_NOT_FOUND',
                        code: 404,
                    }
                })
            }

            const isPasswordsEqual = await bcrypt.compare(password.toString(), existingUser.password)

            if (!isPasswordsEqual) {
                return response.status(403).json({
                    error: {
                        message: 'INVALID_PASSWORD',
                        code: 403,
                    }
                })
            }

            const tokens = tokenService.generate({_id: existingUser._id})
            await tokenService.save(existingUser._id, tokens.refreshToken)

            return response.status(200).json({...tokens, userId: existingUser._id})

        } catch (error) {
            console.error(error)
            response.status(500).json({
                message: 'Server error. Try later.'
            })
        }
    }
])

function isTokenInvalid (data, dbToken) {
    return !data || !dbToken || data?._id !== dbToken?.user?.toString()
}

router.post('/token',
    async (request, response) => {
        try {
            console.log(request.url, request.body)

            const {refresh_token: refreshToken} = request.body

            const data = await tokenService.validateRefresh(refreshToken)
            const dbToken = await tokenService.findToken(refreshToken)

            if (isTokenInvalid(data, dbToken)) {
                return response.status(401).json({
                    error: {
                        message: 'Unauthorized',
                        code: 401,
                    }
                })
            }

            const tokens = await tokenService.generate({
                id: data._id
            })
            await tokenService.save(data._id, tokens.refreshToken)

            return response.status(200).json({...tokens, userId: data._id})

        } catch (error) {
            response.status(500).json({
                message: 'Server error. Try later.'
            })
        }
    }
)

module.exports = router

