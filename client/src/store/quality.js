import { createSlice } from '@reduxjs/toolkit'
import service from 'services/quality.service'

const slice = createSlice({
    name: 'quality',
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null,
    },
    reducers: {
        qualitiesRequested: (state) => {
            state.isLoading = true
        },
        qualitiesReceived: (state, action) => {
            state.entities = action.payload
            state.lastFetch = Date.now()
            state.isLoading = false
        },
        qualitiesRequestFailed: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
    }
})

const {reducer, actions} = slice
const {qualitiesRequested, qualitiesReceived, qualitiesRequestFailed} = actions

function isOutdated (date) {
    return Date.now() - date > 10 * 60 * 1000
}

export const loadQualitiesList = () => async (dispatch, getState) => {
    const {lastFetch} = getState().quality
    if (!isOutdated(lastFetch))
        return
    dispatch(qualitiesRequested())
    try {
        const {content} = await service.get()
        dispatch(qualitiesReceived(content))
    } catch (error) {
        dispatch(qualitiesRequestFailed(error.message))
    }
}

export const getQualities = () => state => state.quality.entities
export const getQualitiesIsLoading = () => state => state.quality.isLoading

export default reducer
