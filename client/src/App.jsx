import React from 'react'
import { Route, Routes, NavLink, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
// import Users from 'layouts/users'
// import Login from 'layouts/login'
// import Logout from 'layouts/logout'
// import NotFound from 'layouts/not-found'
// import NavBar from 'components/ui/navBar'
// import ProtectedRoute from 'components/common/protectedRoute'
import Layout from 'layouts'
import AppLoader from 'components/hoc/appLoader'
import UserLoader from 'components/hoc/userLoader'
import Dashboard from 'components/ui/dashBoard'
import ProtectedRoute from 'components/ProtectedRoute'
import ProductPage from 'components/page/product'
import MealPage from 'components/page/meal'
import UserPage from 'components/page/user'
import NavBar from 'components/ui/navBar'
import { selector as userSelector } from 'store/user'

const App = () => {
    const isAuthorized = useSelector(userSelector.isAuthorized())
    // const pages = [
    //     {name: 'Home', path: '/', exact: true, nav: true, component: Home},
    //     {
    //         name: 'Login',
    //         path: '/login',
    //         params: '/:type?',
    //         exact: false,
    //         nav: false,
    //         professions: true,
    //         component: (params) => <Login id={params.match.params.type}/>
    //     },
    //     {
    //         name: 'Users',
    //         path: '/users',
    //         params: '/:id?/:type?',
    //         exact: false,
    //         nav: true,
    //         professions: true,
    //         auth: true,
    //         component: (params) => <Users id={params.match.params.id} mode={params.match.params.type}/>
    //     },
    //     {name: 'Not Found', path: '/404', exact: false, nav: false, component: NotFound},
    //     {name: 'Logout', path: '/logout', exact: false, nav: false, component: Logout},
    // ]

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
                            <Route index element={<Navigate to={'signin'}/>}/>
                            <Route path="signin" element={<Layout.Login/>}/>
                            <Route path="signup" element={<Layout.Register/>}/>
                            <Route path="logout" element={<Layout.Logout/>}/>
                            <Route path="*" element={<Navigate to={'signin'}/>}/>
                        </Route>
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute redirectTo="/auth/signin">
                                    <Dashboard/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/products/*"
                            element={
                                <ProtectedRoute redirectTo="/auth/signin">
                                    <Outlet/>
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<ProductPage.List/>}/>
                            <Route path="create" element={<ProductPage.Create/>}/>
                            <Route path=":id" element={<ProductPage.View/>}/>
                            <Route path=":id/update" element={<ProductPage.Update/>}/>
                        </Route>
                        <Route
                            path="/meals"
                            element={
                                <ProtectedRoute redirectTo="/auth/signin">
                                    <Outlet/>
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<MealPage.List/>}/>
                            <Route path="create" element={<MealPage.Create/>}/>
                            <Route path=":id" element={<MealPage.View/>}/>
                            <Route path=":id/update" element={<MealPage.Update/>}/>
                        </Route>
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute redirectTo="/auth/signin">
                                    <UserLoader>
                                        <Outlet/>
                                    </UserLoader>
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
                        </Route>
                        {/*<Route*/}
                        {/*    path="posts/*"*/}
                        {/*    element={*/}
                        {/*        <ProtectedRoute redirectTo="/auth/login">*/}
                        {/*            <PostsLayout/>*/}
                        {/*        </ProtectedRoute>*/}
                        {/*    }>*/}
                        {/*    <Route index element={<PostsListPage/>}/>*/}
                        {/*    <Route path=":postId" element={<PostPage/>}/>*/}
                        {/*</Route>*/}
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </div>
                {/*<NavBar {...{pages}}/>*/}
                {/*<div className="row">*/}
                {/*    <div className="col-12">*/}
                {/*        <Switch>*/}
                {/*            {pages*/}
                {/*                .filter(page => page.professions)*/}
                {/*                .map(*/}
                {/*                    (page, i) => {*/}
                {/*                        const RouteComponent = page.auth*/}
                {/*                            ? ProtectedRoute*/}
                {/*                            : Route*/}
                {/*                        return <RouteComponent*/}
                {/*                            key={`page_${i + 1}`}*/}
                {/*                            exact={page.exact}*/}
                {/*                            path={page.path + (page.params ? page.params : '')}*/}
                {/*                            component={page.component}/>*/}
                {/*                    }*/}
                {/*                )}*/}
                {/*            {pages*/}
                {/*                .filter(page => !page.professions)*/}
                {/*                .map((page, i) =>*/}
                {/*                    <Route*/}
                {/*                        key={`page_${i + 1}`} exact={page.exact}*/}
                {/*                        path={page.path + (page.params ? page.params : '')}*/}
                {/*                        component={page.component}/>)}*/}
                {/*            <Redirect to="/"/>*/}
                {/*        </Switch>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </AppLoader>
            <ToastContainer/>
        </>
    )
}

export default App
