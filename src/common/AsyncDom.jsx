import React from 'react';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false,color:'#f00' });

var AsyncDom={
    componentWillMount:function(){
        NProgress.start();
    },
    componentDidMount:function(){
        NProgress.done();
    }
}

export default AsyncDom;