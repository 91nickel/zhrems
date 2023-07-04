import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const Add = ({to, onClick}) => {

    return (
        <>
            {
                to
                &&
                <NavLink to={to} className="btn btn-sm btn-outline-success mx-1">
                    <i className="bi bi-plus" style={{width: '1em', height: '1em'}}/>
                </NavLink>
            }
            {
                onClick
                &&
                <button className="btn btn-sm btn-outline-success mx-1" onClick={onClick}>
                    <i className="bi bi-plus" style={{width: '1em', height: '1em'}}/>
                </button>
            }
        </>
    )
}
Add.propTypes = {
    to: PropTypes.string,
    onClick: PropTypes.func,
}

export default Add
