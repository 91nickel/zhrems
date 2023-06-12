import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import NavProfile from './navProfile'
import { selector as userSelector } from 'store/user'

function NavBar () {
    const isAuthorized = useSelector(userSelector.isAuthorized())

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">ZHREMS</a>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Главная</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Продукты</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Блюда</NavLink>
                        </li>
                    </div>
                    <div className="navbar-profile">
                        <NavProfile />
                    </div>
                </div>
            </div>
        </nav>
    )
}

NavBar.propTypes = {
    // pages: PropTypes.array.isRequired,
}

export default NavBar
