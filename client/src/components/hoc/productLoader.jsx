import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import LoadingLayout from 'layouts/loading'
import { action, selector } from 'store/user'

const ProductLoader = ({children}) => {
    // const {id} = useParams()
    const dispatch = useDispatch()

    const loaded = useSelector(selector.isDataLoaded())

    useEffect(() => {
        dispatch(action.get())
    }, [])

    if (!loaded)
        return <LoadingLayout/>

    return children
}

ProductLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}
export default ProductLoader