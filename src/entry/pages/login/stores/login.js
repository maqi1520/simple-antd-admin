import Reflux from 'reflux'
import { message } from 'antd';

import DataActions from '../actions/login'

import {setCookie} from '../../../../utils'

let DataStore = Reflux.createStore({
    listenables: DataActions,
    init: function(){
        this.data=[];
    },
    onLogin: function (model, index) {
        $.post('/update', model, function (data) {
            this.items[index] = data;
            this.trigger(this.items);
        }.bind(this));
    }
});


export default DataStore
