import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import Table, { TableHeader, TableBody } from 'components/common/table'
import ControlsPanel from 'components/common/controlsPanel'
import EnergyResults from 'components/common/energyResult'

import { selector as userSelector } from 'store/user'
import { selector as sectionSelector } from 'store/section'

const ProductTable = ({products, currentSort, onSort, onDelete, ...rest}) => {

    const {userId, isAdmin} = useSelector(userSelector.authData())
    const users = useSelector(userSelector.get())
    const sections = useSelector(sectionSelector.get())

    const columns = {
        name: {
            name: 'Имя',
            path: 'name',
            component: el => {
                return <NavLink to={`/products/${el._id}`}>{el.name}</NavLink>
            }
        },
        section: {
            name: 'Раздел',
            path: 'section',
            component: el => {
                const section = sections.find(s => s._id === el.section)
                return section && <NavLink to={`/products/section/${section._id}`}>{section.name}</NavLink>
            },
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
        // energy: {
        //     name: 'Б/Ж/У/К/В',
        //     component: el => {
        //         return <EnergyResults {...el} />
        //     }
        // },
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
        <Table onSort={onSort} currentSort={currentSort} columns={columns} data={products}>
            <TableHeader {...{columns, currentSort, onSort}} />
            <TableBody {...{columns, data: products}} />
        </Table>
    )
}

ProductTable.propTypes = {
    products: PropTypes.array.isRequired,
    currentSort: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default ProductTable
