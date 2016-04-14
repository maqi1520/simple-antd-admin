import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

var Users=React.createClass({
    render:function(){
        return (
            <div>
                1111
            </div>
        )
    }
})

export default DragDropContext(HTML5Backend)(Users);