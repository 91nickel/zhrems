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
        const user = request.user

        if (id) {
            const feed = await Feed.findById(id)
            if (!feed) {
                response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
            }
            if (feed.user !== user.localId && !user.isAdmin) {
                response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            }
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
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.put('/', auth, log, async (request, response) => {
    try {
        const user = request.user

        if (!(request.body instanceof Array))
            response.status(400).json({error: {message: 'BAD_REQUEST', code: 400}})

        const feed = request.body.map(t => {
            if (t.user !== user.localId && !user.isAdmin)
                response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            return Feed.create(t)
        })

        return response.status(201).json(await Promise.all(feed))

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.patch('/', auth, log, async (request, response) => {
    try {
        const user = request.user

        if (!(request.body instanceof Array))
            response.status(400).json({error: {message: 'BAD_REQUEST', code: 400}})

        const feeds = request.body.map(async t => {
            if (t.user !== user.localId && !user.isAdmin)
                response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            if (t._id)
                return Feed.findByIdAndUpdate(t._id, )
            else
                return Feed.create(t)
        })

        return response.json(await Promise.all(feeds))
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.delete('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const user = request.user

        const feed = await Feed.findById(id)

        if (!feed) {
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        }

        if (request.body.user !== user.localId && !user.isAdmin) {
            response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }

        await Feed.findByIdAndRemove(id)
        return response.json({})

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

module.exports = router

