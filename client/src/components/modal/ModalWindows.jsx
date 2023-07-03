import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from 'react-bootstrap/Modal'

import PropTypes from 'prop-types'

import { selector, action } from 'store/modal'

import ModalFeedUpdate from 'components/modal/feed/modalFeedUpdate'
import ModalFeedCreate from './feed/modalFeedCreate'
import ModalWeightAdd from 'components/modal/weight/add'
import ModalWeightUpdate from 'components/modal/weight/update'

import FEED_METHODS from 'components/modal/feed/methods'
import WEIGHT_METHODS from 'components/modal/weight/methods'

const ModalWindows = ({children}) => {

    const dispatch = useDispatch()
    const isOpened = useSelector(selector.isOpened())
    const modalParams = useSelector(selector.params())
    const componentParams = useSelector(selector.componentParams())

    function onClose (payload) {
        dispatch(action.close())
    }

    return (
        <Modal show={isOpened} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{modalParams.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    modalParams.body === FEED_METHODS.UPDATE
                    && <ModalFeedUpdate {...componentParams} />
                }
                {
                    [FEED_METHODS.NEW, FEED_METHODS.SELECT, FEED_METHODS.MEAL].includes(modalParams.body)
                    && <ModalFeedCreate {...componentParams} />
                }
                {
                    modalParams.body === WEIGHT_METHODS.ADD
                    && <ModalWeightAdd {...componentParams} />
                }
                {
                    modalParams.body === WEIGHT_METHODS.UPDATE
                    && <ModalWeightUpdate {...componentParams} />
                }
            </Modal.Body>
        </Modal>
    )
}

ModalWindows.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
}

export default ModalWindows
