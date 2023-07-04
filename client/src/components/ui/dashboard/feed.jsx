import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import EnergyResults from 'components/common/energyResult'
import calculateTotalEnergy from 'utils/calculateTotalEnergy'

const Feed = ({data, onUpdate: handleUpdate, onDelete: handleDelete}) => {

    const {_id: id, name} = data

    const results = calculateTotalEnergy(data)

    function onUpdate (e) {
        e.preventDefault()
        handleUpdate(id)
    }

    function onDelete (e) {
        e.preventDefault()
        handleDelete(id)
    }

    return (
        <li className="list-group-item d-flex justify-content-between px-0">
            <span>{name}</span>
            <span className="flex-grow-1 ps-5"></span>
            <span>
                <EnergyResults {...results} />
            </span>
            <span>
                {
                    handleUpdate
                    &&
                    <button className="btn btn-outline-warning btn-sm mx-1" onClick={onUpdate}>
                        <i className="bi bi-pencil" style={{width: '10px', height: '10px'}}></i>
                    </button>
                }
                {
                    handleDelete
                    &&
                    <button className="btn btn-outline-danger btn-sm mx-1" onClick={onDelete}>
                        <i className="bi bi-x" style={{width: '10px', height: '10px'}}></i>
                    </button>
                }
            </span>
        </li>
    )
}

Feed.propTypes = {
    data: PropTypes.object,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
}

export default Feed
