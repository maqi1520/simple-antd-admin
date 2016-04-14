import React from 'react';
import Reflux from 'reflux'
import AsyncDom from '../../../common/AsyncDom'
import {Table, Popconfirm, Pagination} from 'antd'
import DataStore from  '../home/stores/dataStore'
import DataActions from  '../home/actions/dataActions'


const Tables = React.createClass({
    mixins: [Reflux.connect(DataStore, 'data'),AsyncDom],
    getInitialState: function () {
        return {
            data:{
                _count:0,
                data:[]
            },
            pageSize:2,
            current:1
        };
    },
    componentWillMount:function(){
        DataActions.getAll({limit:0,offset:this.state.pageSize});
    },
    handleConfirm:function(id,index){
        DataActions.deleteItem({id:id},index);
    },
    render: function () {
        const _this=this;
        const columns = [{
            title: '商品标题',
            dataIndex: 'title',
            render(text) {
                return <a href="#">{text}</a>;
            }
        },{
            title:'操作',
            dataIndex:'id',
            render(id,row, index){
                return (
                    <span>
                        <Popconfirm title="确定要删除这个任务吗？" placement="left" onConfirm={_this.handleConfirm.bind(_this,id,index)}>
                            <a href="#">删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        }];

        return (
            <div>
                <Table columns={columns} dataSource={this.state.data.data} pagination={false}/>
                {this.state.data._count > this.state.pageSize ?
                    <Pagination
                        className="ant-table-pagination"
                        showTotal={this.showTotal}
                        defaultCurrent={this.state.current}
                        current={this.state.current}
                        total={this.state.data._count}
                        pageSize={this.state.pageSize}
                        onChange={this.onChange}/> : ''}
            </div>
        )
    },
    showTotal: function (a) {
        return `共${a}条`;
    },
    onChange: function (current) {
        DataActions.getAll({limit: (current - 1) * this.state.pageSize, offset: this.state.pageSize});
        this.setState({'current': current})
    }
})

export default Tables;