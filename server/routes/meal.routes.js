const express = require('express')
const Meal = require('models/Meal')
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')
const router = express.Router({mergeParams: true})

router.get('/:id?', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const user = request.user

        if (id) {
            const meal = await Meal.findById(id)
            if (!meal) {
                response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
            }
            if (meal.user && meal.user !== user.localId && !user.isAdmin) {
                response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            }
            return response.json(meal)
        }

        const meals = await Meal.find({$or: [{user: null}, {user: user._id}]})
        return response.json(meals)
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.put('/', auth, log, async (request, response) => {
    try {
        const user = request.user
        const fields = {...request.body, user: user.isAdmin ? user._id : request.body.user}
        const meal = await Meal.create(fields)
        return response.json(meal)
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
        const meal = await Meal.findByIdAndUpdate(id, request.body, {new: true})
        if (!meal)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        return response.json(meal)

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.delete('/:id', auth, log, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const {id} = request.params
        const user = request.user
        const meal = await Meal.findById(id)

        if (!meal) {
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
        }

        if (request.body.user !== user.localId && !user.isAdmin) {
            response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
        }

        await Meal.findByIdAndRemove(id)
        return response.json({})

    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

module.exports = router

