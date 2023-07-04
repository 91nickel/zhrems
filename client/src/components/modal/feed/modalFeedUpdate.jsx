import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import ModalFeedFromProductForm from 'components/modal/feed/modalFeedFromProductForm'

import { selector, action } from 'store/feed'
import { action as modalAction } from 'store/modal'

const ModalFeedUpdate = ({id}) => {

    const dispatch = useDispatch()
    const feed = useSelector(selector.byId(id))

    function onSubmit (payload) {
        // console.log('onSubmit()', feed, payload)
        dispatch(action.update(payload))
            .unwrap()
            .then(res => {
                dispatch(modalAction.close())
            })
    }

    return <ModalFeedFromProductForm
        type="update"
        select={!!feed.product}
        startData={feed}
        onSubmit={onSubmit}
    />
}

ModalFeedUpdate.propTypes = {
    id: PropTypes.string,
}

export default ModalFeedUpdate
