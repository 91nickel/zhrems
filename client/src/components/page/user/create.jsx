import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import UserForm from 'components/ui/form/userForm'
import { selector, action } from 'store/user'
import Button from '../../common/buttons'

const Create = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function onSubmit (payload) {
        await dispatch(action.create(payload)).unwrap()
        setTimeout(() => navigate('..', {replace: true}), 1000)
    }

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5">
                    <Button.Back to=".." />
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 mt-5">
                    <h2>Добавление нового пользователя</h2>
                    <UserForm onSubmit={onSubmit}/>
                </div>
            </div>
        </>
    )
}

export default Create
