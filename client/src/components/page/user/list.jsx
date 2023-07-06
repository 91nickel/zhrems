import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import _ from 'lodash'

import { action, selector } from 'store/user'

import Pagination from 'components/common/pagination'
import Table from 'components/ui/table/userTable'
import SearchStatus from 'components/ui/searchStatus'
import SearchString from 'components/ui/searchString'
import Button from 'components/common/buttons'
import paginate from 'utils/paginate'

const List = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const pageSize = 20
    const [currentPage, setCurrentPage] = useState(1)
    const [currentSort, setCurrentSort] = useState({path: 'name', order: 'asc'})
    const [searchQuery, setSearchQuery] = useState('')

    const users = useSelector(selector.get())

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
            console.log('handleDelete()', id)
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
        // return filteredData.filter(u => u._id !== user._id)
        return filteredData
    }

    const filteredUsers = filter(users)

    const count = filteredUsers.length
    const sortedUsers = _.orderBy(filteredUsers, currentSort.path, currentSort.order)
    const crop = paginate(sortedUsers, currentPage, pageSize)

    return (
        <>
            <div className="row justify-content-between">
                <div className="col-6 col-lg-3">
                    <Button.Back to=".."/>
                </div>
                <div className="col-6 col-lg-3">
                    <NavLink to="create" className="btn btn-sm btn-outline-success">
                        <i className="bi bi-plus"/>
                        Пользователь
                    </NavLink>
                </div>
            </div>
            <SearchString
                query={searchQuery}
                onSubmit={searchHandler.onSubmit}
            />
            <Table
                users={crop}
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
        </>
    )
}

export default List
