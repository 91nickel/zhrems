import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import FeedFromProductForm from 'components/ui/form/feedFromProductForm'

import { selector as feedSelector, action as feedAction } from 'store/feed'
import { selector as productSelector, action as productAction } from 'store/product'
import { action as modalAction } from 'store/modal'

const ModalFeedUpdate = ({id}) => {

    const dispatch = useDispatch()
    const feed = useSelector(feedSelector.byId(id))
    const product = useSelector(productSelector.byId(feed.product))

    async function onSubmit ([payload]) {
        console.log('onSubmit()', payload)
        payload._id = id
        if (payload.save) {
            const product = await dispatch(productAction.create({...payload, _id: null})).unwrap()
            payload.product = product._id
        }
        await dispatch(feedAction.update([payload])).unwrap()
        dispatch(modalAction.close())
    }

    return <FeedFromProductForm
        type="update"
        select={!!product}
        startData={{...feed, product: product?._id}}
        onSubmit={onSubmit}
    />
}

ModalFeedUpdate.propTypes = {
    id: PropTypes.string,
}

export default ModalFeedUpdate
