import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'

import ProductForm from 'components/ui/form/productForm'
import Button from '../../common/buttons'
import NotFound from '../../../layouts/404'
import Forbidden from '../../../layouts/403'

const Update = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())
    const product = useSelector(selector.byId(id))

    async function onSubmit (payload) {
        // console.log('onSubmit()', payload)
        await dispatch(action.update(payload)).unwrap()
        navigate('../..')
    }

    if (!product)
        return <NotFound />

    if (product.user !== userId && !isAdmin)
        return <Forbidden/>

    return (
        <>
            <div className="row mb-3">
                <div className="col-6 col-lg-3">
                    <Button.Back to=".." />
                </div>
            </div>
            <h2>Редактирование продукта</h2>
            <ProductForm type="update" startData={product} onSubmit={onSubmit}/>
        </>
    )
}

export default Update
