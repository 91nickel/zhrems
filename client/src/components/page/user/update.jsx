import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as userSelector, action as userAction } from 'store/user'

import Button from 'components/common/buttons'
import UserForm from 'components/ui/form/userForm'
import NotFound from 'layouts/404'
import Forbidden from 'layouts/403'

const Update = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const profile = useSelector(userSelector.byId(id))
    const {userId, isAdmin} = useSelector(userSelector.authData())

    async function onSubmit (payload) {
        await dispatch(userAction.update(payload)).unwrap()
        navigate('..')
    }

    if (!profile)
        return <NotFound />

    if (profile._id !== userId && !isAdmin)
        return <Forbidden/>

    return (
        <>
            <div className="row mb-3">
                <div className="col-6 col-lg-3">
                    <Button.Back to="/" />
                </div>
            </div>
            <div className="card w-100">
                <div className="card-body">
                    <UserForm type="update" startData={profile} onSubmit={onSubmit}/>
                </div>
            </div>
        </>
    )
}

export default Update
