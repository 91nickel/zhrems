import React from 'react'
import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
    name: 'date',
    initialState: {
        value: (new Date).toISOString(),
    },
    reducers: {
        set: (state, action) => {
            state.value = action.payload
        },
    }
})

const {set} = slice.actions

export const action = {
    set: date => dispatch => {
        dispatch(set(date.toISOString()))
    },
    increment: date => (dispatch, getState) => {
        const date = new Date(getState().date.value)
        date.setDate(date.getDate() + 1)
        dispatch(set(date.toISOString()))
    },
    decrement: date => (dispatch, getState) => {
        const date = new Date(getState().date.value)
        date.setDate(date.getDate() - 1)
        dispatch(set(date.toISOString()))
    },
}

export const selector = {
    get: () => state => new Date(state.date.value),
}

export default slice.reducer
