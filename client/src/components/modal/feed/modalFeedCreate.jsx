import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import ModalFeedFromProductForm from 'components/modal/feed/modalFeedFromProductForm'
import ModalFeedFromMealForm from 'components/modal/feed/modalFeedFromMealForm'

import { selector, action } from 'store/feed'
import { selector as userSelector } from 'store/user'
import { action as modalAction } from 'store/modal'

import FEED_METHODS from 'components/modal/feed/methods'

const ModalFeedCreate = ({method, date, user}) => {

    const dispatch = useDispatch()

    function onSubmit (payload) {
        console.log('onSubmit()', payload)
        dispatch(action.create(payload.map(feed => ({...feed,  date, user}))))
            .unwrap()
            .then(res => {
                dispatch(modalAction.close())
            })
    }

    if (method === FEED_METHODS.NEW)
        return <ModalFeedFromProductForm select={false} onSubmit={onSubmit} />

    if (method === FEED_METHODS.SELECT)
        return <ModalFeedFromProductForm select={true} onSubmit={onSubmit} />

    if (method === FEED_METHODS.MEAL)
        return <ModalFeedFromMealForm onSubmit={onSubmit} />

    return 'Undefined type'
}

ModalFeedCreate.propTypes = {
    method: PropTypes.string,
    date: PropTypes.string,
    user: PropTypes.string,
}

export default ModalFeedCreate
