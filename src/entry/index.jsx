import '../common/lib';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router, Route, Link, browserHistory, hashHistory, IndexRedirect, IndexRoute,useRouterHistory } from 'react-router'
import { createHashHistory } from 'history'
import Layout from './pages/layout/index';
import Home from './pages/home/index';
import About from './pages/about/index';
import Tables from './pages/table/index';
import ChartLine from './pages/charts/line';
import ChartBar from './pages/charts/bar';
import Users from './pages/users/index';
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
                <IndexRoute component={Home}/>
                <Route path="about" component={About}/>
                <Route path="table" component={Tables}/>
                <Route path="charts">
                    <Route path="line" component={ChartLine}/>
                    <Route path="bar" component={ChartBar}/>
                </Route>
                <Route path="users" component={Users} />
            </Route>
            <Route path="login" component={Login}/>
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
), document.getElementById('root'))
