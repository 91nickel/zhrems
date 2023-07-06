const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('models/User')
const Account = require('models/Account')
const Weight = require('models/Weight')
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')
const tokenService = require('services/token.service')

const router = express.Router({mergeParams: true})

router.get('/:id?', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user} = request

        if (id) {
            const user = await User.findOne({_id: id})
            const account = await Account.findById(user.account)
            // const weight = await Weight.findOne({user: id}).sort({value: 'desc'})
            return response.json({
                ...user.toObject(),
                isAdmin: account.admin,
                email: account.email,
            })
        }

        const conditions = user.isAdmin
            ? {}
            : {_id: user.localId}

        const userList = await User.find(conditions)
        // const userIds = userList.map(u => u._id)
        // const weightList = await Weight.aggregate()
        //     .sort({createdAt: 'desc'})
        //     .match({user: {$in: userIds}})
        //     .project({user: 1, value: 1})
        //     .group({_id: '$user', value: {$last: '$value'}, user: {$last: '$user'}})

        const result = userList.map(async user => {
            const account = await Account.findById(user.account)
            // const weight = await Weight.findOne({user: user._id}).sort({createdAt: -1})
            return {
                ...user.toObject(),
                email: account.email,
                isAdmin: account.admin,
            }
        })

        return response.json(await Promise.all(result))

    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.patch('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user, body} = request
        delete body._id

        if (id === user.localId || user.isAdmin) {
            let account
            const user = await User.findByIdAndUpdate(id, body, {new: true})

            if (body.email || body.password || body.isAdmin) {
                const fields = {}
                if (body.email)
                    fields.email = body.email
                if (body.password)
                    fields.password = await bcrypt.hash(body.password, 12)
                if (typeof body.isAdmin !== 'undefined' && user.isAdmin)
                    fields.isAdmin = body.isAdmin
                account = await Account.findByIdAndUpdate(user.account, fields, {new: true})
                await tokenService.delete(id)
            } else {
                account = await Account.findById(user.account)
            }

            return response.json({
                ...user.toObject(),
                email: account.email,
                isAdmin: account.admin,
            })
        } else {
            return response.status(403).json({error: {message: 'Forbidden', code: 403}})
        }
    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.delete('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user} = request

        if (id !== user.localId && !user.isAdmin)
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})

        let profile = await User.findById(id)
        if (!profile)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

        await User.findByIdAndRemove(id)

        return response.json({})

    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later', code: 500}})
    }
})

module.exports = router
