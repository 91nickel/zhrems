const express = require('express')
const Product = require('models/Product')
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')

const router = express.Router({mergeParams: true})

router.get('/:id?', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user} = request

        if (id) {
            const product = await Product.findById(id)
            if (!product)
                return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

            if (product.user && product.user !== user.localId && !user.isAdmin)
                return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})

            return response.json(product)
        }

        const products = await Product.find({$or: [{user: null}, {user: user.localId}]})

        return response.json(products)

    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.put('/', auth, log, async (request, response) => {
    try {
        const {user, body} = request
        const fields = {
            ...body,
            user: user.isAdmin ? (body.user || null) : user.localId,
            section: body.section || null,
        }
        delete fields._id
        const product = await Product.create(fields)
        return response.json(product)
    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.patch('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user, body} = request

        if (body.user !== user.localId && !user.isAdmin)
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})

        const fields = {...body, section: body.section || null}
        const product = await Product.findByIdAndUpdate(id, fields, {new: true})
        if (!product)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

        return response.json(product)

    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.delete('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user} = request

        const product = await Product.findById(id)
        if (!product)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

        if (product.user.toString() !== user.localId && !user.isAdmin)
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})

        await Product.findByIdAndRemove(id)

        return response.json({})

    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

module.exports = router

