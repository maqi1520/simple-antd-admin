import Reflux from 'reflux'
import { message } from 'antd';

import DataActions from './../actions/dataActions'

let DataStore = Reflux.createStore({
    listenables: DataActions,
    init: function(){
        this.data=[];
    },
    onGetAll: function (model) {
        $.get('/data/all.json',model, function (data) {
            for(let i=0;i<data.data.length;i++){
                data.data[i]['key']=data.data[i]['id']
            }
            this.data = data;
            this.trigger(this.data);
        }.bind(this));
    },
    onAddItem: function (model) {
        $.post('/add', model, function (data) {
            this.items.unshift(data);
            this.trigger(this.items);
        }.bind(this));
    },
    onDeleteItem: function (model, index) {
        this.data.data.splice(index, 1);
        this.trigger(this.data);
        message.success('删除成功！');
        //$.post('/delete', model, function (data) {
        //    this.items.splice(index, 1);
        //    this.trigger(this.items);
        //}.bind(this));
    },
    onUpdateItem: function (model, index) {
        $.post('/update', model, function (data) {
            this.items[index] = data;
            this.trigger(this.items);
        }.bind(this));
    }
});


export default DataStore
