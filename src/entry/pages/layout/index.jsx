import React from 'react';
import { Menu, Icon, Breadcrumb, Dropdown } from 'antd';
import Nav from '../../../component/nav/index';
import Aside from '../../../component/aside/index';
import './less/index.less';


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Layout extends React.Component {
    render() {
        const {route}=this.props;
        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" href="http://www.alipay.com/">第一个菜单项</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" href="http://www.taobao.com/">第二个菜单项</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" href="http://www.tmall.com/">第三个菜单项</a>
                </Menu.Item>
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
            <div>
                <div className="layout-header clearfix">
                    <div className="layout-logo">
                        <img width="100%" src="http://www.broada.com/common/images/logo.png" alt="logo" />
                    </div>
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
                <Aside {...this.props}/>
                <div className="layout-wrapper">
                <div className="layout-container">
                    <div className="layout-content">
                        <div className="layout-breadcrumb clearfix">
                            <Breadcrumb>
                                <Breadcrumb.Item>首页</Breadcrumb.Item>
                                <Breadcrumb.Item>应用列表</Breadcrumb.Item>
                                <Breadcrumb.Item>某应用</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div style={{clear: 'both'}}>{this.props.children}</div>
                    </div>
                    <div className="layout-footer">
                        Ant Design 版权所有 © 2015 由蚂蚁金服体验技术部支持
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default Layout;