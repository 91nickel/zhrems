import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserReducer from 'store/user'
import ProductReducer from 'store/product'
import MealReducer from 'store/meal'
import WeightReducer from 'store/weight'

const rootReducer = combineReducers({
    user: UserReducer,
    product: ProductReducer,
    meal: MealReducer,
    weight: WeightReducer,
})

export function createStore () {
    return configureStore({
        reducer: rootReducer,
    })
}