import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import Table, { TableHeader, TableBody } from 'components/common/table'
import ControlsPannel from 'components/ui/controlsPannel'

const ProductTable = ({products, currentSort, onSort, onDelete, ...rest}) => {
    const columns = {
        name: {
            name: 'Имя',
            path: 'name',
            component: el => {
                return <NavLink to={`/products/${el._id}`}>{el.name}</NavLink>
            }
        },
        proteins: {path: 'proteins', name: 'Б'},
        fats: {path: 'fats', name: 'Ж'},
        carbohydrates: {path: 'carbohydrates', name: 'У'},
        calories: {path: 'calories', name: 'ККАЛ'},
        controls: {
            component: el => {
                return <ControlsPannel id={el._id} prefix="" onDelete={onDelete}/>
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
