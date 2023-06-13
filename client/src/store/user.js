import React from 'react'
import { createAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import userService from 'services/user.service'
import authService from 'services/auth.service'
import productService from 'services/product.service'
import localStorageService from 'services/localStorage.service'

import generateAuthError from 'utils/generateAuthError'

const slice = createSlice({
    name: 'user',
    initialState: {
        entities: [],
        isLoading: false,
        error: null,
        auth: {userId: null, isAdmin: false},
        user: {},
        isProcessingAuth: true,
        isAuthorized: null,
        isDataLoaded: false,
    },
    reducers: {
        created: (state, action) => {
            state.entities.push(action.payload)
        },
        updated: (state, action) => {
            const updatedUser = action.payload
            state.entities = state.entities.map(user => {
                if (user._id === updatedUser._id)
                    return updatedUser
                return user
            })
        },
        requested: (state) => {
            state.isLoading = true
        },
        received: (state, action) => {
            state.entities = action.payload
            state.isLoading = false
            state.isDataLoaded = true
        },
        requestFailed: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
        authRequested: (state) => {
            state.isProcessingAuth = true
            state.error = null
        },
        authRequestSuccess: (state, action) => {
            state.auth = {
                userId: action.payload._id,
                accountId: action.payload.account,
                isAdmin: action.payload.isAdmin,
            }
            state.user = action.payload
            state.entities = [...state.entities, action.payload]
            state.isAuthorized = true
            state.isProcessingAuth = false
        },
        authRequestFailed: (state, action) => {
            state.error = action.payload
            state.isAuthorized = false
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

const {
    created,
    updated,
    requested,
    received,
    requestFailed,
    authRequested,
    authRequestSuccess,
    authRequestFailed,
    loggedOut,
} = slice.actions

const userCreateRequested = createAction('user/userCreateRequested')
const userCreateFailed = createAction('user/userCreateFailed')
const userUpdateRequested = createAction('user/userUpdateRequested')
const userUpdateFailed = createAction('user/userUpdateFailed')

function createUser (payload) {
    return async function (dispatch) {
        dispatch(userCreateRequested(payload))
        try {
            const {content} = await userService.create(payload)
            dispatch(created(content))
        } catch (error) {
            dispatch(userCreateFailed(error.message))
        }
    }
}

export const action = {

    get: createAsyncThunk(
        'user/signin',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(requested())
            try {
                const content = await userService.get()
                thunkAPI.dispatch(received(content))
                return content
            } catch (error) {
                thunkAPI.dispatch(requestFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    ),

    update: createAsyncThunk(
        'user/update',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(userUpdateRequested(payload))
            try {
                console.log('user/update', payload)
                const content = await userService.update(payload)
                console.log(content)
                thunkAPI.dispatch(updated(content))
                return content
            } catch (error) {
                thunkAPI.dispatch(userUpdateFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    ),

    setAuth: () => async (dispatch, getState) => {
        // console.log('state.user.setAuth()',
        //     {
        //         accessToken: localStorageService.getAccessToken(),
        //         refreshToken: localStorageService.getRefreshToken(),
        //         expiration: localStorageService.getTokenExpirationDate(),
        //         stateIsAuthorized: getState().user.isAuthorized,
        //     }
        // )
        const state = getState().user
        dispatch(authRequested())
        if (localStorageService.getAccessToken() && !state.isAuthorized) {
            try {
                const user = await userService.getCurrentUser()
                setTimeout(() => dispatch(authRequestSuccess(user)), 1000)
            } catch (error) {
                dispatch(authRequestFailed(error.message))
            }
        } else {
            dispatch(authRequestFailed(null))
        }
    },

    signIn: createAsyncThunk(
        'user/signin',
        async ({email, password}, thunkAPI) => {
            // console.log('user/signin', email, password)
            thunkAPI.dispatch(authRequested())
            try {
                const tokens = await authService.login({email, password})
                localStorageService.setTokens(tokens)
                const user = await userService.getCurrentUser()
                thunkAPI.dispatch(authRequestSuccess(user))
                return {user, tokens}
            } catch (error) {
                console.error(error)
                const {code, message} = error?.response?.data?.error
                if (code === 400) {
                    const errorMessage = generateAuthError(message)
                    thunkAPI.dispatch(authRequestFailed(generateAuthError(errorMessage)))
                } else {
                    thunkAPI.dispatch(authRequestFailed(message))
                }
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    ),

    signUp: createAsyncThunk(
        'user/signup',
        async ({email, password, ...rest}, thunkAPI) => {
            thunkAPI.dispatch(authRequested())
            try {
                const tokens = await authService.register({email, password, ...rest})
                localStorageService.setTokens(tokens)
                const user = await userService.getCurrentUser()
                thunkAPI.dispatch(authRequestSuccess(user))
                return {user, tokens}
            } catch (error) {
                thunkAPI.dispatch(authRequestFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        },
    ),

    logOut: createAsyncThunk(
        'user/logout',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(requested())
            try {
                const content = await authService.logout()
                localStorageService.removeAuthData()
                thunkAPI.dispatch(loggedOut())
                return content
            } catch (error) {
                thunkAPI.dispatch(requestFailed(error.message))
                return thunkAPI.rejectWithValue(error.message)
            }
        },
    ),

}

export const selector = {
    all: () => state => state.user.entities,
    byId: id => state => state.user?.entities.find(u => u._id === id),
    current: id => state => state.user.user,
    isLoading: () => state => state.user.isLoading,
    isAuthorized: () => state => state.user.isAuthorized,
    isDataLoaded: () => state => state.user.isDataLoaded,
    isProcessingAuth: () => state => state.user.isProcessingAuth,
    authErrors: () => state => state.user.error,
    authData: () => state => state.user.auth,
}

export default slice.reducer
