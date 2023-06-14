import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import Card from '../../ui/product/card'

const View = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())

    const product = useSelector(selector.byId())
    const isDataLoaded = useSelector(selector.isDataLoaded())

    const onRemove = () => dispatch(action.delete(id))

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5 d-flex justify-content-between">
                    <NavLink to=".." className="btn btn-primary">
                        <i className="bi bi-caret-left"/>
                        Назад
                    </NavLink>
                    <NavLink to="edit" className="btn btn-success">
                        <i className="bi bi-plus"/>
                        Добавить
                    </NavLink>
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 mt-5">

                </div>
            </div>
        </>
    )
}

export default View
