const express = require('express')
const Feed = require('models/Feed')
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')
const {getDateEnd, getDateStart} = require('utils/date')
const router = express.Router({mergeParams: true})

router.get('/:id?', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {date, dateStart, dateEnd} = request.query
        const {user} = request

        if (id) {
            const feed = await Feed.findById(id)
            if (!feed)
                return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

            if (feed.user !== user.localId && !user.isAdmin)
                return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})

            return response.json(feed)
        }
        const filter = {user: user.localId}
        if (date) {
            const dateStart = getDateStart(date)
            const dateEnd = getDateEnd(date)
            filter.date = {$gte: dateStart.toISOString(), $lte: dateEnd.toISOString()}
        } else if (dateStart && dateEnd) {
            filter.date = {$gte: dateStart, $lte: dateEnd}
        }
        const feeds = await Feed.find(filter).sort({date: 'asc'})
        return response.json(feeds)
    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.put('/', auth, log, async (request, response) => {
    try {
        const {user, body} = request

        if (!(body instanceof Array))
            return response.status(400).json({error: {message: 'BAD_REQUEST', code: 400}})

        let forbidden = false
        let feeds = body.map(f => {
            delete f._id
            if (forbidden) return {}
            if (f.user !== user.localId && !user.isAdmin) {
                forbidden = true
                return {}
            }
            return f
        })

        if (forbidden)
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})

        feeds = feeds.map(f => Feed.create(f))

        return response.status(201).json(await Promise.all(feeds))

    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.patch('/', auth, log, async (request, response) => {
    try {
        const {user, body} = request

        if (!(body instanceof Array))
            return response.status(400).json({error: {message: 'BAD_REQUEST', code: 400}})

        let forbidden = false
        let feeds = body.map(f => {
            if (forbidden) return {}
            if (f.user !== user.localId && !user.isAdmin) {
                forbidden = true
                return {}
            }
            return f
        })

        if (forbidden)
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})

        feeds = request.body.map(async f => {
            if (f._id)
                return Feed.findByIdAndUpdate(f._id, f, {new: true})
            else
                return Feed.create(f)
        })

        return response.json(await Promise.all(feeds))
    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.delete('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user} = request

        const feed = await Feed.findById(id)

        if (!feed)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

        if (feed.user.toString() !== user.localId && !user.isAdmin)
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})

        await Feed.findByIdAndRemove(id)

        return response.json({})

    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

module.exports = router

