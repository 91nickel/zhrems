import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import FeedFromProductForm from 'components/ui/form/feedFromProductForm'
import FeedFromMealForm from 'components/ui/form/feedFromMealForm'

import { action as feedAction} from 'store/feed'
import { action as productAction } from 'store/product'
import { selector as userSelector } from 'store/user'
import { action as modalAction } from 'store/modal'

import FEED_METHODS from 'components/modal/feed/methods'

const ModalFeedCreate = ({method, date, user}) => {

    const dispatch = useDispatch()

    async function onSubmit (payload) {
        console.log('onSubmit()', payload)
        if (method === FEED_METHODS.NEW && payload[0].save) {
            const productPayload = {...payload[0], user, _id: null}
            const product = await dispatch(productAction.create(productPayload)).unwrap()
            payload[0] = {...payload[0], product: product._id}
        }

        await dispatch(feedAction.create(payload.map(feed => ({...feed, date, user})))).unwrap()
        dispatch(modalAction.close())
    }

    if (method === FEED_METHODS.NEW)
        return <FeedFromProductForm select={false} onSubmit={onSubmit}/>

    if (method === FEED_METHODS.SELECT)
        return <FeedFromProductForm select={true} onSubmit={onSubmit}/>

    if (method === FEED_METHODS.MEAL)
        return <FeedFromMealForm onSubmit={onSubmit}/>

    return 'Undefined type'
}

ModalFeedCreate.propTypes = {
    method: PropTypes.string,
    date: PropTypes.string,
    user: PropTypes.string,
}

export default ModalFeedCreate
