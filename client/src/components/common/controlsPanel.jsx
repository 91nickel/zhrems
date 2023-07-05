import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Button from 'components/common/buttons'
import PropTypes from 'prop-types'

import NavProfile from '../ui/navProfile'
import { selector as userSelector } from 'store/user'

function ControlsPanel ({id, prefix, onDelete}) {

    const [open, setOpen] = useState()

    return (
        <div className="d-flex justify-content-end mb-0">
            {id && <Button.Update to={`${prefix}${id}/update`}/>}
            <Button.Delete onClick={() => onDelete(id)}/>
        </div>
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
