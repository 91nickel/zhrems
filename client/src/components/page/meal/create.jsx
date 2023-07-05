import React from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { action as mealAction, selector as mealSelector } from 'store/meal'

import MealForm from 'components/ui/form/mealForm'
import ProductForm from 'components/ui/form/productForm'
import { action } from '../../../store/product'
import Button from '../../common/buttons'

const Create = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())

    async function onSubmit (payload) {
        console.log('Meal.create.onSubmit()', payload)
        await dispatch(mealAction.create(payload))
            .unwrap()
        navigate('..')
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-lg-3">
                    <Button.Back to=".." />
                </div>
            </div>
            <div className="w-100"></div>
            <h2>Добавление новой комбинации</h2>
            <MealForm type="create" startData={{}} onSubmit={onSubmit}/>
        </>
    )
}

export default Create
