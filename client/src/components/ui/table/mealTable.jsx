import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import { selector as userSelector } from 'store/user'

import Table, { TableHeader, TableBody } from 'components/common/table'
import ControlsPanel from 'components/common/controlsPanel'

const MealTable = ({products, currentSort, onSort, onDelete, ...rest}) => {

    const users = useSelector(userSelector.get())

    const columns = {
        name: {
            name: 'Имя',
            path: 'name',
            component: el => {
                return <NavLink to={`/meals/${el._id}`}>{el.name}</NavLink>
            }
        },
        user: {
            name: 'Пользователь',
            path: 'user',
            component: el => {
                const user = users.find(u => u._id === el.user)
                return user && <NavLink to={`/users/${user._id}`}>{user.name}</NavLink>
            },
        },
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
