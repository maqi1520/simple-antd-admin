import Reflux from 'reflux'
import IndexActions from '../actions/index'


let IndexStore = Reflux.createStore({
    listenables: IndexActions,
    init: function(){
        this.data=[];
    },
    onGetMenu: function (model, index) {
        $.get('/data/menu.json',model, function (data) {
            this.data = data;
            this.trigger(this.data);
        }.bind(this));
    }
});




export default IndexStore
