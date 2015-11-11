import React from 'react';
import ReactDOM from 'react-dom';
import utils from '../utils';

export default (WrappedComponent, options, props) => {
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
                moved: false,
                mouseDown: false,
                mouseDownTopGap: 0,
                mouseDownLeftGap: 0
            }
        },

        componentDidMount() {
            var node = ReactDOM.findDOMNode(this.refs.wrappedComp);
            node.addEventListener('mousedown', this.onNodeMouseDown);

            options.containerNode = options.containerNode || node.parentNode;
        },

        componentWillUnmount() {
            var node = ReactDOM.findDOMNode(this.refs.wrappedComp);
            node.removeEventListener('mousedown', this.onNodeMouseDown);
        },

        onNodeMouseDown(event) {
            if (event.button) return false;

            var node = ReactDOM.findDOMNode(this.refs.wrappedComp);
            var nodeOffset = utils.getOffset(node);

            this.setState({
                mouseDown: true,
                mouseDownTopGap: event.pageY - nodeOffset.top,
                mouseDownLeftGap: event.pageX - nodeOffset.left
            });

            options.containerNode.addEventListener('mousemove', this.onContainerMouseMove);
            options.containerNode.addEventListener('mouseup', this.onContainerMouseUp);
        },

        onContainerMouseMove(event) {
            this.setState({
                moved: true
            });

            var left = (event.x - options.containerNode.getBoundingClientRect().left) - this.state.mouseDownLeftGap;
            var top = (event.y - options.containerNode.getBoundingClientRect().top) - this.state.mouseDownTopGap;

            var node = ReactDOM.findDOMNode(this.refs.wrappedComp);
            var nodeRect = node.getBoundingClientRect();
            var containerRect = options.containerNode.getBoundingClientRect();

            if (top >= 0 && top + nodeRect.height <= containerRect.height) {
                props.top = top;
            }

            if (left >= 0 && left + nodeRect.width <= containerRect.width) {
                props.left = left;
            }
        },

        onContainerMouseUp(event) {
            options.containerNode.removeEventListener("mousemove", this.onContainerMouseMove);
            options.containerNode.removeEventListener("mouseup", this.onContainerMouseUp);

            if(this.state.moved) {
                this.refs.wrappedComp.props.onDrop(this);
            }

            if(this.isMounted()) {
                this.setState(this.getInitialState());
            }
        },

        getCompositeComponent() {
            return this.refs.wrappedComp;
        },

        updateProps(newProps) {
            newProps = newProps || {};
            for(let key in newProps) {
                props[key] = newProps[key];
            }
        },

        render() {
            return <WrappedComponent ref="wrappedComp" {...props} />;
        }
    });

    return Draggable;
};