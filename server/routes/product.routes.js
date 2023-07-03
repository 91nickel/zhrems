const express = require('express')
const Product = require('models/Product')
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')

const router = express.Router({mergeParams: true})

router.get('/:id?', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const user = request.user

        if (id) {
            const product = await Product.findById(id)
            if (!product) {
                response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
            }
            if (product.user && product.user !== user.localId && !user.isAdmin) {
                response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            }
            return response.json(product)
        }

        const products = await Product.find({$or: [{user: null}, {user: user.localId}]})

        return response.json(products)

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. '+ error.message, code: 500}})
    }
})

router.put('/', auth, log, async (request, response) => {
    try {
        const user = request.user
        const fields = {
            ...request.body,
            user: user.isAdmin ? request.body.user || null : user.localId,
            section: request.body.section || null,
        }
        const product = await Product.create(fields)
        return response.json(product)
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.patch('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const user = request.user

        if (!user.isAdmin && request.body.user !== user.localId) {
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }
        const fields = {
            ...request.body,
            section: request.body.section || null,
        }
        const product = await Product.findByIdAndUpdate(id, fields, {new: true})
        if (!product)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

        return response.json(product)

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. '+ error.message, code: 500}})
    }
})

router.delete('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const user = request.user
        const product = await Product.findById(id)

        if (!product) {
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        }

        if (!user.isAdmin && request.body.user !== user.localId) {
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }

        await Product.findByIdAndRemove(id)
        return response.json({})

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. '+ error.message, code: 500}})
    }
})

module.exports = router

