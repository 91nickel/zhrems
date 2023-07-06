import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import SearchStatus from 'components/ui/searchStatus'
import SearchString from 'components/ui/searchString'
import Table from 'components/ui/table/mealTable'
import Pagination from 'components/common/pagination'

import { action as mealAction, selector as mealSelector } from 'store/meal'

import _ from 'lodash'
import paginate from 'utils/paginate'
import Button from 'components/common/buttons'
import { selector as authSelector } from 'store/user'
import CheckboxField from 'components/common/form/checkboxField'
import OnlyMySelector from '../../common/onlyMySelector'

const List = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const meals = useSelector(mealSelector.get())
    const {userId} = useSelector(authSelector.authData())
    const settings = useSelector(authSelector.settings())

    const pageSize = 20
    const [currentPage, setCurrentPage] = useState(1)
    const [currentSort, setCurrentSort] = useState({path: 'name', order: 'asc'})
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
            dispatch(mealAction.delete(id))
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

        let filteredData = [...data]

        if (settings.onlyMy) {
            filteredData = data.filter(m => m.user === userId)
        }

        if (!!searchQuery) {
            const regexp = new RegExp(searchQuery, 'ig')
            filteredData = data.filter(m => regexp.test(m.name))
        }

        return filteredData
    }

    const filteredItems = filter(meals)
    const count = filteredItems.length
    const sortedProducts = _.orderBy(filteredItems, currentSort.path, currentSort.order)
    const crop = paginate(sortedProducts, currentPage, pageSize)
    // console.log(filteredItems, crop)

    return (
        <>
            <div className="row justify-content-between">
                <div className="col-6 col-lg-3">
                    <Button.Back to=".."/>
                </div>
                <div className="col-6 col-lg-3">
                    <NavLink to="create" className="btn btn-sm btn-outline-success w-100">
                        <i className="bi bi-plus"/>
                        Комбинация
                    </NavLink>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    {/*<SearchStatus value={count}/>*/}
                    <SearchString
                        query={searchQuery}
                        onSubmit={searchHandler.onSubmit}
                    />
                    <OnlyMySelector />
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
