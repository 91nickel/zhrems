const express = require('express')
const User = require('models/User')
const auth = require('middleware/auth.middleware')

const router = express.Router({mergeParams: true})

router.get('/:id?', auth, async (request, response) => {
    try {
        console.log(request.url, request.body, request.params)
        const {id} = request.params
        if (id) {
            const user = await User.findOne({_id: id})
            return response.json(user)
        }
        const userList = await User.find()
        return response.json(userList)
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later', code: 500}})
    }
})

router.patch('/:id', auth, async (request, response) => {
    try {
        console.log(request.url, request.body, request.params)
        const {id} = request.params

        if (id === request.user._id || request.user.role === 'admin') {
            const fields = {...request.body}
            if (request.user.role !== 'admin') {
                delete fields.role
            }
            const updatedUser = await User.findByIdAndUpdate(id, fields, {new: true})
            return response.json(updatedUser)
        } else {
            return response.status(401).json({error: {message: 'Unauthorized', code: 401}})
        }
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later', code: 500}})
    }
})

router.delete('/:id', auth, async (request, response) => {
    try {
        console.log(request.url, request.body)
        const {id} = request.params
        if (id === request.user._id || request.user.role === 'admin') {
            const deletedUser = await User.findByIdAndDelete(id)
            return response.json(deletedUser)
        } else {
            return response.status(401).json({error: {message: 'Unauthorized', code: 401}})
        }
    } catch (error) {
        response.status(500).json({error: {message: 'Server error. Try later', code: 500}})
    }
})

module.exports = router
