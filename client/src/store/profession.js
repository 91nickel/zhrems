import { createSlice } from '@reduxjs/toolkit'
import service from 'services/profession.service'

const slice = createSlice({
    name: 'profession',
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null,
    },
    reducers: {
        professionsRequested: (state) => {
            state.isLoading = true
        },
        professionsReceived: (state, action) => {
            state.entities = action.payload
            state.lastFetch = Date.now()
            state.isLoading = false
        },
        professionsRequestFailed: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
    }
})

const {reducer, actions} = slice
const {professionsRequested, professionsReceived, professionsRequestFailed} = actions

function isOutdated (date) {
    return Date.now() - date > 10 * 60 * 1000
}

export const loadProfessionsList = () => async (dispatch, getState) => {
    const {lastFetch} = getState().profession
    if (!isOutdated(lastFetch))
        return
    dispatch(professionsRequested())
    try {
        const {content} = await service.get()
        dispatch(professionsReceived(content))
    } catch (error) {
        dispatch(professionsRequestFailed(error.message))
    }
}

export const getProfessions = () => state => state.profession.entities
export const getProfessionsIsLoading = () => state => state.profession.isLoading

export default reducer
