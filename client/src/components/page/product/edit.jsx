import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import ProductEditForm from 'components/ui/productEditForm'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'

const Edit = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())
    const product = useSelector(selector.byId(id))

    const handleSubmit = (id) => {
        console.log('handleRemove', id)
        // dispatch(action.delete(id))
    }

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#">Navbar</a>
                            <button
                                className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
                                aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                                <div className="navbar-nav">
                                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                                    <a className="nav-link" href="#">Features</a>
                                    <a className="nav-link" href="#">Pricing</a>
                                    <a
                                        className="nav-link disabled" href="#" tabIndex="-1"
                                        aria-disabled="true">Disabled</a>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <NavLink to=".." className="btn btn-primary">
                        <i className="bi bi-caret-left"/>
                        Назад
                    </NavLink>
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 mt-5">
                    <ProductEditForm/>
                </div>
            </div>
        </>
    )
}

export default Edit
