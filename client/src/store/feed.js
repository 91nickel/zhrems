import React from 'react'
import { createAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from 'services/feed.service'
import { getDateStart, getDateEnd } from 'utils/date'

const slice = createSlice({
    name: 'feed',
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
            state.success = `Добавлен прием пищи ${action.payload.map(t => t.name).join(', ')}`
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
            state.success = `Successfully deleted feed with _id=${id}`
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

const createRequested = createAction('feed/createRequested')
const createFailed = createAction('feed/createFailed')
const updateRequested = createAction('feed/updateRequested')
const updateFailed = createAction('feed/updateFailed')
const deleteRequested = createAction('feed/deleteRequested')
const deleteFailed = createAction('feed/deleteFailed')

export const action = {

    create: createAsyncThunk(
        'feed/create',
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
        'feed/update',
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
        'feed/delete',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(deleteRequested(payload))
            try {
                console.log('store.feed.delete', payload)
                const content = await service.delete(payload)
                thunkAPI.dispatch(deleted(payload))
            } catch (error) {
                thunkAPI.dispatch(deleteFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        },
    ),

    getById: createAsyncThunk(
        'feed/getById',
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
        'feed/get',
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
        'feed/get',
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
    get: () => state => state.feed.entities,
    journal: () => state => state.feed.journal,
    byId: id => state => state.feed.entities.find(u => u._id === id),
    byDate: date => state => {
        const dateStart = getDateStart(date)
        const dateEnd = getDateEnd(date)
        return state.feed.entities.filter(t => {
            const trDate = new Date(t.date)
            return trDate >= dateStart && trDate <= dateEnd
        })
    },
    byDateGrouped: date => state => {
        const feedsGrouped = {}
        const dateStart = getDateStart(date)
        const dateEnd = getDateEnd(date)
        state.feed.entities
            .forEach(t => {
                const trDate = new Date(t.date)
                if (trDate >= dateStart && trDate <= dateEnd) {
                    if (!Object.keys(feedsGrouped).includes(t.date))
                        feedsGrouped[t.date] = []
                    feedsGrouped[t.date].push(t)
                }
            })
        return feedsGrouped
    },
    byDateExact: date => state => state.feed.entities.filter(t => t.date === date),
    isDataLoaded: () => state => state.feed.isDataLoaded,
    isLoading: () => state => state.feed.isLoading,
    error: () => state => state.feed.error,
    success: () => state => state.feed.success,
}

export default slice.reducer
