import React, { useEffect } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector, action } from 'store/feed'
import { selector as authSelector } from 'store/user'
import Form from 'components/ui/feed/form'
import LoadingLayout from 'layouts/loading'

const Update = () => {
    const params = useParams()
    const date = new Date(params.date)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const journal = useSelector(selector.journal())

    useEffect(() => {
        if (typeof journal[date.toLocaleDateString('fr-CA')] === 'undefined')
            dispatch(action.getByDate(date))
    }, [])

    if (typeof journal[date.toLocaleDateString('fr-CA')] === 'undefined')
        return <LoadingLayout/>

    const onSubmit = payload => {
        console.log('update.onSubmit()', payload)
        dispatch(action.update(payload))
            .unwrap()
            .then(() => {
                setTimeout(() => navigate('../..', {replace: true}), 1000)
            })
            .catch(() => {
                console.log('Failed')
            })
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-6 mt-5">
                <NavLink to="../.." className="btn btn-primary">
                    <i className="bi bi-caret-left"/>
                    Назад
                </NavLink>
            </div>
            <div className="w-100"></div>
            <div className="col-12 col-md-6 mt-5">
                <Form type="update" onSubmit={onSubmit}/>
            </div>
        </div>
    )
}

export default Update
