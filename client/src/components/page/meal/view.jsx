import React from 'react'
import { Link, useParams } from 'react-router-dom'

const View = () => {
    const {id} = useParams()

    return (
        <>
            <div className="col-12 mt-5">
                <Link to=".." className="btn btn-primary">
                    <i className="bi bi-caret-left"/>
                    Назад
                </Link>
            </div>
            <div className="col-12 mt-5 d-flex justify-content-center">
                <div className="card w-50">
                    <div className="card-body">
                        Product view page
                    </div>
                </div>
            </div>
        </>
    )
}

export default View
