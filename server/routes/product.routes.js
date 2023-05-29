const express = require('express')
const Product = require('../models/Product')

const router = express.Router({mergeParams: true})

router.get('/:id?', async (request, response) => {
    try {
        console.log(request.url, request.body)
        const result = await Product.find()
        response.status(200).json(result)
    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

router.post('/', async (request, response) => {
    try {
        console.log(request.url, request.body)
    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

router.put('/:id', async (request, response) => {
    try {
        console.log(request.url, request.body)
    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

router.delete('/:id', async (request, response) => {
    try {
        console.log(request.url, request.body)
    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

module.exports = router

