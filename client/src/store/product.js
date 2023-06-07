import React from 'react'
import { createAction, createSlice } from '@reduxjs/toolkit'
import service from 'services/product.service'

const slice = createSlice({
    name: 'product',
    initialState: {
        entities: [],
        isLoading: false,
        error: null,
        isDataLoaded: false,
    },
    reducers: {
        created: (state, action) => {
            state.entities.push(action.payload)
        },
        updated: (state, action) => {
            const updatedProduct = action.payload
            state.entities = state.entities.map(prod => {
                if (prod._id === updatedProduct._id)
                    return updatedProduct
                return prod
            })
        },
        deleted: (state, action) => {
            const id = action.payload
            state.entities = state.entities.filter(prod => prod._id !== id)
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

const {created, updated, deleted, requested, received, requestFailed} = slice.actions

const createRequested = createAction('product/createRequested')
const createFailed = createAction('product/createFailed')
const updateRequested = createAction('product/updateRequested')
const updateFailed = createAction('product/updateFailed')
const deleteRequested = createAction('product/deleteRequested')
const deleteFailed = createAction('product/deleteFailed')

export const action = {

    create: payload => async dispatch => {
        dispatch(createRequested(payload))
        try {
            const content = await service.create(payload)
            dispatch(created(content))
        } catch (error) {
            dispatch(createFailed(error.message))
        }

    },

    update: payload => async dispatch => {
        dispatch(updateRequested(payload))
        try {
            const content = await service.update(payload)
            dispatch(updated(content))
        } catch (error) {
            dispatch(updateFailed(error.message))
        }
    },

    delete: payload => async dispatch => {
        dispatch(deleteRequested(payload))
        try {
            const content = await service.delete(payload)
            dispatch(deleted(content))
        } catch (error) {
            dispatch(deleteFailed(error.message))
        }
    },

    getById: (id) => async (dispatch) => {
        dispatch(requested())
        try {
            const content = await service.getById(id)
            dispatch(received(content))
        } catch (error) {
            dispatch(requestFailed(error.message))
        }
    },

    get: () => async (dispatch) => {
        dispatch(requested())
        try {
            const content = await service.get()
            dispatch(received(content))
        } catch (error) {
            dispatch(requestFailed(error.message))
        }
    },

}

export const selector = {
    getAll: () => state => state.product.entities,
    byId: id => state => state.product.entities.find(u => u._id === id),
    isDataLoaded: () => state => state.product.isDataLoaded,
    isLoading: () => state => state.product.isLoading,
    errors: () => state => state.product.error,
}

export default slice.reducer
