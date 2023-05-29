const express = require('express')
const Meal = require('../models/Meal')

const router = express.Router({mergeParams: true})

router.get('/:userId', async (request, response) => {
    try {
        const result = await Meal.find({userId: request.params.userId})
        response.status(200).json(result)
    } catch (error) {
        response.status(500).json({
            message: 'Server error. Try later.'
        })
    }
})

module.exports = router

