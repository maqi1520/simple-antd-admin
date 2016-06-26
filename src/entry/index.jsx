import '../common/lib';
import ReactDOM from 'react-dom';
import React from 'react';
import NProgress from 'nprogress';
import { Router, Route, Link, browserHistory, hashHistory, IndexRedirect, IndexRoute,useRouterHistory } from 'react-router'
import { createHashHistory } from 'history'
import Layout from './pages/layout/main';
const Home = (location, cb) => {
        require.ensure([], require => {
            NProgress.start();
        cb(null, require('./pages/home/index'))
        NProgress.done();
    },'home')
}
const About = (location, cb) => {
    NProgress.start();
    require.x([], require => {
        cb(null, require('./pages/about/index'))
    },'about')
    NProgress.done();
}
const Users = (location, cb) => {
    NProgress.start();
    require.ensure([], require => {
        cb(null, require('./pages/users/index'))
    },'users')
    NProgress.done();
}
import ChartLine from './pages/charts/line';
import ChartBar from './pages/charts/bar';
import Tables from './pages/table/index';
import Login from './pages/login/index';

import {getCookie} from '../utils';

const NotFound = React.createClass({
    render() {
        return <h2>Not found</h2>
    }
})

const validate = function (next, replace, callback) {
    const isLoggedIn = !!getCookie('uid')
    if (!isLoggedIn && next.location.pathname != '/login') {
        replace('/login')
    }
    callback()
}

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

ReactDOM.render((
    <Router history={appHistory}>
        <Route path="/" onEnter={validate}>
            {/*<IndexRedirect to="home" />*/}
            <Route component={Layout}>
                <IndexRoute getComponent={Home}/>
                <Route path="about" getComponent={About}/>
                <Route path="table" getcomponent={Tables}/>
                <Route path="charts">
                    <Route path="line" component={ChartLine}/>
                    <Route path="bar" component={ChartBar}/>
                </Route>
                <Route path="users" getComponent={Users} />
            </Route>
            <Route path="login" component={Login}/>
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
), document.getElementById('root'))
