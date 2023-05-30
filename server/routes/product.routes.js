const express = require('express')
const Product = require('models/Product')
const auth = require('middleware/auth.middleware')

const router = express.Router({mergeParams: true})

router.get('/:id?', auth, async (request, response) => {
    try {
        console.log(request.url, request.body)

        const {id} = request.params
        const user = request.user

        if (id) {
            const product = await Product.findById(id)
            if (!product) {
                response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
            }
            if (product.user && product.user !== user._id && user.role !== 'admin') {
                response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            }
            return response.json(product)
        }

        const products = await Product.find({$or: [{user: null}, {user: user._id}]})
        return response.json(products)

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

router.post('/', auth, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const user = request.user
        const fields = {...request.body, user: user.role !== 'admin' ? user._id : request.body.user}
        const product = await Product.create(fields)
        return response.json(product)
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
        const product = await Product.findByIdAndUpdate(id, request.body, {new: true})
        if (!product)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        return response.json(product)

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

router.delete('/:id', auth, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const {id} = request.params
        const user = request.user
        const product = await Product.findById(id)

        if (!product) {
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        }

        if (request.body.user !== user._id && user.role !== 'admin') {
            response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }

        await Product.findByIdAndRemove(id)
        return response.json({})

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later.', code: 500}})
    }
})

module.exports = router

