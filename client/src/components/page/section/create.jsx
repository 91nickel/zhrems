import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/section'
import SectionForm from 'components/ui/form/sectionForm'

const Create = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function onSubmit (payload) {
        await dispatch(action.create(payload)).unwrap()
        setTimeout(() => navigate('../..', {replace: true}), 1000)
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
                    <SectionForm type="create" onSubmit={onSubmit}/>
                </div>
            </div>
        </>
    )
}

export default Create
