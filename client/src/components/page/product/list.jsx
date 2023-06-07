import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'

const List = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())

    const products = useSelector(selector.getAll())
    const isDataLoaded = useSelector(selector.isDataLoaded())

    const handleEdit = (id) => {
        console.log('handleEdit', id)
        navigate(id + '/edit')
    }

    const handleRemove = (id) => {
        console.log('handleRemove', id)
        // dispatch(action.delete(id))
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
                    {!isDataLoaded && 'Loading..'}
                    {
                        isDataLoaded
                        && products.length
                        && products.map(p => {
                            return (
                                <div key={p._id} className="card mb-2">
                                    <div className="card-header d-flex justify-content-between">
                                        <h6>{p.name}</h6>
                                        {
                                            (userId === p.user || isAdmin)
                                            && <div className="controls">
                                                <button
                                                    className="btn btn-sm btn-warning mx-1"
                                                    onClick={() => handleEdit(p._id)}>
                                                    <i className="bi bi-pencil-square" style={{width: '1rem', height: '1rem'}}></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger mx-1"
                                                    onClick={() => handleRemove(p._id)}>
                                                    <i className="bi bi-x-square" style={{width: '1rem', height: '1rem'}}></i>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    <div className="card-body container-fluid">
                                        <div className="row">
                                            <div className="col-6">
                                                {p._id && <p>ID: {p._id}</p>}
                                                {p.desc && <p>{p.desc}</p>}
                                            </div>
                                            <div className="col-6">
                                                <h5 className="energy d-flex justify-content-end ">
                                                    <span className="badge bg-info mx-1">{p.proteins}</span>
                                                    <span className="badge bg-warning mx-1">{p.fats}</span>
                                                    <span className="badge bg-success mx-1">{p.carbohydrates}</span>
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {isDataLoaded && !products.length && 'Product list is empty'}
                </div>
            </div>
        </>
    )
}

export default List
