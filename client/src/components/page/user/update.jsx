import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import UserForm from 'components/ui/userForm'
import { selector, action } from 'store/user'

const Update = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const profile = useSelector(selector.byId(id))
    const {userId, isAdmin} = useSelector(selector.authData())
    // const product = useSelector(selector.byId(id))

    const onSubmit = async formData => {
        const payload = {}
        Object.keys(formData).forEach(key => {
            if ((typeof profile[key] !== 'undefined' && profile[key] !== formData[key]) || key === 'password')
                payload[key] = formData[key]
        })
        console.log('user.update.submit()', payload)
        dispatch(action.update({_id: id, ...payload}))
            .unwrap()
            .then(result => {
                navigate('..')
            })
            .catch(error => {
                console.error(error.message)
            })
    }

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5">
                    <NavLink to=".." className="btn btn-primary">
                        <i className="bi bi-caret-left"/>
                        Назад
                    </NavLink>
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 mt-5 d-flex justify-content-center">
                    <div className="card w-100">
                        <div className="card-body">
                            <UserForm onSubmit={onSubmit}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Update
