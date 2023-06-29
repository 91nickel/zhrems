import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-bootstrap/Modal'

import PropTypes from 'prop-types'

import TransactionEditForm from 'components/ui/transaction/productForm'
import { selector, action } from 'store/transaction'
import SelectField from '../common/form/selectField'
import DateTimeField from '../common/form/dateTimeField'
import { selector as dateSelector } from '../../store/date'
import { selector as userSelector } from '../../store/user'


const ModalTransactionEditor = ({id, show}) => {

    const dispatch = useDispatch()
    const transaction = useSelector(selector.byId(id))
    console.log(transaction)
    const users = useSelector(userSelector.get())
    const {userId, isAdmin} = useSelector(userSelector.authData())

    const [data, setData] = useState({...transaction})
    const [errors, setErrors] = useState({})

    function onChange (payload) {
        console.log('onChange()', payload)

    }

    function onSubmit (payload) {
        console.log('onSubmit()', payload)
        // dispatch(action.update([payload]))
        //     .unwrap()
        //     .then(res => {
        //         console.log('Success...', res)
        //     })
    }

    return (
        <Modal show={show} onHide={() => {
            console.log('onHide()')
        }}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form action="">
                    <SelectField
                        label="Пользователь"
                        name="user"
                        value={data.user}
                        error={errors.user}
                        options={Object.values(users).map(p => ({label: p.name, value: p._id}))}
                        onChange={onChange}
                        disabled={!isAdmin}
                    />
                    <DateTimeField
                        label="Дата/Время"
                        name="date"
                        value={new Date(data.date)}
                        error={errors.date}
                        onChange={onChange}
                    />
                    <TransactionEditForm product={transaction} onSubmit={onSubmit}/>
                </form>
            </Modal.Body>
        </Modal>
    )
}

ModalTransactionEditor.propTypes = {
    id: PropTypes.string,
    show: PropTypes.bool,
}

export default ModalTransactionEditor
