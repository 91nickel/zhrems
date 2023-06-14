const express = require('express')
const Weight = require('models/Weight')

const router = express.Router({mergeParams: true})
const auth = require('middleware/auth.middleware')

router.get('/:id?', auth, async (request, response) => {
    try {

        console.log({
            path: 'GET /weights/' + request.url,
            // body: request.body,
            params: request.params,
            user: request.user
        })

        const {id} = request.params
        const user = request.user

        if (id) {
            const weight = await Weight.findById(id)
            if (!weight) {
                response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
            }
            if (weight.user.toString() !== user.localId && !user.isAdmin) {
                response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            }
            return response.json(weight)
        }

        const weights = await Weight.find({user: user.localId}).sort({date: 'desc'})
        return response.json(weights)
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

router.post('/', auth, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const user = request.user
        const fields = {...request.body, user: user.role !== 'admin' ? user._id : request.body.user}
        const weight = await Weight.create(fields)
        return response.json(weight)
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

router.patch('/:id', auth, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const {id} = request.params
        const user = request.user
        if (request.body.user !== user._id && user.role !== 'admin') {
            response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }
        const weight = await Weight.findByIdAndUpdate(id, request.body, {new: true})
        if (!weight)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        return response.json(weight)

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

router.delete('/:id', auth, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const {id} = request.params
        const user = request.user
        const weight = await Weight.findById(id)

        if (!weight) {
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        }

        if (request.body.user !== user._id && user.role !== 'admin') {
            response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }

        await Weight.findByIdAndRemove(id)
        return response.json({})
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

module.exports = router

