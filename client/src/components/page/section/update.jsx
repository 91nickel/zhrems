import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/section'

import SectionForm from 'components/ui/section/form'

const Update = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())
    const section = useSelector(selector.byId(id))

    const onSubmit = payload => {
        console.log('onSubmit()', payload)
        dispatch(action.update(payload))
            .unwrap()
            .then(() => navigate('../..'))
            .catch(error => console.error(error.message))
    }

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5">
                    <NavLink to="../.." className="btn btn-primary">
                        <i className="bi bi-caret-left"/>
                        Назад
                    </NavLink>
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 mt-5">
                    <h2>Редактировать раздел</h2>
                    <SectionForm type="update" startData={section} onSubmit={onSubmit}/>
                </div>
            </div>
        </>
    )
}

export default Update
