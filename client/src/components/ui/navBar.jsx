import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import NavProfile from './navProfile'
import { selector as userSelector } from 'store/user'

function NavBar () {
    const [open, setOpen] = useState()
    const isAuthorized = useSelector(userSelector.isAuthorized())
    const {isAdmin} = useSelector(userSelector.authData())

    const handleDropdownToggle = () => {
        setOpen(!open)
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">
                <span className="fs-6 d-md-none">ZHREMS</span>
                <span className="d-none d-md-block">ZHREMS</span>

            </a>
            <div className="navbar-nav flex-row justify-content-start me-auto">
                <li className="nav-item d-none d-md-block">
                    <NavLink className="nav-link me-2" to="/dashboard">Главная</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link me-2" to="/products">Продукты</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link me-2" to="/meals">Блюда</NavLink>
                </li>
                {isAdmin && <li className="nav-item">
                    <NavLink className="nav-link me-2" to="/users">Пользователи</NavLink>
                </li>}
            </div>
            <div className="navbar-profile">
                <NavProfile/>
            </div>
        </nav>
    )
}

NavBar.propTypes = {
    // pages: PropTypes.array.isRequired,
}

export default NavBar
