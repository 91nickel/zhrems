import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import Form from 'components/ui/product/form'

const Create = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSubmit = payload => {
        dispatch(action.create(payload))
            .unwrap()
            .then(() => {
                setTimeout(() => navigate('..', {replace: true}), 1000)
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
                    <h2>Добавление нового продукта</h2>
                    <Form onSubmit={handleSubmit}/>
                </div>
            </div>
        </>
    )
}

export default Create
