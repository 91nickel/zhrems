import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selector, action } from 'store/user'
import LoadingLayout from 'layouts/loading'
import Button from '../../common/buttons'

const View = () => {
    const {id} = useParams()
    const {isAdmin} = useSelector(selector.authData)

    const user = useSelector(selector.current())
    const profile = useSelector(selector.byId(id))

    if (!profile || !user)
        return <LoadingLayout/>

    const isMyProfile = profile._id === user._id

    return (profile &&
        <>
            <div className="row mb-3">
                <div className="col-6 col-lg-3">
                    <Button.Back to="/"/>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    {(isMyProfile || isAdmin) &&
                    <NavLink to="update" className="position-absolute top-0 end-0 btn btn-light btn-sm">
                        <i className="bi bi-gear"/>
                    </NavLink>}
                    <div className="d-flex flex-column align-items-center text-center position-relative">
                        <img
                            src={profile.image}
                            className="rounded-circle shadow-1-strong me-3"
                            alt="avatar"
                            width="150"
                            height="150"
                        />
                        <div className="mt-3">
                            <h4>{profile.name}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body d-flex flex-column justify-content-center text-center">
                    <h5 className="card-title">
                        <span>Последний вес</span>
                    </h5>
                    <p className="card-text">
                        {profile.weight}
                    </p>
                </div>
            </div>
        </>
    )
}

View.propTypes = {
    // id: PropTypes.string.isRequired,
}

export default View
