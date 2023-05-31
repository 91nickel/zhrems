import React, { useEffect } from 'react'
import { Link, Route, Routes, NavLink, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
// import Users from 'layouts/users'
// import Login from 'layouts/login'
// import Logout from 'layouts/logout'
// import NotFound from 'layouts/not-found'
// import NavBar from 'components/ui/navBar'
// import ProtectedRoute from 'components/common/protectedRoute'
import AppLoader from './components/ui/hoc/appLoader'
import LoginLayout from 'layouts/login.layout'
import RegisterLayout from 'layouts/register.layout'
import HomeLayout from 'layouts/home.layout'

const App = () => {

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
                    <div className="row">
                        {/*<NavBar pages={} />*/}
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Routes>
                                <Route path="/" index element={<HomeLayout />}/>
                                <Route path="auth/*">
                                    <Route index element={<Navigate to={'signin'}/>}/>
                                    <Route path="signin" element={<LoginLayout/>}/>
                                    <Route path="signup" element={<RegisterLayout/>}/>
                                    <Route path="*" element={<Navigate to={'signin'}/>}/>
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
                    </div>
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
