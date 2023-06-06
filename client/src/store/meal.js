import React from 'react'
import { createAction, createSlice } from '@reduxjs/toolkit'
import service from 'services/meal.service'

const slice = createSlice({
    name: 'meal',
    initialState: {
        entities: null,
        isLoading: false,
        error: null,
        isDataLoaded: false,
    },
    reducers: {
        created: (state, action) => {
            state.entities.push(action.payload)
        },
        updated: (state, action) => {
            const updatedUser = action.payload
            state.entities = state.entities.map(user => {
                if (user._id === updatedUser._id)
                    return updatedUser
                return user
            })
        },
        requested: (state) => {
            state.isLoading = true
        },
        received: (state, action) => {
            state.entities = action.payload
            state.isLoading = false
            state.isDataLoaded = true
        },
        requestFailed: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
    }
})

const {created, updated, requested, received, requestFailed} = slice.actions

const createRequested = createAction('user/createRequested')
const createFailed = createAction('user/createFailed')
const updateRequested = createAction('user/updateRequested')
const updateFailed = createAction('user/updateFailed')

export const action = {
    create: payload => async dispatch => {
        dispatch(createRequested(payload))
        try {
            const {content} = await service.create(payload)
            dispatch(created(content))
        } catch (error) {
            dispatch(createFailed(error.message))
        }
    },

    update: payload => async dispatch => {
        dispatch(updateRequested(payload))
        try {
            const {content} = await service.update(payload)
            dispatch(updated(content))
        } catch (error) {
            dispatch(updateFailed(error.message))
        }
    },

    get: () => async (dispatch) => {
        dispatch(requested())
        try {
            const {content} = await service.get()
            dispatch(received(content))
        } catch (error) {
            dispatch(requestFailed(error.message))
        }
    },

}

export const selector = {
    getAll: () => state => state.meal.entities,
    getById: id => state => state.meal.entities.find(u => u._id === id),
    isLoading: () => state => state.meal.isLoading,
    errors: () => state => state.meal.error,
}

export default slice.reducer
