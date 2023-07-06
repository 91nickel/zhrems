const express = require('express')
const Weight = require('models/Weight')

const router = express.Router({mergeParams: true})
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')

router.get('/:id?', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user} = request

        if (id) {
            const weight = await Weight.findById(id)
            if (!weight) {
                return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
            }
            if (weight.user.toString() !== user.localId && !user.isAdmin) {
                return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            }
            return response.json(weight)
        }

        const weights = await Weight.find({user: user.localId}).sort({date: 'asc'})
        return response.json(weights)
    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

router.put('/', auth, log, async (request, response) => {
    try {
        const {user, body} = request

        if (body.user !== user.localId && !user.isAdmin) {
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }
        delete body._id
        const weight = await Weight.create(body)
        return response.status(201).json(weight)
    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.patch('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user, body} = request
        if (body.user !== user.localId && !user.isAdmin) {
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }
        const weight = await Weight.findByIdAndUpdate(id, body, {new: true})
        if (!weight)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

        return response.json(weight)

    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.delete('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user} = request

        const weight = await Weight.findById(id)

        if (!weight)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

        if (weight.user.toString() !== user.localId && !user.isAdmin)
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})

        await Weight.findByIdAndRemove(id)

        return response.json({})
    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

module.exports = router

