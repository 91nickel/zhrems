import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'

import ProductForm from 'components/ui/form/productForm'
import Button from '../../common/buttons'

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
            <div className="row mb-3">
                <div className="col-6 col-lg-3">
                    <Button.Back to=".." />
                </div>
            </div>
            <div className="w-100"></div>
            <h2>Добавление нового продукта</h2>
            <ProductForm onSubmit={onSubmit}/>
        </>
    )
}

export default Create
