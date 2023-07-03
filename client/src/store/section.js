import React from 'react'
import { createAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from 'services/section.service'

const slice = createSlice({
    name: 'section',
    initialState: {
        entities: [],
        isLoading: false,
        isDataLoaded: false,
        success: null,
        error: null,
    },
    reducers: {
        created: (state, action) => {
            state.entities.push(action.payload)
            state.success = `Successfully created section ${action.payload.name}`
        },
        updated: (state, action) => {
            const updated = action.payload
            state.entities = state.entities.map(prod => {
                if (prod._id === updated._id)
                    return updated
                return prod
            })
            state.success = `Successfully updated section ${updated.name}`
        },
        deleted: (state, action) => {
            const id = action.payload
            state.entities = state.entities.filter(prod => prod._id !== id)
            state.success = `Successfully deleted section with _id=${id}`
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

const createRequested = createAction('section/createRequested')
const createFailed = createAction('section/createFailed')
const updateRequested = createAction('section/updateRequested')
const updateFailed = createAction('section/updateFailed')
const deleteRequested = createAction('section/deleteRequested')
const deleteFailed = createAction('section/deleteFailed')

export const action = {

    create: createAsyncThunk(
        'section/create',
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
        'section/update',
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
        'section/delete',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(deleteRequested(payload))
            try {
                console.log('store.section.delete', payload)
                const content = await service.delete(payload)
                thunkAPI.dispatch(deleted(payload))
            } catch (error) {
                thunkAPI.dispatch(deleteFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        },
    ),

    getById: createAsyncThunk(
        'section/getById',
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
        'section/get',
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
    get: () => state => state.section.entities,
    byId: id => state => state.section.entities.find(u => u._id === id),
    isDataLoaded: () => state => state.section.isDataLoaded,
    isLoading: () => state => state.section.isLoading,
    error: () => state => state.section.error,
    success: () => state => state.section.success,
}

export default slice.reducer
