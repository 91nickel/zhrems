import React from 'react'
import { createAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from 'services/weight.service'
import { getDateEnd, getDateStart } from '../utils/date'

const slice = createSlice({
    name: 'weight',
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
            state.success = `Successfully created weight ${action.payload.value}`
        },
        updated: (state, action) => {
            const updated = action.payload
            state.entities = state.entities.map(prod => {
                if (prod._id === updated._id)
                    return updated
                return prod
            })
            state.success = `Successfully updated weight ${updated.name}`
        },
        deleted: (state, action) => {
            const id = action.payload
            state.entities = state.entities.filter(prod => prod._id !== id)
            state.success = `Successfully deleted weight with _id=${id}`
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

const createRequested = createAction('weight/createRequested')
const createFailed = createAction('weight/createFailed')
const updateRequested = createAction('weight/updateRequested')
const updateFailed = createAction('weight/updateFailed')
const deleteRequested = createAction('weight/deleteRequested')
const deleteFailed = createAction('weight/deleteFailed')

export const action = {

    create: createAsyncThunk(
        'weight/create',
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
        'weight/update',
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
        'weight/delete',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(deleteRequested(payload))
            try {
                // console.log('store.weight.delete', payload)
                const content = await service.delete(payload)
                thunkAPI.dispatch(deleted(payload))
            } catch (error) {
                thunkAPI.dispatch(deleteFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        },
    ),

    getById: createAsyncThunk(
        'weight/getById',
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
        'weight/get',
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
    get: () => state => state.weight.entities,
    last: () => state => state.weight.entities[state.weight.entities.length -1],
    byDate: date => state => state.weight.entities.filter(weight => {
        const dateStart = getDateStart(date)
        const dateEnd = getDateEnd(date)
        const weightDate = new Date(weight.date)
        return weightDate >= dateStart && weightDate <= dateEnd
    }),
    byId: id => state => state.weight.entities.find(u => u._id === id),
    todayStart: () => state => {
        const dateStart = getDateStart(new Date(state.date.current))
        return state.weight.entities.find(w => w.date === dateStart.toISOString()) || null
    },
    todayEnd: () => state => {
        const dateEnd = getDateEnd(new Date(state.date.current))
        return state.weight.entities.find(w => w.date === dateEnd.toISOString()) || null
    },
    isDataLoaded: () => state => state.weight.isDataLoaded,
    isLoading: () => state => state.weight.isLoading,
    error: () => state => state.weight.error,
    success: () => state => state.weight.success,
}

export default slice.reducer
