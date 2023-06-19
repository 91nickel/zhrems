import React from 'react'
import { createAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from 'services/transaction.service'

const slice = createSlice({
    name: 'transaction',
    initialState: {
        entities: [],
        isLoading: false,
        isDataLoaded: false,
        success: null,
        error: null,
    },
    reducers: {
        created: (state, action) => {
            state.entities = [action.payload, ...state.entities]
            state.success = `Successfully created transaction ${action.payload.value}`
        },
        updated: (state, action) => {
            const updated = action.payload
            state.entities = state.entities.map(prod => {
                if (prod._id === updated._id)
                    return updated
                return prod
            })
            state.success = `Successfully updated transaction ${updated.name}`
        },
        deleted: (state, action) => {
            const id = action.payload
            state.entities = state.entities.filter(prod => prod._id !== id)
            state.success = `Successfully deleted transaction with _id=${id}`
        },
        requested: (state) => {
            state.isLoading = true
            state.error = null
            state.success = null
        },
        received: (state, action) => {
            state.entities = action.payload
            state.isLoading = false
            state.isDataLoaded = true
        },
        requestFailed: (state, action) => {
            state.error = action.payload
            state.success = null
            state.isLoading = false
        },
        messagesCleared: (state, action) => {
            state.error = null
            state.success = null
        },
    }
})

const {created, updated, deleted, requested, received, requestFailed, messagesCleared} = slice.actions

const createRequested = createAction('transaction/createRequested')
const createFailed = createAction('transaction/createFailed')
const updateRequested = createAction('transaction/updateRequested')
const updateFailed = createAction('transaction/updateFailed')
const deleteRequested = createAction('transaction/deleteRequested')
const deleteFailed = createAction('transaction/deleteFailed')

export const action = {

    create: createAsyncThunk(
        'transaction/create',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(createRequested(payload))
            try {
                const content = await service.create(payload)
                thunkAPI.dispatch(created(content))
                return content
            } catch (error) {
                console.log(error)
                thunkAPI.dispatch(createFailed(error.message))
                return thunkAPI.rejectWithValue()
            }
        }
    ),

    update: createAsyncThunk(
        'transaction/update',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(updateRequested(payload))
            try {
                const content = await service.update(payload)
                thunkAPI.dispatch(updated(content))
                return content
            } catch (error) {
                console.log(error)
                thunkAPI.dispatch(updateFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        },
    ),

    delete: createAsyncThunk(
        'transaction/delete',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(deleteRequested(payload))
            try {
                console.log('store.transaction.delete', payload)
                const content = await service.delete(payload)
                thunkAPI.dispatch(deleted(payload))
            } catch (error) {
                thunkAPI.dispatch(deleteFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        },
    ),

    getById: createAsyncThunk(
        'transaction/getById',
        async (id, thunkAPI) => {
            thunkAPI.dispatch(requested())
            try {
                const content = await service.getById(id)
                thunkAPI.dispatch(received(content))
                return content
            } catch (error) {
                thunkAPI.dispatch(requestFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        },
    ),

    get: createAsyncThunk(
        'transaction/get',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(requested())
            try {
                const content = await service.get()
                thunkAPI.dispatch(received(content))
                return content
            } catch (error) {
                thunkAPI.dispatch(requestFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        },
    ),


    clearMessages: () => async (dispatch) => {
        dispatch(messagesCleared())
    },

}

export const selector = {
    get: () => state => state.transaction.entities,
    byId: id => state => state.transaction.entities.find(u => u._id === id),
    isDataLoaded: () => state => state.transaction.isDataLoaded,
    isLoading: () => state => state.transaction.isLoading,
    error: () => state => state.transaction.error,
    success: () => state => state.transaction.success,
}

export default slice.reducer
