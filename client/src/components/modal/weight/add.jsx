import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import WeightForm from 'components/ui/weight/weightForm'

import { selector, action } from 'store/weight'
import { selector as userSelector } from 'store/user'
import { action as modalAction } from 'store/modal'


const ModalWeightAdd = ({date, user}) => {

    const dispatch = useDispatch()
    const {userId, isAdmin} = useSelector(userSelector.authData())
    const weights = useSelector(selector.get())

    const startData = {
        value: weights.length ? weights[0].value : 50,
    }

    function onSubmit (payload) {
        console.log('onSubmit()', payload)
        dispatch(action.create([{...payload, date, user}]))
            .unwrap()
            .then(res => {
                dispatch(modalAction.close())
            })
    }

    return <WeightForm startData={startData} onSubmit={onSubmit} onlyValue={true}/>

    return 'Undefined type'
}

ModalWeightAdd.propTypes = {
    date: PropTypes.string,
    user: PropTypes.string,
}

export default ModalWeightAdd
