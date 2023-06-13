import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import Table, { TableHeader, TableBody } from 'components/common/table'
import ControlsPannel from './controlsPannel'

const UsersTable = ({users, currentSort, onSort, onDelete, ...rest}) => {
    const columns = {
        name: {
            name: 'Имя',
            component: user => {
                return <NavLink to={`/users/${user._id}`}>{user.name}</NavLink>
            }
        },
        email: {path: 'email', name: 'E-mail'},
        weight: {path: 'weight', name: 'Вес'},
        controls: {
            path: '',
            name: '',
            component: user => {
                return <ControlsPannel id={user._id} prefix="" onDelete={onDelete}/>
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

UsersTable.propTypes = {
    users: PropTypes.array.isRequired,
    currentSort: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default UsersTable
