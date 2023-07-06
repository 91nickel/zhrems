import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selector as userSelector, action as userAction } from 'store/user'
import { selector as weightSelector, action as weightAction } from 'store/weight'
import Button from 'components/common/buttons'
import NotFound from 'layouts/404'
import Forbidden from 'layouts/403'

const View = () => {
    const {id} = useParams()

    const {isAdmin, userId} = useSelector(userSelector.authData())
    const profile = useSelector(userSelector.byId(id))
    const weight = useSelector(weightSelector.last())

    if (!profile)
        return <NotFound/>

    if (profile._id !== userId && !isAdmin)
        return <Forbidden/>

    return (
        <>
            <div className="row mb-3">
                <div className="col-6 col-lg-3">
                    <Button.Back to="/"/>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <NavLink to="update" className="position-absolute top-0 end-0 btn btn-light btn-sm">
                        <i className="bi bi-gear"/>
                    </NavLink>
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
                        <span>Пол</span>
                    </h5>
                    <p className="card-text">
                        {profile.sex === 'male' && 'МУЖ'}
                        {profile.sex === 'female' && 'ЖЕН'}
                        {profile.sex === 'other' && 'ДР'}
                    </p>
                </div>
            </div>
            {
                weight
                &&
                <div className="card mb-3">
                    <div className="card-body d-flex flex-column justify-content-center text-center">
                        <h5 className="card-title">
                            <span>Последний вес</span>
                        </h5>
                        <p className="card-text">
                            {weight.value}
                        </p>
                    </div>
                </div>
            }
        </>
    )
}

View.propTypes =
{
    // id: PropTypes.string.isRequired,
}

export default View
