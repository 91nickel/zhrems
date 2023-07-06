import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import WeightForm from 'components/ui/form/weightForm'

import { selector, action } from 'store/weight'
import { selector as userSelector } from 'store/user'
import { action as modalAction } from 'store/modal'

const ModalWeightUpdate = ({id}) => {

    const dispatch = useDispatch()
    const weight = useSelector(selector.byId(id))

    function onSubmit (payload) {
        // console.log('onSubmit()', payload)
        dispatch(action.update(payload))
            .unwrap()
            .then(res => {
                dispatch(modalAction.close())
            })
    }

    return <WeightForm
        type="update"
        startData={weight}
        onSubmit={onSubmit}
        onlyValue={true}
    />
}

ModalWeightUpdate.propTypes = {
    id: PropTypes.string,
}

export default ModalWeightUpdate
