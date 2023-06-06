import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserReducer from 'store/user'
import ProductReducer from 'store/product'
import MealReducer from 'store/meal'

const rootReducer = combineReducers({
    user: UserReducer,
    product: ProductReducer,
    meal: MealReducer,
})

export function createStore () {
    return configureStore({
        reducer: rootReducer,
    })
}