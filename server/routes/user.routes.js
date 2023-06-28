const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('models/User')
const Account = require('models/Account')
const Weight = require('models/Weight')
const auth = require('middleware/auth.middleware')
const tokenService = require('services/token.service')

const router = express.Router({mergeParams: true})

router.get('/:id?', auth, async (request, response) => {
    try {
        console.log(request.url, request.body, request.params)
        const {id} = request.params
        if (id) {
            const user = await User.findOne({_id: id})
            const account = await Account.findById(user.account)
            // const weight = await Weight.findOne({user: id}).sort({value: 'desc'})
            return response.json({
                ...user.toObject(),
                isAdmin: account.admin,
                // weight: weight.value,
                email: account.email,
            })
        }

        const conditions = request.user.isAdmin
            ? {}
            : {_id: request.user.localId}

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
                // weight: weight.value,
            }
        })

        return response.json(await Promise.all(result))

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.patch('/:id', auth, async (request, response) => {
    try {
        console.log({
            path: 'PATCH /users/' + request.url,
            body: request.body,
            params: request.params,
            user: request.user
        })
        const {id} = request.params

        if (id === request.user._id || request.user.isAdmin) {
            let account
            const user = await User.findByIdAndUpdate(id, request.body, {new: true})

            if (request.body.email || request.body.password || request.body.isAdmin) {
                const fields = {}
                if (request.body.email)
                    fields.email = request.body.email
                if (request.body.password)
                    fields.password = await bcrypt.hash(request.body.password, 12)
                if (typeof request.body.isAdmin !== 'undefined' && request.user.isAdmin)
                    fields.isAdmin = request.body.isAdmin
                account = await Account.findByIdAndUpdate(user.account, fields, {new: true})
                await tokenService.delete(request.user._id)
            } else {
                account = await Account.findById(user.account)
            }

            const weight = await Weight.findOne({user: id}).sort({value: 'desc'})

            console.log(user)
            return response.json({
                ...user.toObject(),
                weight: weight.value,
                email: account.email,
                isAdmin: account.admin,
            })
        } else {
            return response.status(401).json({error: {message: 'Unauthorized', code: 401}})
        }
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.delete('/:id', auth, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const {id} = request.params
        if (id === request.user._id || request.user.isAdmin) {
            const deletedUser = await User.findByIdAndDelete(id)
            return response.json(deletedUser)
        } else {
            return response.status(401).json({error: {message: 'Unauthorized', code: 401}})
        }
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later', code: 500}})
    }
})

module.exports = router
