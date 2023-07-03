const express = require('express')
const Section = require('models/Section')
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')

const router = express.Router({mergeParams: true})

router.get('/:id?', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const user = request.user

        if (id) {
            const section = await Section.findById(id)
            if (!section) {
                response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
            }
            if (section.user && section.user !== user.localId && !user.isAdmin) {
                response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            }
            return response.json(section)
        }

        const sections = await Section.find({$or: [{user: null}, {user: user.localId}]})

        return response.json(sections)

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

router.put('/', auth, log, async (request, response) => {
    try {
        const user = request.user
        const fields = {...request.body, user: user.isAdmin ? request.body.user || null : user.localId}
        const section = await Section.create(fields)
        return response.json(section)
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.' + error.message, code: 500}})
    }
})

router.patch('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const user = request.user

        if (!user.isAdmin && request.body.user !== user.localId) {
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }
        const section = await Section.findByIdAndUpdate(id, request.body, {new: true})
        if (!section)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

        return response.json(section)

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

router.delete('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const user = request.user
        const section = await Section.findById(id)

        if (!section) {
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        }

        if (!user.isAdmin && request.body.user !== user.localId) {
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }

        await Section.findByIdAndRemove(id)
        return response.json({})

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

module.exports = router

