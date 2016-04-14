import React, {PropTypes} from 'react';
import Reflux from 'reflux'
import DataStore from  '../../entry/pages/home/stores/dataStore'
import DataActions from  '../../entry/pages/home/actions/dataActions'


var NavItem = React.createClass({
    mixins: [Reflux.connect(DataStore, 'data')],
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
    render: function () {
        console.log('1',this.state.data);
        return (
            <div>
                111
            </div>
        )
    }

})

export default NavItem;