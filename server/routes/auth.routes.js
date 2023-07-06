const express = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('models/User')
const Account = require('models/Account')
const tokenService = require('services/token.service')
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')
const {generateUserData} = require('helpers')

const router = express.Router({mergeParams: true})

// 1. validate data from request
// 2. check if user exists
// 3. hash password
// 4. create user
// 5. generate tokens
// /api/auth/signUp
router.post('/signUp', log, [
    check('name', 'Укажите имя').isLength({min: 1}),
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля - 8 символов').isLength({min: 8}),
    async (request, response) => {
        try {
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({error: {message: 'Invalid data', code: 400, errors: errors.array()}})
            }
            const {email, password} = request.body

            const existingAccount = await Account.findOne({email})
            if (existingAccount)
                return response.status(400).json({error: {message: 'EMAIL_EXISTS', code: 400}})

            const account = await Account.create({email, password: await bcrypt.hash(password.toString(), 12)})

            const userFields = {...generateUserData(), ...request.body, account: account._id.toString()}
            delete userFields.email
            delete userFields.password
            delete userFields.license

            const user = await User.create(userFields)

            const tokens = tokenService.generate({localId: user._id, isAdmin: account.admin, email: account.email})
            await tokenService.save(account._id, tokens.refreshToken)

            return response.status(201).json(tokens)
        } catch (error) {
            console.error(error)
            return response.status(500).json({error: {message: 'Server error. Try later.' + error.message, code: 500}})
        }
    }
])

// 1. validate
// 2. check if user exists
// 3. compare hash
// 4. generate token
// 5. return data
router.post('/signInWithPassword', log, [
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('password', 'Пароль не может быть пустым').exists(),
    async (request, response) => {
        try {
            const errors = validationResult(request)
            if (!errors.isEmpty())
                return response.status(400).json({error: {message: 'Invalid data', code: 400, errors: errors.array()}})

            const {email, password} = request.body

            const account = await Account.findOne({email})
            if (!account)
                return response.status(404).json({error: {message: 'ACCOUNT_NOT_FOUND', code: 404}})

            const user = await User.findOne({account: account._id})
            if (!user)
                return response.status(404).json({error: {message: 'USER_NOT_FOUND', code: 404}})

            const isPasswordsEqual = await bcrypt.compare(password.toString(), account.password)
            if (!isPasswordsEqual)
                return response.status(403).json({error: {message: 'INVALID_PASSWORD', code: 403}})

            const tokens = tokenService.generate({localId: user._id, isAdmin: account.admin})
            await tokenService.save(account._id, tokens.refreshToken)

            return response.status(200).json(tokens)

        } catch (error) {
            console.error(error)
            return response.status(500).json({error: {message: 'Server error. Try later.' + error.message, code: 500}})
        }
    }
])

router.post('/signOut', auth, log, async (request, response) => {
    const {user} = request
    try {
        await tokenService.delete(user.localId)
        return response.json({})
    } catch (error) {
        console.error(error)
        return response.status(500).json({error: {message: 'Server error. Try later.' + error.message, code: 500}})
    }
})

router.post('/token', log, async (request, response) => {
    try {
        const {refresh_token: refreshToken} = request.body

        const data = await tokenService.validateRefresh(refreshToken)
        const dbToken = await tokenService.findToken(refreshToken)

        if (isTokenInvalid(data, dbToken))
            return response.status(401).json({error: {message: 'Unauthorized', code: 401}})

        const account = await Account.findById(dbToken.account)
        const user = await User.findOne({account: account._id})

        const localId = user._id.toString()

        const tokens = await tokenService.generate({localId, isAdmin: account.admin, email: account.email})

        await tokenService.save(data._id, tokens.refreshToken)

        return response.status(200).json(tokens)

    } catch (error) {
        console.error(error)
        return response.status(500).json({error: {message: 'Server error. Try later.' + error.message, code: 500}})
    }
})

function isTokenInvalid (data, dbToken) {
    return !data || !dbToken || data?._id !== dbToken?.user?.toString()
}

module.exports = router

