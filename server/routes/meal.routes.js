const express = require('express')
const Meal = require('models/Meal')
const auth = require('middleware/auth.middleware')
const log = require('middleware/log.middleware')
const router = express.Router({mergeParams: true})

router.get('/:id?', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user} = request

        if (id) {
            const meal = await Meal.findById(id)
            if (!meal) {
                return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})
            }
            if (meal.user && meal.user !== user.localId && !user.isAdmin) {
                return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})
            }
            return response.json(meal)
        }

        const meals = await Meal.find({$or: [{user: null}, {user: user.localId}]})
        return response.json(meals)
    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.put('/', auth, log, async (request, response) => {
    try {
        const {user, body} = request
        const fields = {...request.body, user: user.isAdmin ? user.localId : request.body.user}
        delete fields._id
        const meal = await Meal.create(fields)
        return response.json(meal)
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


        const meal = await Meal.findByIdAndUpdate(id, body, {new: true})
        if (!meal)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

        return response.json(meal)

    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

router.delete('/:id', auth, log, async (request, response) => {
    try {
        const {id} = request.params
        const {user} = request
        const meal = await Meal.findById(id)

        if (!meal)
            return response.status(404).json({error: {message: 'NOT_FOUND', code: 404}})

        if (meal.user.toString() !== user.localId && !user.isAdmin)
            return response.status(403).json({error: {message: 'FORBIDDEN', code: 403}})

        await Meal.findByIdAndRemove(id)

        return response.json({})

    } catch (error) {
        return response.status(500).json({error: {message: 'Server error. Try later. ' + error.message, code: 500}})
    }
})

module.exports = router

