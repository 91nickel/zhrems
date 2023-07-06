import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import UserForm from 'components/ui/form/userForm'
import { selector as userSelector, action as userAction } from 'store/user'
import Button from 'components/common/buttons'
import Forbidden from 'layouts/403'

const Create = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {userId, isAdmin} = useSelector(userSelector.authData())

    async function onSubmit (payload) {
        await dispatch(userAction.create(payload)).unwrap()
        setTimeout(() => navigate('..', {replace: true}), 1000)
    }

    if (!isAdmin)
        return <Forbidden/>

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
