import React from 'react';
import AsyncDom from '../../../common/AsyncDom.jsx'
import Line from '../../../component/echarts/line';

const ChartLine = React.createClass({
    mixins: [AsyncDom],
    render: function () {
        const  data=[
            {
                name:'衣服',
                data: [5, 20, 36, 10, 10, 20]
            },
            {
                name:'袜子',
                data: [15, 2, 16, 16, 18, 20]
            }
        ]
        return (
            <div>
                <Line title="销量统计图"
                      data={data}
                      xAxisData={["一月", "二月", "三月", "四月", "五月", "六月"]}
                      className="line-chart"
                      height="340px" width="100%" />
            </div>
        )
    }
})

export default ChartLine;