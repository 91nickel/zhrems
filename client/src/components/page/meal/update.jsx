import React from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'

import MealForm from 'components/ui/form/mealForm'

import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector as mealSelector, action as mealAction } from 'store/meal'
import { selector as productSelector } from 'store/product'
import Button from '../../common/buttons'

const Update = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())
    const meal = useSelector(mealSelector.byId(id))

    async function onSubmit (payload) {
        console.log('Meal.update.onSubmit()', payload)
        await dispatch(mealAction.update({_id: id, ...payload})).unwrap()
        navigate('..')
    }

    return (
        <>
            <div className="row">
                <div className="col-6 col-lg-3">
                    <Button.Back to=".." />
                </div>
            </div>
            <h2>Редактирование комбинации</h2>
            <MealForm type="update" startData={meal} onSubmit={onSubmit}/>
        </>
    )
}

export default Update
