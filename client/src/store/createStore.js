import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserReducer from 'store/user'
// import QualityReducer from 'store/quality'
// import ProfessionReducer from 'store/profession'
// import CommentReducer from 'store/comment'

const rootReducer = combineReducers({
    user: UserReducer,

    // quality: QualityReducer,
    // profession: ProfessionReducer,
    // comment: CommentReducer,
})

export function createStore () {
    return configureStore({
        reducer: rootReducer,
    })
}