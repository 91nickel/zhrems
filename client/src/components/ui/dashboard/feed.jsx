import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

const Feed = ({data, onUpdate: handleUpdate, onDelete: handleDelete}) => {

    const {_id: id, name, proteins, fats, carbohydrates, calories, weight} = data

    const results = {
        proteins: Math.round(proteins / 100 * weight),
        fats: Math.round(fats / 100 * weight),
        carbohydrates: Math.round(carbohydrates / 100 * weight),
        calories: Math.round(calories / 100 * weight),
        weight: Math.round(weight),
    }

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
                <span className="badge bg-light text-info mx-1">{results.proteins}</span>
                <span className="badge bg-light text-warning mx-1">{results.fats}</span>
                <span className="badge bg-light text-success mx-1">{results.carbohydrates}</span>
                <span className="badge bg-light text-danger mx-1">{results.calories}</span>
                <span className="badge bg-light text-dark mx-1">{results.weight}</span>
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
