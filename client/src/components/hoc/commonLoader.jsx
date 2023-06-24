import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import LoadingLayout from 'layouts/loading'

import { action as userAction, selector as userSelector } from 'store/user'
import { action as productAction, selector as productSelector } from 'store/product'
import { action as mealAction, selector as mealSelector } from 'store/meal'
import { action as weightAction, selector as weightSelector } from 'store/weight'
// import { action as transactionAction, selector as transactionSelector } from 'store/transaction'

const action = {
    user: userAction,
    product: productAction,
    meal: mealAction,
    weight: weightAction,
    // transaction: transactionAction,
}

const selector = {
    user: userSelector,
    product: productSelector,
    meal: mealSelector,
    weight: weightSelector,
    // transaction: transactionSelector,
}

const CommonLoader = ({entity, children}) => {

    if (!Object.keys(action).includes(entity) || !Object.keys(selector).includes(entity)) {
        console.error(`Entity ${entity} is not defined in CommonLoader`)
        return <LoadingLayout/>
    }

    const dispatch = useDispatch()
    const entities = useSelector(selector[entity].get())
    const loaded = useSelector(selector[entity].isDataLoaded())

    useEffect(() => {
        if (!loaded) {
            dispatch(action[entity].get())
        }
    }, [entities])

    if (!loaded)
        return <LoadingLayout/>

    return children
}

CommonLoader.propTypes = {
    entity: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}

export default CommonLoader
