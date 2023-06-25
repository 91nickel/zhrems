import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserReducer from 'store/user'
import ProductReducer from 'store/product'
import MealReducer from 'store/meal'
import WeightReducer from 'store/weight'
import TransactionReducer from 'store/transaction'
import DateReducer from 'store/date'

const rootReducer = combineReducers({
    user: UserReducer,
    product: ProductReducer,
    meal: MealReducer,
    weight: WeightReducer,
    transaction: TransactionReducer,
    date: DateReducer,
})

export function createStore () {
    return configureStore({
        reducer: rootReducer,
    })
}