import React from 'react'
import { createAction, createSlice } from '@reduxjs/toolkit'
import userService from 'services/user.service'
import authService from 'services/auth.service'
import localStorageService from 'services/localStorage.service'

import generateAuthError from 'utils/generateAuthError'

const slice = createSlice({
    name: 'user',
    initialState: {
        entities: null,
        isLoading: false,
        error: null,
        auth: null,
        isProcessingAuth: true,
        isAuthorized: false,
        isDataLoaded: false,
    },
    reducers: {
        userCreated: (state, action) => {
            state.entities.push(action.payload)
        },
        userUpdated: (state, action) => {
            const updatedUser = action.payload
            state.entities = state.entities.map(user => {
                if (user._id === updatedUser._id)
                    return updatedUser
                return user
            })
        },
        usersRequested: (state) => {
            state.isLoading = true
        },
        usersReceived: (state, action) => {
            state.entities = action.payload
            state.isLoading = false
            state.isDataLoaded = true
        },
        usersRequestFailed: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
        authRequested: (state) => {
            state.isProcessingAuth = true
            state.error = null
        },
        authRequestSuccess: (state, action) => {
            state.auth = action.payload
            state.isAuthorized = true
            state.isProcessingAuth = false
        },
        authRequestFailed: (state, action) => {
            state.error = action.payload
            state.isProcessingAuth = false
        },
        loggedOut: (state,) => {
            state.auth = null
            state.isAuthorized = false
            state.isDataLoaded = false
            state.entities = null
        },
    }
})

const {reducer, actions} = slice
const {
    userCreated,
    userUpdated,
    usersRequested,
    usersReceived,
    usersRequestFailed,
    authRequested,
    authRequestSuccess,
    authRequestFailed,
    loggedOut,
} = actions

const userCreateRequested = createAction('user/userCreateRequested')
const userCreateFailed = createAction('user/userCreateFailed')
const userUpdateRequested = createAction('user/userUpdateRequested')
const userUpdateFailed = createAction('user/userUpdateFailed')

export const setAuth = () => async (dispatch, getState) => {
    console.log('state.user.setAuth()',
        {
            accessToken: localStorageService.getAccessToken(),
            refreshToken: localStorageService.getRefreshToken(),
            expiration: localStorageService.getTokenExpirationDate(),
            stateIsAuthorized: getState().user.isAuthorized,
        }
    )
    const state = getState().user
    dispatch(authRequested())
    if (localStorageService.getAccessToken() && !state.isAuthorized) {
        try {
            const user = await userService.getCurrentUser()
            dispatch(authRequestSuccess({userId: user._id}))
        } catch (error) {
            dispatch(authRequestFailed(error.message))
        }
    } else {
        dispatch(authRequestFailed(null))
    }
}

export const signIn = ({payload, redirect}) => async dispatch => {
    const {email, password} = payload
    dispatch(authRequested())
    try {
        const data = await authService.login({email, password})
        dispatch(authRequestSuccess({userId: data.localId}))
        localStorageService.setTokens(data)
    } catch (error) {
        console.error(error)
        const {code, message} = error?.response?.data?.error
        if (code === 400) {
            const errorMessage = generateAuthError(message)
            dispatch(authRequestFailed(generateAuthError(errorMessage)))
        } else {
            dispatch(authRequestFailed(message))
        }
    }
}

export const signUp = ({email, password, ...rest}) => async dispatch => {
    dispatch(authRequested())
    try {
        const data = await authService.register({email, password, ...rest})
        localStorageService.setTokens(data)
        dispatch(authRequestSuccess({userId: data.localId}))
    } catch (error) {
        dispatch(authRequestFailed(error.message))
    }
}

function createUser (payload) {
    return async function (dispatch) {
        dispatch(userCreateRequested(payload))
        try {
            const {content} = await userService.create(payload)
            dispatch(userCreated(content))
        } catch (error) {
            dispatch(userCreateFailed(error.message))
        }
    }
}

export const logOut = () => {
    return function (dispatch) {
        localStorageService.removeAuthData()
        dispatch(loggedOut())
    }
}

export const updateUser = (payload) => async dispatch => {
    dispatch(userUpdateRequested(payload))
    try {
        const {content} = await userService.update(payload)
        dispatch(userUpdated(content))
    } catch (error) {
        dispatch(userUpdateFailed(error.message))
    }
}

export const loadUsersList = () => async (dispatch) => {
    dispatch(usersRequested())
    try {
        const {content} = await userService.get()
        dispatch(usersReceived(content))
    } catch (error) {
        dispatch(usersRequestFailed(error.message))
    }
}

export const getCurrentUser = () => state => {
    if (state.user.isDataLoaded && state.user.auth)
        return state.user.entities.find(u => u._id === state.user.auth.userId)
    return null
}

export const getUser = (id) => state => state.user?.entities.find(u => u._id === id)
export const getUsers = () => state => state.user.entities
export const getUsersIsLoading = () => state => state.user.isLoading
export const getUsersIsAuthorized = () => state => state.user.isAuthorized
export const getUsersIsDataLoaded = () => state => state.user.isDataLoaded
export const getUsersIsProcessingAuth = () => state => state.user.isProcessingAuth
export const getAuthErrors = () => state => state.user.error

export default reducer
