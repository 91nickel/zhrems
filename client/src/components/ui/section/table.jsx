import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import Table, { TableHeader, TableBody } from 'components/common/table'
import ControlsPanel from 'components/common/controlsPanel'

const SectionsTable = ({sections, currentSort, onSort, onDelete, ...rest}) => {
    const columns = {
        date: {
            name: 'Название',
            path: 'name',
        },
        user: {path: 'user', name: 'Пользователь'},
        controls: {
            component: el => {
                return <ControlsPanel id={el._id} prefix="" onDelete={onDelete}/>
            }
        },
    }
    return (
        <Table onSort={onSort} currentSort={currentSort} columns={columns} data={sections}>
            <TableHeader {...{columns, currentSort, onSort}} />
            <TableBody {...{columns, data: sections}} />
        </Table>
    )
}

SectionsTable.propTypes = {
    sections: PropTypes.array.isRequired,
    currentSort: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default SectionsTable
