import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import ModalFeedForm from 'components/modal/feed/modalFeedForm'

import { selector, action } from 'store/feed'

const ModalFeedEdit = ({id}) => {

    const dispatch = useDispatch()
    const feed = useSelector(selector.byId(id))

    function onSubmit (payload) {
        console.log('onSubmit()', payload)
        dispatch(action.update([payload]))
            .unwrap()
            .then(res => {
                console.log('Success...', res)
            })
    }

    return <ModalFeedForm
        select={!!feed.product}
        type="update"
        startData={feed}
        onSubmit={onSubmit}
    />
}

ModalFeedEdit.propTypes = {
    id: PropTypes.string,
}

export default ModalFeedEdit
