import React from 'react'
import { createSlice } from '@reduxjs/toolkit'
import { getDateEnd, getDateStart } from '../utils/date'

const slice = createSlice({
    name: 'modal',
    initialState: {
        opened: false,
        modalParams: {
            title: 'ModalTitle',
            body: ''
        },
        componentParams: {},
    },
    reducers: {
        opened: (state, action) => {
            state.opened = true
            state.modalParams = action.payload.modalParams
            state.componentParams = {...state.componentParams, ...action.payload.componentParams}
        },
        closed: (state, action) => {
            state.opened = false
        },
        componentParamsReceived: (state, action) => {
            state.startData = {...state.startData, ...action.payload}
        },
        componentParamsDeleted: (state, action) => {
            const newStartData = {...state.startData}
            delete newStartData[name]
            state.startData = {...newStartData}
        },
    }
})

const {opened, closed, componentParamsReceived, componentParamsDeleted} = slice.actions

export const action = {
    open: (modalParams, componentParams) => dispatch => {
        dispatch(opened({modalParams, componentParams}))
    },
    close: () => dispatch => {
        dispatch(closed())
    },
    setComponentParams: (name, data) => (dispatch, getState) => {
        dispatch(componentParamsReceived({[name]: data}))
    },
    unsetStartData: name => (dispatch, getState) => {
        dispatch(componentParamsDeleted(name))
    },
}

export const selector = {
    isOpened: () => state => state.modal.opened,
    params: () => state => state.modal.modalParams,
    componentParams: () => state => state.modal.componentParams,
}

export default slice.reducer
