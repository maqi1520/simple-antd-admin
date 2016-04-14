import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';



const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            originalIndex: props.findCard(props.id).index
        };
    },

    endDrag(props, monitor) {
        const { id: droppedId, originalIndex } = monitor.getItem();
        const didDrop = monitor.didDrop();

        if (!didDrop) {
            props.moveCard(droppedId, originalIndex);
        }
    }
};

const cardTarget = {
    canDrop() {
        return false;
    },

    hover(props, monitor) {
        const { id: draggedId } = monitor.getItem();
        const { id: overId } = props;

        if (draggedId !== overId) {
            const { index: overIndex } = props.findCard(overId);
            if(!draggedId){
                props.moveCard(100,overIndex);
            }else{
                props.moveCard(draggedId, overIndex);
            }
        }
    }
};
class Card extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
        moveCard: PropTypes.func.isRequired,
        findCard: PropTypes.func.isRequired
    };

    render() {
        const { text, isDragging, connectDragSource, connectDropTarget,style } = this.props;
        const opacity = isDragging ? 0 : 1;


        return connectDragSource(connectDropTarget(
            <div className={this.props.className} style={{...style,opacity }}>
                {text}
            </div>
        ));
    }
}
Card = DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))(Card)
Card = DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))(Card)
export default Card;
