import React, { PropTypes, Component } from 'react';
import ItemTypes from './ItemTypes';
import { DropTarget } from 'react-dnd';
import update from 'react/lib/update';
import Card from './Card';

const style = {
    minHeight: '12rem',
    width: '16rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left'
};

const boxTarget = {
    hover: function (props, monitor, component) {
        // You can disallow drop based on props or item
        var item = monitor.getItem();
        var isJustOverThisOne = monitor.isOver();
        if(item.isNew && isJustOverThisOne){
            component.setState({show:true})
        }else{
            component.setState({show:false})
        }
    },
    drop(props, monitor, component) {
        var item=monitor.getItem()
        if(!!item.isNew){
            component.setState({show:false})
            component.appendCard(item);
        }
        return {name: 'Dustbin'};
    }
};
 const Dustbin=React.createClass({
     getInitialState(){
       return {
           cards: this.props.cards,
           show:false
       }
     },
     propTypes:{
         connectDropTarget: PropTypes.func.isRequired,
         isOver: PropTypes.bool.isRequired,
         canDrop: PropTypes.bool.isRequired
     },
     moveCard(id, atIndex) {
         const { card, index } = this.findCard(id);
         this.setState(update(this.state, {
             cards: {
                 $splice: [
                     [index, 1],
                     [atIndex, 0, card]
                 ]
             }
         }));
     },

     appendCard(item){
         const { card, index } = this.findCard(100);
         this.setState(update(this.state, {
             cards: {
                 $splice: [
                     [index, 0, {id:Math.round(Math.random()*1000),text:item.name}]
                 ]
             }
         }));
     },

     findCard(id) {
         const { cards } = this.state;
         const card = cards.filter(c => c.id === id)[0];

         return {
             card,
             index: cards.indexOf(card)
         };
     },
     render() {
         const { canDrop, isOver, connectDropTarget,item } = this.props;
         const isActive = canDrop && isOver;

         let backgroundColor = '#222';
         if (isActive) {
             backgroundColor = 'darkgreen';

         } else if (canDrop) {
             backgroundColor = 'darkkhaki';
         }

         let display='none';
         if(this.state.show){
             display="block"
         }


         const { cards } = this.state;



         return connectDropTarget(
             <div style={{ ...style, backgroundColor }}>
                 {cards.map((card, i) => {
                     if(card.id==100)
                     {
                         return (
                             <Card className="bg-placehoder" style={{display}} key={card.id}
                                   id={card.id}
                                   text={card.text}
                                   findCard={this.findCard}
                                   moveCard={this.moveCard} />
                         );
                     }else{
                         return (
                             <Card className="bg-write" key={card.id}
                     id={card.id}
                     text={card.text}
                     moveCard={this.moveCard}
                     findCard={this.findCard} />
                         );
                     }
                 })}
             </div>
         );
     }
 })
export default DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    item:monitor.getItem()
}))(Dustbin)