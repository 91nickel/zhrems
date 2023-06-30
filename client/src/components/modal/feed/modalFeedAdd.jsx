import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import ModalFeedForm from 'components/modal/feed/modalFeedForm'

import { selector, action } from 'store/feed'
import { selector as userSelector } from 'store/user'
import { action as modalAction } from 'store/modal'

import FEED_METHODS from 'components/modal/feed/methods'

const ModalFeedAdd = ({method, date, user}) => {

    const dispatch = useDispatch()

    function onSubmit (payload) {
        // console.log('onSubmit()', payload)
        dispatch(action.update([{...payload, date, user}]))
            .unwrap()
            .then(res => {
                dispatch(modalAction.close())
            })
    }

    if (method === FEED_METHODS.NEW)
        return <ModalFeedForm select={false} onSubmit={onSubmit} />

    if (method === FEED_METHODS.SELECT)
        return <ModalFeedForm select={true} onSubmit={onSubmit} />

    if (method === FEED_METHODS.MEAL)
        return <ModalFeedForm select={false} onSubmit={onSubmit} />

    return 'Undefined type'
}

ModalFeedAdd.propTypes = {
    method: PropTypes.string,
    date: PropTypes.string,
    user: PropTypes.string,
}

export default ModalFeedAdd
