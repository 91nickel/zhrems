import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import Table, { TableHeader, TableBody } from 'components/common/table'
import ControlsPanel from 'components/common/controlsPanel'

import { selector as userSelector } from 'store/user'

const SectionsTable = ({sections, currentSort, onSort, onDelete, ...rest}) => {

    const {userId, isAdmin} = useSelector(userSelector.authData())
    const users = useSelector(userSelector.get())

    console.log(sections, users)

    const columns = {
        date: {
            name: 'Название',
            path: 'name',
        },
        user: {
            name: 'Пользователь',
            path: 'user',
            component: el => {
                const user = users.find(u => u._id === el.user)
                return user
                    ? <NavLink to={`/users/${user._id}`}>{user.name}</NavLink>
                    : 'Default'
            },
        },
        controls: {
            component: el => {
                if (el.user === userId || isAdmin) {
                    return <ControlsPanel id={el._id} prefix="" onDelete={onDelete}/>
                }
                return ''
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
