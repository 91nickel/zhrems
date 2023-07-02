import React from 'react'
import { NavLink } from 'react-router-dom'

import Table, { TableHeader, TableBody } from 'components/common/table'
import ControlsPanel from 'components/common/controlsPanel'

import PropTypes from 'prop-types'

const MealTable = ({products, currentSort, onSort, onDelete, ...rest}) => {
    const columns = {
        name: {
            name: 'Имя',
            path: 'name',
            component: el => {
                return <NavLink to={`/meals/${el._id}`}>{el.name}</NavLink>
            }
        },
        proteins: {path: 'proteins', name: 'Б'},
        fats: {path: 'fats', name: 'Ж'},
        carbohydrates: {path: 'carbohydrates', name: 'У'},
        calories: {path: 'calories', name: 'ККАЛ'},
        controls: {
            component: el => {
                return <ControlsPanel id={el._id} prefix="" onDelete={onDelete}/>
            }
        },
    }
    return (
        <Table onSort={onSort} currentSort={currentSort} columns={columns} data={products}>
            <TableHeader {...{columns, currentSort, onSort}} />
            <TableBody {...{columns, data: products}} />
        </Table>
    )
}

MealTable.propTypes = {
    products: PropTypes.array.isRequired,
    currentSort: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default MealTable
