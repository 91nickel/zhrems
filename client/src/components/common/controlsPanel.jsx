import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import NavProfile from '../ui/navProfile'
import { selector as userSelector } from 'store/user'

function ControlsPanel ({id, prefix, onDelete}) {

    const [open, setOpen] = useState()

    return (
        <ul className="list-group-horizontal list-unstyled d-flex justify-content-end">
            <li className="list-item">
                {
                    id &&
                    <NavLink to={prefix + id} className="btn btn-sm btn-success mx-1">
                        <i className="bi bi-eye" style={{width: '1rem', height: '1rem'}}></i>
                    </NavLink>
                }
            </li>
            <li>
                {
                    id &&
                    <NavLink to={`${prefix}${id}/update`} className="btn btn-sm btn-warning mx-1">
                        <i className="bi bi-pencil-square" style={{width: '1rem', height: '1rem'}}></i>
                    </NavLink>
                }
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

ControlsPanel.defaultValues = {
    prefix: '',
}

ControlsPanel.propTypes = {
    id: PropTypes.string,
    prefix: PropTypes.string,
    onDelete: PropTypes.func,
}

export default ControlsPanel
