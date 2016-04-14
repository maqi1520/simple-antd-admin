import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import Layout from '../common/Layout.jsx';
import {RouteHandler} from 'react-router';
import View from 'lib/View.jsx';
import 'font-awesome/css/font-awesome.css';
import 'mousetrap';
import Loader from 'react-loader';
import classnames from 'classnames';

import { hosts as fetchHosts } from '../apis/index.es6';

import Select2 from 'Select2.jsx';
import 'select2/dist/css/select2.css';
import { PageHeader, Button } from 'react-bootstrap';

import { store } from './Algorithm.js';
var redrawHostMap = require('./HostMapPainter.js').redrawHostMap;
var initHostMap = require('./HostMapPainter.js').initHostMap;
var reloadHostMap = require('./Stock.js').reload;

export default class MainView extends View {
    constructor(props, context) {
        super(props, context);

        this.state = {
            grid: [],
            loading: true,
            windowHeight: 0,
            tagKeys: [],
            groupBy: "",
            isFullScreen: false,
            svgWidth: 0,
            svgHeight: 0,
            hosts: [],
            warehouse: store([])
        };

        this.updateDimensions = this.updateDimensions.bind(this);
    }

    onAppClick(hostname, appname) {
        window.location.href = `${BlueWare.urlPrefix}#/overview/map/${hostname}/${appname}`;
    }

    updateDimensions() {
        if (this.state.isFullScreen) {
            this.state.svgWidth = window.innerWidth;
            this.state.svgHeight = window.innerHeight;
        } else {
            this.state.svgWidth = window.innerWidth - 90;
            this.state.svgHeight = window.innerHeight - 200;
        }

        this.setState({
            isFullScreen: this.state.isFullScreen
        });

        redrawHostMap(this.state.warehouse, this.state.svgWidth, this.state.svgHeight, this.onAppClick);
    }

    componentWillMount() {
        this.updateDimensions();
        $("body").css("overflow", "inherit");
    }

    componentDidMount() {
        super.componentDidMount();

        $('.sidebar .active').removeClass('active');
        $('.sidebar-overview').addClass('active');

        $(window).resize(this.updateDimensions);
        $('body').css('overflow', 'hidden');

        this.updateDimensions();

        fetchHosts().then(res => {
            let tagKeys = res.reduce((init, host)=> {
                host.host_tags.forEach(item => {
                    let [k,v] = item.split(":")
                    if (k && init.indexOf(k) === -1) {
                        init.push(k)
                    }
                });
                return init;
            }, []);

            // this.state.hosts = res.map((item) => {
            //   var tags = item.host_tags;
            //   var hostItem = {host: item.host_name};
            //   tags.forEach((tag) => {
            //     const kv = tag.split(":");
            //     hostItem[kv[0]] = kv[1];
            //   });
            //   return hostItem;
            // });
            this.state.tagKeys = tagKeys;
            this.state.grid = {
                data: res.sort((a, b) => a.host_id - b.host_id)
            }

            // TODO: more information show in hexagon
            this.state.hosts=res.map((item)=>{
                var tags = item.host_tags;
                var apps = item.apps;
                var hostItem = {host: item.host_name,tags:{},apps:{},up:item.up,host_id:item.host_id};
                tags.forEach((tag) => {
                    const kv = tag.split(":");
                    hostItem["tags"][kv[0]] = kv[1];
                });
                apps.forEach((app) => {
                    const kv = app.split(":");
                    hostItem["apps"][kv[0]] = true;
                });
                return hostItem;
            });


            this.setState({
                loading: false,
                warehouse: store(this.state.hosts)
            });

            this.updateDimensions();
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
        $("body").css("overflow-y", "scroll");
    }

    handleRequestFullScreen(forceClose) {
        if (forceClose === true) {
            this.state.isFullScreen = false;
        } else {
            this.state.isFullScreen =  !this.state.isFullScreen
        }
        this.updateDimensions();
    }

    groupBy(e) {
        var values = $(e.target).val() || [];

        this.state.warehouse.clear();

        values.forEach((item) => {
            this.state.warehouse.addRule(item);
        });

        this.updateDimensions();

        reloadHostMap();
    }

    renderTitleBar() {
        return (
            <PageHeader>
                拓扑
            </PageHeader>
        );
    }

    renderToolBar() {
        return (
            <div className="ci-hostmap-toolbar">
                <Select2
                    multiple
                    onChange={this.groupBy.bind(this)}
                    className="host-tag-selector"
                    options={{
            placeholder: '依据标签对平台分组',
            maximumSelectionLength: 3
          }}
                    data={this.groupKeys()} />
                <Button className="full-screen-btn" onClick={this.handleRequestFullScreen.bind(this)}>
                    <i className='fa fa-arrows-alt' />
                </Button>
            </div>
        );
    }

    groupKeys() {
        return _.map(this.state.tagKeys, (tag) => {
            return {text: tag, id: tag};
        })
    }

    renderLoading() {
        if (this.state.loading) {
            return (
                <div style={{
            position: 'absolute',
            left: '50%',
            top: '30%'
          }}>
                    <Loader color="#fff" />
                </div>
            );
        }
    }

    render() {
        const className = classnames({
            'hostmap-wrapper' : true,
            'fullscreen': this.state.isFullScreen
        });

        return (
            <Layout>
                { this.renderTitleBar() }
                <div style={{
            position: 'relative'
          }} className={className}>
                    { this.renderToolBar() }
                    <div id="hostmap" />
                    { this.renderLoading() }
                    <RouteHandler hosts={this.state.grid}/>
                </div>
            </Layout>
        );
    }
}



/** WEBPACK FOOTER **
 ** modules/hostmap/MainView.jsx
 **/

var stock = require('./Stock.js').stock;

function redrawHostMap(warehouse, width, height, appClickCallback) {
  stock(warehouse, width, height, appClickCallback);
}

exports.redrawHostMap = redrawHostMap;