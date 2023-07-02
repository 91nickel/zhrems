import React from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { action as mealAction, selector as mealSelector } from 'store/meal'

import MealForm from 'components/ui/meal/form'
import ProductForm from 'components/ui/product/form'

const Create = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())

    const onSubmit = payload => {
        console.log('Meal.create.onSubmit()', payload)
        dispatch(mealAction.create(payload))
            .unwrap()
            .then(() => navigate('..'))
            .catch(error => console.error(error.message))
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
                    <h2>Добавление новой комбинации</h2>
                    <MealForm type="create" startData={{}} onSubmit={onSubmit}/>
                </div>
            </div>
        </>
    )
}

export default Create
