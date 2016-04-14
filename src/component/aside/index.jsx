import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router'
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './less/index.less';


import IndexStore from  './stores/index'
import IndexActions from  './actions/index'

const Aside=React.createClass({
    mixins: [Reflux.connect(IndexStore, 'data')],
    getInitialState:function(){
        return{
            data:[]
        }
    },
    componentWillMount:function(){
        const pathname=(this.props.location && this.props.location.pathname);
        this.key=pathname.split('/')[1];
        IndexActions.getMenu({path: this.key});
    },
    render:function(){
        const pathname=(this.props.location && this.props.location.pathname);
        let key=pathname.split('/')[1];
        if(key!=this.key)
        {
            this.key=key;
            IndexActions.getMenu({path: key});
        }
        let defaultOpenKeys=[]
        this.state.data.map(function (item) {
            if(!!item.child){
                defaultOpenKeys.push(item.key)
            }
        })

        return(
            <aside className="layout-sider">{this.state.data.length?this.renderMenu(defaultOpenKeys):null}</aside>
        )
    },
    renderMenu:function(key){
        return (
                <Menu theme="dark" mode="inline" selectedKeys={[this.props.location && this.props.location.pathname]} defaultOpenKeys={key}>
                    {this.state.data.map(function (item) {
                        if(!!item.child){
                            return(
                                <SubMenu key={item.key} title={<span><i className={item.icon}></i> {item.name}</span>}>
                                    {item.child.map(function (subMenu) {
                                        return( <Menu.Item key={subMenu.url}><Link to={subMenu.url}>{subMenu.name}</Link></Menu.Item>)
                                    })}
                                </SubMenu>
                            )
                        }else{
                            return (
                                <Menu.Item key={item.url}>
                                    <Link to={item.url}><i className={item.icon}></i> {item.name}</Link>
                                </Menu.Item>)
                        }
                    })}
                </Menu>
        )
    }
})

export default Aside;