import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import Card from 'components/ui/product/card'
import Table from 'components/ui/product/table'
import Pagination from 'components/common/pagination'
import _ from 'lodash'
import paginate from 'utils/paginate'
import SearchStatus from '../../ui/searchStatus'
import SearchString from '../../ui/searchString'

const List = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const pageSize = 10
    const [currentPage, setCurrentPage] = useState(1)
    const [currentSort, setCurrentSort] = useState({path: 'name', order: 'asc'})
    const [searchQuery, setSearchQuery] = useState('')

    const products = useSelector(selector.get())

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    const paginationHandler = {
        onChange: function (index) {
            setCurrentPage(index)
        }
    }

    const tableHandler = {
        onSort: function (item) {
            setCurrentSort(item)
        },
        onDelete: function (id) {
            dispatch(action.delete(id))
        },
    }

    const searchHandler = {
        onSubmit: function (value) {
            setSearchQuery(value)
        },
    }

    function filter (data) {
        if (!data)
            return []
        let filteredData
        // if (currentProfession) {
        //     filteredUsers = data.filter(u => u.profession === currentProfession._id)
        // } else
        if (!!searchQuery) {
            const regexp = new RegExp(searchQuery, 'ig')
            const searchResults = data.filter(u => regexp.test(u.name))
            filteredData = searchResults.length > 0 ? searchResults : data
        } else {
            filteredData = data
        }
        return filteredData
    }

    const filteredProducts = filter(products)
    const count = filteredProducts.length
    const sortedProducts = _.orderBy(filteredProducts, currentSort.path, currentSort.order)
    const crop = paginate(sortedProducts, currentPage, pageSize)

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5 d-flex justify-content-between">
                    <NavLink to=".." className="btn btn-primary">
                        <i className="bi bi-caret-left"/>
                        Назад
                    </NavLink>
                    <NavLink to="create" className="btn btn-success">
                        <i className="bi bi-plus"/>
                        Добавить
                    </NavLink>
                </div>
            </div>
            <div className="row mt-3 justify-content-center">
                <div className="col-12 col-md-6 d-flex flex-column">
                    <SearchStatus
                        value={count}
                    />
                    <SearchString
                        query={searchQuery}
                        onSubmit={searchHandler.onSubmit}
                    />
                    <Table
                        products={crop}
                        currentSort={currentSort}
                        onDelete={tableHandler.onDelete}
                        onSort={tableHandler.onSort}
                    />
                    <div className="d-flex justify-content-center">
                        <Pagination
                            currentPage={currentPage}
                            pageSize={pageSize}
                            itemsCount={count}
                            onChange={paginationHandler.onChange}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default List
