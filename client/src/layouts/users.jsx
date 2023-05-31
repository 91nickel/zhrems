import React from 'react'
import { useParams } from 'react-router-dom'
import UsersListPage from 'components/page/usersListPage'
import UserPage from 'components/page/userPage'
import UserEditPage from 'components/page/userEditPage'
import UsersLoader from '../components/ui/hoc/usersLoader'

const Users = () => {
    const {id, type} = useParams()

    const getComponent = () => {
        if (id) {
            return type === 'edit'
                ? <UserEditPage id={id}/>
                : <UserPage id={id}/>
        } else {
            return <UsersListPage/>
        }
    }

    return (
        <div className="row">
            <div className="col-12">
                <UsersLoader>
                    {getComponent()}
                </UsersLoader>
            </div>
        </div>
    )
}

export default Users
