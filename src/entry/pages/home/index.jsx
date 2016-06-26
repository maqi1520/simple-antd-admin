import React from 'react';
import Reflux from 'reflux'
import AsyncDom from '../../../common/AsyncDom'
import {Table, Popconfirm, Pagination,Row, Col, Button, Modal} from 'antd'
import DataStore from  './stores/dataStore'
import DataActions from  './actions/dataActions'


import Line from '../../../component/echarts/line';
import Pie from '../../../component/echarts/pie';


var Index = React.createClass({
    mixins: [Reflux.connect(DataStore, 'data'), AsyncDom],
    getInitialState: function () {
        const data = [
            {
                name: '衣服',
                data: [5, 20, 36, 10, 10, 20]
            },
            {
                name: '袜子',
                data: [15, 2, 16, 16, 18, 20]
            }
        ]
        const pieData = [
            {value: 335, name: '直接访问'},
            {value: 310, name: '邮件营销'},
            {value: 234, name: '联盟广告'},
            {value: 135, name: '视频广告'},
            {value: 1548, name: '搜索引擎'}
        ];
        return {
            data: {
                _count: 0,
                data: []
            },
            pageSize: 2,
            current: 1,
            visible: false,
            lineData: data,
            pieData: pieData
        };
    },
    componentWillMount: function () {
        DataActions.getAll({limit: 0, offset: this.state.pageSize});
    },
    handleConfirm: function (id, index) {
        DataActions.deleteItem({id: id}, index);
    },
    render: function () {
        const _this = this;
        const columns = [{
            title: '商品标题',
            dataIndex: 'title',
            render(text) {
                return <a href="#">{text}</a>;
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            render(id, row, index){
                return (
                    <span>
                        <Popconfirm title="确定要删除这个任务吗？" placement="left"
                                    onConfirm={_this.handleConfirm.bind(_this,id,index)}>
                            <a href="#">删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        }];
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>显示对话框</Button>
                <Modal title="第一个 Modal" visible={this.state.visible}
                       onOk={this.handleOk} onCancel={this.handleCancel}>
                    <p>对话框的内容</p>

                    <p>对话框的内容</p>

                    <p>对话框的内容</p>
                </Modal>
                <Row>
                    <Col span="16" style={{paddingRight:"16px"}}>
                        <Line title="销量统计图"
                              data={this.state.lineData}
                              xAxisData={["一月", "二月", "三月", "四月", "五月", "六月"]}
                              className="line-chart"
                              height="340px" width="100%"/>
                    </Col>
                    <Col span="8">
                        <Pie title="来源访问统计图"
                             data={this.state.pieData}
                             className="line-chart"
                             height="340px" width="100%"/>
                    </Col>
                </Row>
                <Table columns={columns} dataSource={this.state.data.data} pagination={false}/>
                {this.state.data._count > this.state.pageSize ?
                    <div className="clearfix">
                        <Pagination
                            className="ant-table-pagination"
                            showTotal={this.showTotal}
                            defaultCurrent={this.state.current}
                            current={this.state.current}
                            total={this.state.data._count}
                            pageSize={this.state.pageSize}
                            onChange={this.onChange}/>
                        </div>
                 : ''}
            </div>
        )
    },
    showTotal: function (a) {
        return `共${a}条`;
    },
    onChange: function (current) {
        DataActions.getAll({limit: (current - 1) * this.state.pageSize, offset: this.state.pageSize});
        this.setState({'current': current})
    },
    showModal() {
        this.setState({
            visible: true
        });
    },
    handleOk() {
        console.log('点击了确定');
        this.setState({
            visible: false
        });
    },
    handleCancel(e) {
        console.log(e);
        this.setState({
            visible: false
        });
    }
});

export default Index;
