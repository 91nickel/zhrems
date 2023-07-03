import React from 'react'
import { createAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from 'services/meal.service'

const slice = createSlice({
    name: 'meal',
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
            state.success = `Successfully created meal ${action.payload.name}`
        },
        updated: (state, action) => {
            const updated = action.payload
            state.entities = state.entities.map(prod => {
                if (prod._id === updated._id)
                    return updated
                return prod
            })
            state.success = `Successfully updated meal ${updated.name}`
        },
        deleted: (state, action) => {
            const id = action.payload
            state.entities = state.entities.filter(m => m._id !== id)
            state.success = `Successfully deleted meal with _id=${id}`
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

const createRequested = createAction('meal/createRequested')
const createFailed = createAction('meal/createFailed')
const updateRequested = createAction('meal/updateRequested')
const updateFailed = createAction('meal/updateFailed')
const deleteRequested = createAction('meal/deleteRequested')
const deleteFailed = createAction('meal/deleteFailed')

export const action = {

    create: createAsyncThunk(
        'meal/create',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(createRequested(payload))
            try {
                const content = await service.create(payload)
                console.log('meal/create', content)
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
        'meal/update',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(updateRequested(payload))
            try {
                const content = await service.update(payload)
                console.log(content)
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
        'meal/delete',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(deleteRequested(payload))
            try {
                console.log('store.meal.delete', payload)
                const content = await service.delete(payload)
                thunkAPI.dispatch(deleted(payload))
            } catch (error) {
                thunkAPI.dispatch(deleteFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        },
    ),

    getById: createAsyncThunk(
        'meal/getById',
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
        'meal/get',
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
    get: () => state => {
        return state.meal.entities.map(meal => {
            const pids = meal.products.map(p => p._id)
            return {
                ...meal,
                products: state.product.entities
                    .filter(fp => pids.includes(fp._id))
                    .map(fp => ({...fp, ...meal.products.find(mp => mp._id === fp._id)}))
            }

        })
    },
    byId: id => state => {
        const meal = state.meal.entities.find(u => u._id === id)
        return {
            ...meal,
            products: state.product.entities
                .filter(fp => meal.products.map(mp => mp._id).includes(fp._id))
                .map(fp => ({...fp, ...meal.products.find(mp => mp._id === fp._id)}))
        }
    },
    isDataLoaded: () => state => state.meal.isDataLoaded,
    isLoading: () => state => state.meal.isLoading,
    error: () => state => state.meal.error,
    success: () => state => state.meal.success,
}

export default slice.reducer
