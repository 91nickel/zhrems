import { combineReducers, configureStore } from '@reduxjs/toolkit'
import QualityReducer from 'store/quality'
import ProfessionReducer from 'store/profession'
import UserReducer from 'store/user'
import CommentReducer from 'store/comment'

const rootReducer = combineReducers({
    quality: QualityReducer,
    profession: ProfessionReducer,
    user: UserReducer,
    comment: CommentReducer,
})

export function createStore () {
    return configureStore({
        reducer: rootReducer,
    })
}