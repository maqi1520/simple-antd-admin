import React from 'react';
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'


const Line = React.createClass({
    render() {
        const {className, width, height} = this.props;
        return (
            <div ref="bar" className={className} style={{height:height,width:width}}>
            </div>
        );
    },
    componentDidMount: function () {
        const {xAxisData, data, title} = this.props;
        const legendData=[];
        const seriesData=[];
        data.map(function(value){
            legendData.push(value.name);
            seriesData.push({
                name: value.name,
                type: 'bar',
                barWidth:30,
                data: value.data
            })
        })
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(this.refs.bar);
        // 绘制图表
        this.chart.setOption({
            title: {
                text: title,
                left: 20,
                top:20
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: legendData,
                right: 40,
                top:20
            },
            grid: {
                x: 50,
                x2: 50,
                y: 70,
                y2: 30,
                borderWidth: 0
            },
            xAxis: [
                {
                    type: 'category',
                    axisLine: false,
                    splitLine: false,
                    axisTick: {
                        length: 4,
                        lineStyle: {
                            color: '#ccc'
                        }
                    },
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: true,
                    axisTick: false,
                    splitLine: {
                        lineStyle: {
                            color: '#e9e9e9'
                        }
                    }
                }
            ],
            color: ["#5d9cec", "#62c87f", "#f15755", "#fc863f", "#7053b6", "#ffce55", "#6ed5e6", "#f57bc1", "#dcb186", "#647c9d", "#cc99ff"],
            series: seriesData
        });
    },
    componentWillUnmount: function () {
        this.chart.dispose();
    }
});

export default Line;