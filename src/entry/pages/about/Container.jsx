import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import Dustbin from './Dustbin';
import Box from './Box';

const Container=React.createClass({
    getInitialState:function(){
      return {
          cards:[{
              id:1,
              text: 'AAA'
          }, {
              id:2,
              text: 'BBB'
          }, {
              id:3,
              text: 'CCC'
          }, {
              id:4,
              text: 'DDD'
          }, {
              id:5,
              text: 'EEE'
          }, {
              id:6,
              text: 'FFF'
          },{
              id:100,
              text: '拖放字段到这里'
          }],
          show:false
      }
    },
    setShow:function(option){
        this.setState({
            show:option
        })
    },
    render:function() {
        return (
            <div>
                <div style={{ overflow: 'hidden', clear: 'both' }}>
                    <Dustbin ref="Dustbin" cards={this.state.cards}/>
                </div>
                <div style={{ overflow: 'hidden', clear: 'both' }}>
                    <Box setShow={this.setShow} name='Glass' />
                    <Box setShow={this.setShow} name='Banana'/>
                    <Box setShow={this.setShow} name='Paper' />
                </div>
                <div><button onClick={this.save}>保存</button></div>
            </div>
        );
    },
    save(){
        console.log(this.refs.Dustbin.handler.component.state)
    }
})
export default DragDropContext(HTML5Backend)(Container);
