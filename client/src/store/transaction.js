import React from 'react'
import { createAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from 'services/transaction.service'
import { getDateStart, getDateEnd } from 'utils/date'

const slice = createSlice({
    name: 'transaction',
    initialState: {
        entities: [],
        journal: {},
        isLoading: false,
        isDataLoaded: false,
        success: null,
        error: null,
    },
    reducers: {
        created: (state, action) => {
            console.log('created', action.payload)
            state.entities = [...state.entities, ...action.payload]
            state.success = `Successfully created transaction ${action.payload.value}`
        },
        updated: (state, action) => {
            const ids = action.payload.map(u => u._id)
            state.entities = [
                ...state.entities.filter(t => !ids.includes(t._id)),
                ...action.payload,
            ]
            state.success = `Successfully updated`
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
            state.entities = [...state.entities, ...action.payload]
            state.isLoading = false
            state.isDataLoaded = true
        },
        journal: (state, action) => {
            const {key, value} = action.payload
            state.journal = {...state.journal, [key]: value}
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

const {created, updated, deleted, requested, received, requestFailed, messagesCleared, journal} = slice.actions

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
                return thunkAPI.rejectWithValue(error.message)
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

    getByDate: createAsyncThunk(
        'transaction/get',
        async (date, thunkAPI) => {
            thunkAPI.dispatch(requested())
            try {
                const content = await service.getByDate(date)
                thunkAPI.dispatch(received(content))
                thunkAPI.dispatch(journal({key: date.toLocaleDateString('fr-CA'), value: true}))
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
    journal: () => state => state.transaction.journal,
    byId: id => state => state.transaction.entities.find(u => u._id === id),
    byDate: date => state => {
        const dateStart = getDateStart(date)
        const dateEnd = getDateEnd(date)
        return state.transaction.entities.filter(t => {
            const trDate = new Date(t.date)
            return trDate >= dateStart && trDate <= dateEnd
        })
    },
    byDateGrouped: date => state => {
        const transactionsGrouped = {}
        const dates = []
        const dateStart = getDateStart(date)
        const dateEnd = getDateEnd(date)
        state.transaction.entities
            .filter(t => {
                const trDate = new Date(t.date)
                return trDate >= dateStart && trDate <= dateEnd
            })

    },
    byDateExact: date => state => state.transaction.entities.filter(t => t.date === date),
    isDataLoaded: () => state => state.transaction.isDataLoaded,
    isLoading: () => state => state.transaction.isLoading,
    error: () => state => state.transaction.error,
    success: () => state => state.transaction.success,
}

export default slice.reducer
