import React from 'react'
import { Route, Routes, NavLink, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
// import Users from 'layouts/users'
// import Login from 'layouts/login'
// import Logout from 'layouts/logout'
// import NotFound from 'layouts/not-found'
// import NavBar from 'components/ui/navBar'
import Layout from 'layouts'
import CommonLoader from 'components/hoc/commonLoader'
import AppLoader from 'components/hoc/appLoader'
import DashboardLoader from 'components/hoc/dasboardLoader'

import Dashboard from 'components/ui/dashboard/dashBoard'
import ProtectedRoute from 'components/common/protectedRoute'
import ProductPage from 'components/page/product'
import MealPage from 'components/page/meal'
import WeightPage from 'components/page/weight'
import FeedPage from 'components/page/feed'
import UserPage from 'components/page/user'
import NavBar from 'components/ui/navBar'
import ModalWindows from 'components/modal/ModalWindows'

import { selector as userSelector } from 'store/user'

const App = () => {
    const isAuthorized = useSelector(userSelector.isAuthorized())
    return (
        <>
            <AppLoader>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6 mt-5">
                            {isAuthorized && <NavBar/>}
                        </div>
                    </div>
                    <Routes>

                        <Route path="/" index element={<Layout.Home/>}/>

                        <Route path="auth/*">
                            <Route index element={<Navigate to={'signIn'}/>}/>
                            <Route path="*" element={<Layout.NotFound/>}/>
                            <Route path="signIn" element={<Layout.SignIn/>}/>
                            <Route path="signUp" element={<Layout.SignUp/>}/>
                            <Route path="signOut" element={<Layout.SignOut/>}/>
                        </Route>

                        <Route
                            path="/dashboard/*"
                            element={
                                <ProtectedRoute redirectTo="/auth/signIn">
                                    <DashboardLoader>
                                        <Outlet />
                                    </DashboardLoader>
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Navigate to={(new Date).toLocaleDateString('fr-CA')}/>}/>
                            <Route path=":date" element={<Dashboard/>}/>
                        </Route>

                        <Route
                            path="/products/*"
                            element={
                                <ProtectedRoute redirectTo="/auth/signIn">
                                    <CommonLoader entity="product">
                                        <Outlet/>
                                    </CommonLoader>
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<ProductPage.List/>}/>
                            <Route path="create" element={<ProductPage.Create/>}/>
                            <Route path=":id/*">
                                <Route index element={<ProductPage.View/>}/>
                                <Route path="update" element={<ProductPage.Update/>}/>
                            </Route>
                            <Route path="*" element={<Layout.NotFound/>}/>
                        </Route>

                        <Route
                            path="/meals"
                            element={
                                <ProtectedRoute redirectTo="/auth/signIn">
                                    <CommonLoader entity="meal">
                                        <Outlet/>
                                    </CommonLoader>
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<MealPage.List/>}/>
                            <Route path="create" element={<MealPage.Create/>}/>
                            <Route path=":id/*">
                                <Route index element={<MealPage.View/>}/>
                                <Route path="update" element={<MealPage.Update/>}/>
                            </Route>
                            <Route path="*" element={<Layout.NotFound/>}/>
                        </Route>

                        <Route
                            path="/weights"
                            element={
                                <ProtectedRoute redirectTo="/auth/signIn">
                                    <CommonLoader entity="weight">
                                        <Outlet/>
                                    </CommonLoader>
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<WeightPage.List/>}/>
                            <Route path="create/:date?" element={<WeightPage.Create/>}/>
                            <Route path=":id/*">
                                <Route index element={<WeightPage.View/>}/>
                                <Route path="update" element={<WeightPage.Update/>}/>
                            </Route>
                            <Route path="*" element={<Layout.NotFound/>}/>
                        </Route>

                        <Route
                            path="/feeds"
                            element={
                                <ProtectedRoute redirectTo="/auth/signIn">
                                    <CommonLoader entity="product">
                                        <Outlet/>
                                    </CommonLoader>
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<FeedPage.List/>}/>
                            <Route path="create/:date?" element={<FeedPage.Create/>}/>
                            <Route path=":date/*">
                                <Route index element={<FeedPage.View/>}/>
                                <Route path="update" element={<FeedPage.Update/>}/>
                            </Route>
                            <Route path="*" element={<Layout.NotFound/>}/>
                        </Route>

                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute redirectTo="/auth/signIn">
                                    <CommonLoader entity="user">
                                        <Outlet/>
                                    </CommonLoader>
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<UserPage.List/>}/>
                            <Route path="create" element={
                                <ProtectedRoute admin={true}>
                                    <UserPage.Create/>
                                </ProtectedRoute>}/>
                            }/>
                            <Route path=":id/*">
                                <Route index element={<UserPage.View/>}/>
                                <Route path="update" element={<UserPage.Update/>}/>
                            </Route>
                            <Route path="*" element={<Layout.NotFound/>}/>
                        </Route>

                        <Route path="*" element={<Navigate to="/"/>}/>

                    </Routes>
                </div>
                <ModalWindows />
            </AppLoader>
            <ToastContainer/>
        </>
    )
}

export default App
