import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserReducer from 'store/user'
import ProductReducer from 'store/product'
import SectionReducer from 'store/section'
import MealReducer from 'store/meal'
import WeightReducer from 'store/weight'
import FeedReducer from 'store/feed'
import DateReducer from 'store/date'
import ModalReducer from 'store/modal'

const rootReducer = combineReducers({
    user: UserReducer,
    product: ProductReducer,
    section: SectionReducer,
    meal: MealReducer,
    weight: WeightReducer,
    feed: FeedReducer,
    date: DateReducer,
    modal: ModalReducer,
})

export function createStore () {
    return configureStore({
        reducer: rootReducer,
    })
}