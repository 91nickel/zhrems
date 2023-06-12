import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import ProductForm from 'components/ui/productForm'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'

const Update = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())
    // const product = useSelector(selector.byId(id))

    const handleSubmit = payload => {
        dispatch(action.update(payload))
    }

    console.log('Product.Update')

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
                    <h2>Редактирование продукта</h2>
                    <ProductForm onSubmit={handleSubmit}/>
                </div>
            </div>
        </>
    )
}

export default Update
