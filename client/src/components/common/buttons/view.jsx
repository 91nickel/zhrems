import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const View = ({to, onClick}) => {
    return (
        <>
            {
                to
                &&
                <NavLink to={to} className="btn btn-sm btn-outline-success mx-1">
                    <i className="bi bi-eye" style={{width: '1em', height: '1em'}}/>
                </NavLink>
            }
            {
                onClick
                &&
                <button className="btn btn-sm btn-outline-success mx-1" onClick={onClick}>
                    <i className="bi bi-eye" style={{width: '1em', height: '1em'}}/>
                </button>
            }
        </>
    )
}
View.propTypes = {
    to: PropTypes.string,
    onClick: PropTypes.func,
}

export default View
