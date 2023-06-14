import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import Table, { TableHeader, TableBody } from 'components/common/table'
import ControlsPanel from 'components/ui/controlsPanel'

const WeightTable = ({weights, currentSort, onSort, onDelete, ...rest}) => {
    const columns = {
        date: {
            name: 'Дата',
            path: 'date',
            component: el => {
                return <NavLink to={`/weights/${el._id}`}>{el.name}</NavLink>
            }
        },
        user: {path: 'user', name: 'Пользователь'},
        value: {path: 'value', name: 'Вес'},
        controls: {
            component: el => {
                return <ControlsPanel id={el._id} prefix="" onDelete={onDelete}/>
            }
        },
    }
    return (
        <Table onSort={onSort} currentSort={currentSort} columns={columns} data={weights}>
            <TableHeader {...{columns, currentSort, onSort}} />
            <TableBody {...{columns, data: weights}} />
        </Table>
    )
}

WeightTable.propTypes = {
    weights: PropTypes.array.isRequired,
    currentSort: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default WeightTable
