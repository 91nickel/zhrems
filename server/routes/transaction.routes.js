
const express = require('express')
const Transaction = require('models/Transaction')
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')
const { getDateEnd, getDateStart } =require('utils/date')
const router = express.Router({mergeParams: true})

router.get('/:id?', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {date, dateStart, dateEnd} = request.query
        const user = request.user

        if (id) {
            const transaction = await Transaction.findById(id)
            if (!transaction) {
                response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
            }
            if (transaction.user !== user.localId && !user.isAdmin) {
                response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            }
            return response.json(transaction)
        }
        const filter = {user: user.localId}
        if (date) {
            const dateStart = getDateStart(date)
            const dateEnd = getDateEnd(date)
            filter.date = {$gte: dateStart.toISOString(), $lte: dateEnd.toISOString()}
        } else if (dateStart && dateEnd) {
            filter.date = {$gte: dateStart, $lte: dateEnd}
        }
        const transactions = await Transaction.find(filter).sort({date: 'asc'})
        return response.json(transactions)
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.put('/', auth, log, async (request, response) => {
    try {
        const user = request.user
        if (request.body.user !== user.localId && !user.isAdmin) {
            response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }
        console.log(request.body.products)
        // const result = request.body.products.map(async p => await Transaction.create({}))
        const transactions = request.body.products.map(async product => {
            const fields = {
                date: new Date(request.body.date),
                user: request.body.user,
                ...product,
            }
            return await Transaction.create(fields)
        })
        return response.status(201).json(Promise.all(transactions))
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.patch('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const user = request.user
        if (request.body.user !== user.localId && !user.isAdmin) {
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
        const {id} = request.params
        const user = request.user

        const transaction = await Transaction.findById(id)

        if (!transaction) {
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        }

        if (request.body.user !== user.localId && !user.isAdmin) {
            response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }

        await Transaction.findByIdAndRemove(id)
        return response.json({})

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

module.exports = router

