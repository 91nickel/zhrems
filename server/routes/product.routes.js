const express = require('express')
const Product = require('../models/Product')

const router = express.Router({mergeParams: true})

// дефолтные продукты
router.get('/', async (request, response) => {
    try {
        const result = await Product.find({userId: null})
        response.status(200).json(result)
    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

// кастомные продукты пользователя
router.get('/:userId', async (request, response) => {
    try {
        const result = await Product.find({userId: request.params.userId})
        response.status(200).json(result)
    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

module.exports = router

