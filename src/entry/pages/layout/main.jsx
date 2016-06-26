import React from 'react';
import { Link } from 'react-router'
import { Menu, Breadcrumb, Icon, Dropdown } from 'antd';
const SubMenu = Menu.SubMenu;
import Nav from '../../../component/nav/index';
import './less/index.less';


const Layout = React.createClass({
    getInitialState() {
        return {
            collapse: true,
        };
    },
    onCollapseChange() {
        this.setState({
            collapse: !this.state.collapse,
        })
    },
    render() {
        const collapse = this.state.collapse;
        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" href="http://www.alipay.com/">第一个菜单项</a>
                </Menu.Item>
               <Menu.Item key="/login"><Link to="/login">登录</Link></Menu.Item>
            </Menu>
        );
        const menuNotice = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" href="http://www.alipay.com/">第一个菜单项第一个菜单项第一个菜单项第一个菜单项第一个菜单项</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" href="http://www.taobao.com/">第二个菜单项第二个菜单项第二个菜单项第二个菜单项</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" href="http://www.tmall.com/">第二个菜单项第二个菜单项第二个菜单项</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className={collapse ? "ant-layout-aside ant-layout-aside-collapse" : "ant-layout-aside"}>
                <aside className="ant-layout-sider">
                    <div className="ant-layout-logo"></div>
                    <Menu mode="inline" theme="dark" defaultSelectedKeys={['user']}>
                        <Menu.Item key="user">
                        <Link to="/home">
                            <i className="fa fa-dashboard"></i><span className="nav-text">导航一</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="laptop">
                        <Link to="/table">
                            <i className="fa fa-bar-chart-o"></i><span className="nav-text">导航三</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="setting">
                        <Link to="/charts/line">
                            <Icon type="setting" /><span className="nav-text">导航二</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="notification">
                        <Link to="/charts/bar">
                            <Icon type="notification" /><span className="nav-text">导航四</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="folder">
                        <Link to="/users">
                            <Icon type="folder" /><span className="nav-text">导航五</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                    <div className="ant-aside-action" onClick={this.onCollapseChange}>
                        {collapse ? <Icon type="right" /> : <Icon type="left" />}
                    </div>
                </aside>
                <div className="ant-layout-main">
                    <div className="ant-layout-header layout-header clearfix">
                        <div className="nav-bar-right pull-right">
                            <Dropdown overlay={menuNotice}>
                                <a href="#" className="ant-dropdown-link notice">
                                    <span className="notification"><i className="fa fa-bell-o"></i></span>
                                    <b className="badge">5</b>
                                </a>
                            </Dropdown>
                            <Dropdown overlay={menu}>
                                <a className="ant-dropdown-link" href="#">
                                    <img className="img-circle admin-img" src="/images/1.jpeg" alt=""/>
                                    <span className="user-info">admin <i className="fa fa-angle-down fa-fw"></i></span>
                                </a>
                            </Dropdown>
                        </div>
                        <Nav {...this.props}/>
                    </div>
                    <div className="ant-layout-breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>应用列表</Breadcrumb.Item>
                            <Breadcrumb.Item>某应用</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="ant-layout-container">
                        <div className="ant-layout-content">
                            {this.props.children}
                        </div>
                    </div>
                    <div className="ant-layout-footer">
                        Ant Design 版权所有 © 2015 由蚂蚁金服体验技术部支持
                    </div>
                </div>
            </div>
        );
    }
});

export default Layout;
