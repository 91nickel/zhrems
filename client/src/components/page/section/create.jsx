import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/section'
import SectionForm from 'components/ui/section/form'

const Create = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSubmit = payload => {
        dispatch(action.create(payload))
            .unwrap()
            .then(() => {
                setTimeout(() => navigate('../..', {replace: true}), 1000)
            })
            .catch(() => {
                console.log('Failed')
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
                <div className="col-12 col-md-6 mt-5">
                    <h2>Добавить раздел</h2>
                    <SectionForm type="create" onSubmit={handleSubmit}/>
                </div>
            </div>
        </>
    )
}

export default Create
