import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import NavProfile from './navProfile'
import { selector as userSelector } from 'store/user'

function ControlsPannel ({id, prefix, onDelete}) {
    const [open, setOpen] = useState()

    return (
        <ul className="list-group-horizontal list-unstyled d-flex justify-content-end">
            <li className="list-item">
                <NavLink to={prefix + id} className="btn btn-sm btn-success mx-1">
                    <i className="bi bi-eye" style={{width: '1rem', height: '1rem'}}></i>
                </NavLink>
            </li>
            <li>
                <NavLink to={`${prefix}${id}/update`} className="btn btn-sm btn-warning mx-1">
                    <i className="bi bi-pencil-square" style={{width: '1rem', height: '1rem'}}></i>
                </NavLink>
            </li>
            <li>
                <button
                    className="btn btn-sm btn-danger mx-1"
                    onClick={() => onDelete(id)}>
                    <i className="bi bi-x-square" style={{width: '1rem', height: '1rem'}}></i>
                </button>
            </li>
        </ul>
    )
}

ControlsPannel.defaultValues = {
    prefix: '',
}

ControlsPannel.propTypes = {
    id: PropTypes.string.isRequired,
    prefix: PropTypes.string,
    onDelete: PropTypes.func,
}

export default ControlsPannel
