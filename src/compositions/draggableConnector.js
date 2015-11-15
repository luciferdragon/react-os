import React from 'react';
import ReactDOM from 'react-dom';
import utils from '../utils';

export default (WrappedComponent) => {
    const Draggable = React.createClass({
        getInitialState() {
            return {
                moved: false,
                mouseDown: false,
                mouseDownTopGap: 0,
                mouseDownLeftGap: 0,
                originalTop: 0,
                originalLeft: 0
            }
        },

        propTypes: {
            containerNode: React.PropTypes.object,
            handler: React.PropTypes.string,
            onDrop: React.PropTypes.func
        },

        getDefaultProps() {
            return {
                containerNode: null,
                handler: null,
                onDrop: utils.emptyFn()
            }
        },

        getHandlerNode() {
            var node = ReactDOM.findDOMNode(this.refs.wrappedComp);
            if (this.props.handler) {
                node = node.querySelector(this.props.handler);
            }
            return node;
        },

        componentDidMount() {
            var node = this.getHandlerNode();

            node.addEventListener('mousedown', this.onNodeMouseDown);
        },

        componentWillUnmount() {
            var node = this.getHandlerNode();
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

            this.props.containerNode.addEventListener('mousemove', this.onContainerMouseMove);
            this.props.containerNode.addEventListener('mouseup', this.onContainerMouseUp);
        },

        onContainerMouseMove(event) {
            let wrappedCompNode = ReactDOM.findDOMNode(this.refs.wrappedComp);

            if(!this.state.moved) {
                this.setState({
                    moved: true,
                    originalTop: wrappedCompNode.style.top,
                    originalLeft: wrappedCompNode.style.left
                });
            }

            var left = (event.x - this.props.containerNode.getBoundingClientRect().left) - this.state.mouseDownLeftGap;
            var top = (event.y - this.props.containerNode.getBoundingClientRect().top) - this.state.mouseDownTopGap;

            var node = this.getHandlerNode();
            var nodeRect = node.getBoundingClientRect();
            var containerRect = this.props.containerNode.getBoundingClientRect();

            if (top >= 0 && top + nodeRect.height <= containerRect.height) {
                wrappedCompNode.style.top = top + 'px';
            }

            if (left >= 0 && left + nodeRect.width <= containerRect.width) {
                wrappedCompNode.style.left = left + 'px';
            }
        },

        onContainerMouseUp(event) {
            this.props.containerNode.removeEventListener("mousemove", this.onContainerMouseMove);
            this.props.containerNode.removeEventListener("mouseup", this.onContainerMouseUp);

            if(!this.state.moved) {
                return;
            }

            let wrappedCompNode = ReactDOM.findDOMNode(this.refs.wrappedComp);

            let top = parseInt(wrappedCompNode.style.top);
            let left = parseInt(wrappedCompNode.style.left);

            if(this.props.resetPositionOnDrop) {
                wrappedCompNode.style.top = this.state.originalTop;
                wrappedCompNode.style.left = this.state.originalLeft;
            }

            if (this.state.moved) {
                this.props.onDrop(this, top, left);
            }

            if (this.isMounted()) {
                this.setState(this.getInitialState());
            }
        },

        getCompositeComponent() {
            return this.refs.wrappedComp;
        },

        render() {
            return <WrappedComponent ref="wrappedComp" {...this.props} />;
        }
    });

    return Draggable;
};