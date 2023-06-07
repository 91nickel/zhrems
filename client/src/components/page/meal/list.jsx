import React from 'react'
import { NavLink } from 'react-router-dom'

const List = () => {
    return (
        <>
            <div className="col-12 mt-5">
                <NavLink to=".." className="btn btn-primary">
                    <i className="bi bi-caret-left"/>
                    Назад
                </NavLink>
            </div>
            <div className="col-12 mt-5 d-flex justify-content-center">
                <div className="card w-50">
                    <div className="card-body">
                        ProductListPage
                    </div>
                </div>
            </div>
        </>
    )
}

export default List
