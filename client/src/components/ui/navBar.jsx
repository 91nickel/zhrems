import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import NavProfile from './navProfile'
import { getUsersIsAuthorized } from 'store/user'

function NavBar ({pages}) {
    const location = useLocation()
    const isAuthorized = useSelector(getUsersIsAuthorized())

    return (
        <div className="row">
            <div className="col-12">
                <nav className="navbar bg-light mb-3">
                    <div className="container-fluid">
                        <ul className="nav">{
                            pages
                                .filter(page => {
                                    return page.nav
                                        && (!Object.keys(page).includes('auth') || (page.auth === true && isAuthorized))
                                })
                                .map(
                                    (page, i) => {
                                        const isActive = page.exact
                                            ? page.path === location.pathname
                                            : location.pathname.includes(page.path)
                                        const classList = 'nav-item nav-link' + (isActive ? ' active' : '')
                                        return (
                                            <li key={`ntm_${i}`} className={classList}>
                                                <Link to={page.path}>{page.name}</Link>
                                            </li>
                                        )
                                    }
                                )}
                        </ul>
                        <div className="d-flex">
                            {isAuthorized ? <NavProfile /> : <Link to="/login">Login</Link>}
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

NavBar.propTypes = {
    pages: PropTypes.array.isRequired,
}

export default NavBar
