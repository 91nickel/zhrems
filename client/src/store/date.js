import React from 'react'
import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
    name: 'date',
    initialState: {
        current: (new Date).toISOString(),
        prev: (new Date(Date.now() - 24 * 60 * 60)).toISOString(),
        next: (new Date(Date.now() + 24 * 60 * 60)).toISOString(),
    },
    reducers: {
        setCurrent: (state, action) => {
            state.current = action.payload
        },
        setPrev: (state, action) => {
            state.prev = action.payload
        },
        setNext: (state, action) => {
            state.next = action.payload
        },
    }
})

const {setCurrent, setPrev, setNext} = slice.actions

export const action = {
    set: date => dispatch => {
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        dispatch(setCurrent(date.toISOString()))
        date.setDate(date.getDate() + 1)
        dispatch(setNext(date.toISOString()))
        date.setDate(date.getDate() - 2)
        dispatch(setPrev(date.toISOString()))
    },
    increment: date => (dispatch, getState) => {
        const date = new Date(getState().date.current)
        date.setDate(date.getDate() + 1)
        dispatch(set(date.toISOString()))
    },
    decrement: date => (dispatch, getState) => {
        const date = new Date(getState().date.current)
        date.setDate(date.getDate() - 1)
        dispatch(set(date.toISOString()))
    },
}

export const selector = {
    get: () => state => new Date(state.date.current),
    prev: () => state => new Date(state.date.prev),
    next: () => state => new Date(state.date.next),
}

export default slice.reducer
