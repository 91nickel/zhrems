const express = require('express')
const Transaction = require('models/Transaction')
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')

const router = express.Router({mergeParams: true})

router.get('/:id?', auth, log, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const {id, date} = request.params
        const user = request.user

        if (id) {
            const transaction = await Transaction.findById(id)
            if (!transaction) {
                response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
            }
            if (transaction.user !== user._id && !user.isAdmin) {
                response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            }
            return response.json(transaction)
        }
        const filter = {user: user._id}
        if (date) {
            const dateStart = new Date(date)
            const dateEnd = new Date(date)
            dateStart.setHours(0)
            dateStart.setMinutes(0)
            dateStart.setSeconds(0)
            dateEnd.setHours(0)
            dateEnd.setMinutes(0)
            dateEnd.setSeconds(0)
            filter.date = {
                $gte: dateStart.toISOString(),
                $lte: dateEnd.toISOString(),
            }
        }
        const transactions = await Transaction.find(filter)
        return response.json(transactions)
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.put('/', auth, log, async (request, response) => {
    try {
        const user = request.user
        if (request.body.user !== user._id && !user.isAdmin) {
            response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }
        const transaction = await Transaction.create(request.body)
        return response.status(201).json(transaction)
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.patch('/:id', auth, log, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const {id} = request.params
        const user = request.user
        if (request.body.user !== user._id && !user.isAdmin) {
            response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }
        const transaction = await Transaction.findByIdAndUpdate(id, request.body, {new: true})
        if (!transaction)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        return response.json(transaction)
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.delete('/:id', auth, log, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const {id} = request.params
        const user = request.user

        const transaction = await Transaction.findById(id)

        if (!transaction) {
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        }

        if (request.body.user !== user._id && !user.isAdmin) {
            response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }

        await Transaction.findByIdAndRemove(id)
        return response.json({})

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

module.exports = router

