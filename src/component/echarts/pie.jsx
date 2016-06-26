import React from 'react';
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'

import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'


const Pie = React.createClass({
    render() {
        const {className, width, height} = this.props;
        return (
            <div ref="line" className={className} style={{height:height,width:width}}>
            </div>
        );
    },
    setChart(){
        const {data, title} = this.props;
        const legendData = [];
        data.map(function (value) {
            legendData.push({name:value.name,icon:'circle'});
        })
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(this.refs.line);
        // 绘制图表
        this.chart.setOption({
            title: {
                text: title,
                left: 10,
                top: 20
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                data: legendData,
                itemWidth:12,
                orient: 'vertical',
                x: 10,
                y:60
            },
            color: ["#5d9cec", "#62c87f", "#f15755", "#fc863f", "#7053b6", "#ffce55", "#6ed5e6", "#f57bc1", "#dcb186", "#647c9d", "#cc99ff"],
            series : [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: [50, 100],
                    center : ['60%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:data
                }
            ]
        });
    },
    componentDidMount: function () {
        this.setChart();
    },
    componentDidUpdate(){
      this.setChart();
    },
    componentWillUnmount: function () {
        this.chart.dispose();
    }
});

export default Pie;