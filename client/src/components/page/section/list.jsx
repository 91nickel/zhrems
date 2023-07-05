import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import _ from 'lodash'

import { selector as authSelector } from 'store/user'
import { selector as sectionSelector, action as sectionAction} from 'store/section'

import Pagination from 'components/common/pagination'
import Table from 'components/ui/table/sectionTable'
import SearchStatus from 'components/ui/searchStatus'
import SearchString from 'components/ui/searchString'
import Button from 'components/common/buttons'
import CheckboxField from 'components/common/form/checkboxField'

import paginate from 'utils/paginate'

const List = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId} = useSelector(authSelector.authData())
    const sections = useSelector(sectionSelector.get())

    const pageSize = 20
    const [currentPage, setCurrentPage] = useState(1)
    const [currentSort, setCurrentSort] = useState({path: 'name', order: 'asc'})
    const [onlyMy, setOnlyMy] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

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
            dispatch(sectionAction.delete(id))
        },
    }

    const searchHandler = {
        onSubmit: function (value) {
            setSearchQuery(value)
        },
    }

    function filter (data) {
        if (!data) return []

        let filteredData = [...data]

        if (onlyMy) {
            filteredData = data.filter(p => p.user === userId)
        }

        if (!!searchQuery) {
            const regexp = new RegExp(searchQuery, 'ig')
            filteredData = filteredData.filter(p => regexp.test(p.name))
        }

        return filteredData
    }

    const filteredItems = filter(sections)

    const count = filteredItems.length
    const sortedItems = _.orderBy(filteredItems, currentSort.path, currentSort.order)
    const crop = paginate(sortedItems, currentPage, pageSize)

    return (
        <>
            <div className="row justify-content-between mb-3">
                <div className="col-6 col-lg-3">
                    <Button.Back to=".." />
                </div>
                <div className="col-6 col-lg-3">
                    <NavLink to="create" className="btn btn-sm btn-outline-success w-100">
                        <i className="bi bi-plus"/>
                        Раздел
                    </NavLink>
                </div>
            </div>
            <SearchString
                query={searchQuery}
                onSubmit={searchHandler.onSubmit}
            />
            <CheckboxField onChange={({value}) => {setOnlyMy(value)}} value={onlyMy} name="my">
                Показать только мои
            </CheckboxField>
            <Table
                sections={crop}
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
