import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'

import ProductForm from 'components/ui/form/productForm'

const Create = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function onSubmit (payload) {
        await dispatch(action.create(payload))
            .unwrap()
        setTimeout(() => navigate('..', {replace: true}), 1000)
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
                    <ProductForm onSubmit={onSubmit}/>
                </div>
            </div>
        </>
    )
}

export default Create
