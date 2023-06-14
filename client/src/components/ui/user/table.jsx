import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import Table, { TableHeader, TableBody } from 'components/common/table'
import ControlsPannel from 'components/ui/controlsPannel'

const UserTable = ({users, currentSort, onSort, onDelete, ...rest}) => {
    const columns = {
        name: {
            name: 'Имя',
            component: el => {
                return <NavLink to={`/users/${el._id}`}>{el.name}</NavLink>
            }
        },
        email: {path: 'email', name: 'E-mail'},
        weight: {path: 'weight', name: 'Вес'},
        controls: {
            path: '',
            name: '',
            component: el => {
                return <ControlsPannel id={el._id} prefix="" onDelete={onDelete}/>
            }
        },
    }
    return (
        <Table onSort={onSort} currentSort={currentSort} columns={columns} data={users}>
            <TableHeader {...{columns, currentSort, onSort}} />
            <TableBody {...{columns, data: users}} />
        </Table>
    )
}

UserTable.propTypes = {
    users: PropTypes.array.isRequired,
    currentSort: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default UserTable
