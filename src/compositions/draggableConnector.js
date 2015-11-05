import React from 'react';
import ReactDOM from 'react-dom';
import utils from '../utils';

export default (WrappedComponent, containerNode, props) => {
    const Draggable = React.createClass({
        childContextTypes: {
            draggableMouseDown: React.PropTypes.bool
        },

        getChildContext() {
            return {
                draggableMouseDown: this.state.mouseDown
            }
        },

        getInitialState() {
            return {
                mouseDown: false
            }
        },

        componentDidMount() {
            //var node = ReactDOM.findDOMNode(this.refs.wrappedComp);
            //node.addEventListener('mousedown', this.onNodeMouseDown);
            //
            //containerNode = containerNode || node.parentNode;
        },

        componentWillUnmount() {
            //node.removeEventListener('mousedown', this.onNodeMouseDown);
        },

        onNodeMouseDown(event) {
            //if(event.button) return false;
            //this.setState({
            //    mouseDown: true
            //});
            //
            //containerNode.addEventListener('mousemove', this.onContainerMouseMove);
            //containerNode.addEventListener('mouseup', this.onContainerMouseUp);
        },

        onContainerMouseMove(event) {
            //var x = event.x - containerNode.getBoundingClientRect().left;
            //var y = event.y - containerNode.getBoundingClientRect().top;
            //
            //var node = ReactDOM.findDOMNode(this.refs.wrappedComp);
            //
            //node.style.top = y +'px';
            //node.style.left = x +'px';
        },

        onContainerMouseUp(event) {
            //this.setState({
            //    mouseDown: false
            //});
            //
            //containerNode.removeEventListener ("mousemove" , this.onContainerMouseMove);
            //containerNode.removeEventListener ("mouseup" , this.onContainerMouseUp);
        },

        render() {
            return <WrappedComponent draggable={true} ref="wrappedComp" {...props} />;
        }
    });

    return Draggable;
};