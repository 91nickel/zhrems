import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const Back = ({to, className, onClick}) => {
    return (
        <>
            {
                to
                &&
                <NavLink to={to ? to : '..'} className={className}>
                    <i className="bi bi-chevron-left" style={{width: '1em', height: '1em'}}/>
                    Назад
                </NavLink>
            }
            {
                onClick
                &&
                <button className={className} onClick={onClick}>
                    <i className="bi bi-chevron-left" style={{width: '1em', height: '1em'}} />
                    Назад
                </button>
            }
        </>
    )
}

Back.defaultProps = {
    to: '..',
    className: 'btn btn-sm btn-outline-primary w-100',
}

Back.propTypes = {
    to: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
}

export default Back
