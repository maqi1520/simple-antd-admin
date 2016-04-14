import React,{PropTypes} from 'react';
import { Router} from 'react-router'
import { Form, Input, Button, Checkbox, Row, Col, notification } from 'antd'

import DataStore from  './stores/login'
import DataActions from  './actions/login'
import './less/index.less'
import {setCookie} from './../../../utils/index.js'


const FormItem=Form.Item;

var Login = React.createClass({
    getInitialState:function(){
        return{
            loading:false
        }
    },
    contextTypes:{
      router:PropTypes.object.isRequired
    },
    render:function(){
        const { getFieldProps } = this.props.form;
        const nameProps = getFieldProps('name', {
            rules: [
                { required: true, message: '用户名不能为空！' },
                { min: 5,max:15, message: '用户名大于5位小于15位！！' }
            ]
        });
        const passwdProps = getFieldProps('password', {
            rules: [
                { required: true, whitespace: true, message: '密码不能为空！' },
                { min: 6, max:18, message: '密码大于6位小于18位！' },
            ]
        });
        return (
            <Row className="login-row" type="flex" justify="space-around" align="middle">
                <Col span="8">
                    <Form horizontal form={this.props.form} onSubmit={this.handleSubmit} className="form-login">
                        <row>
                            <Col span='20' offset='2'>
                                <div className="header-title"><i className="fa fa-sign-in"></i>登录</div>
                            </Col>
                        </row>
                        <FormItem
                            label='用户名：'
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}
                            hasFeedback>
                            <Input placeholder='admin' {...nameProps} />
                        </FormItem>
                        <FormItem
                            label='密码：'
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}
                            hasFeedback>
                            <Input type='password' placeholder='123456' autoComplete="off" {...passwdProps} />
                        </FormItem>
                        <Row className="">
                            <Col span='10' offset='6'>
                                <Checkbox {...getFieldProps('agreement',{initialValue:false})}/>记住我
                            </Col>
                            <Col span='4' className="text-right">
                                <a>忘记密码？</a>
                            </Col>
                        </Row>
                        <Row>
                            <Col span='14' offset='6'>
                                <Button type="primary" size="large" htmlType="submit" className="login-btn" loading={this.state.loading}>确定</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        )
    },
    handleSubmit:function(e){
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            this.setState({'loading':true});
            setCookie('uid',1);
            console.log('收到表单值：', values);
            this.context.router.push('/')
        });
    }
})

Login = Form.create()(Login);

export default Login;