import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import utils from '../../utils';
import postal from 'postal';
import Layouts from '../../constants/layouts';

var ROSContextMenu = React.createClass({
    childContextTypes: {
        parentNode: React.PropTypes.object
    },

    getChildContext: function () {
        return {
            parentNode: this
        }
    },

    getInitialState() {
        return {
            open: false,
            hover: false,
            x: 0,
            y: 0
        }
    },

    propTypes: {
        layout: React.PropTypes.string,
        includeShadow: React.PropTypes.bool,
        containerCornersGap: React.PropTypes.number,
        closeMenuPointerDistance: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            layout: Layouts.VERTICAL,
            includeShadow: true,
            containerCornersGap: 20,
            closeMenuPointerDistance: 500
        }
    },

    closeTree() {
        this.setState(this.getInitialState());
    },

    onContextMenuOpenBusEvent(event){
        let node = ReactDOM.findDOMNode(this);
        if(event.id != node.dataset.reactid) {
            this.setState(this.getInitialState());
        }
    },

    subscribeBusEvents() {
        this.subscription = postal.subscribe({
            channel: 'contextmenu',
            topic: 'state.open',
            callback: this.onContextMenuOpenBusEvent
        });
    },

    unsubscribeBusEvents() {
        this.subscription.unsubscribe();
    },

    componentDidMount() {
        this.subscribeBusEvents();

        let node = ReactDOM.findDOMNode(this);
        let parentNode = node.parentNode;

        parentNode.addEventListener("contextmenu", this.onContextMenuClick);
        document.addEventListener("mousedown", this.onDocumentMouseDown);
        document.addEventListener("mousemove", this.onDocumentMouseMove);
    },

    componentWillUnmount() {
        this.unsubscribeBusEvents();

        let node = ReactDOM.findDOMNode(this);
        let parentNode = node.parentNode;

        parentNode.removeEventListener("contextmenu", this.onContextMenuClick);
        document.removeEventListener("mousedown", this.onDocumentMouseDown);
        document.removeEventListener("mousemove", this.onDocumentMouseMove);
    },

    onDocumentMouseMove(event) {
        if (this.state.open && !this.state.hover) {
            var node = ReactDOM.findDOMNode(this);
            let nodeRect = node.getBoundingClientRect();

            let pageX = event.pageX;
            let pageY = event.pageY;
            let closeDistance = this.props.closeMenuPointerDistance;
            let close = false;

            if (pageX < nodeRect.left) {
                close = nodeRect.left - pageX > closeDistance;
            } else if (pageX > nodeRect.left + nodeRect.width) {
                close = pageX - (nodeRect.left + nodeRect.width) > closeDistance;
            } else if (pageY < nodeRect.top) {
                close = nodeRect.top - pageY > closeDistance;
            } else if (pageY > nodeRect.top + nodeRect.height) {
                close = pageY - (nodeRect.top + nodeRect.height) > closeDistance;
            }

            if (close) {
                this.setState(this.getInitialState());
            }
        }
    },

    onDocumentMouseDown(event) {
        let node = ReactDOM.findDOMNode(this);

        let found = event.path.some(elem => {
            return elem === node;
        });

        if (!found) {
            this.setState(this.getInitialState());
        }
    },

    onContextMenuClick(event) {
        event.preventDefault();
        event.stopPropagation();

        this.replaceState(this.getInitialState());

        let state = {
            open: true,
            x: event.pageX,
            y: event.pageY
        };

        this.setState(state);
    },

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            let node = ReactDOM.findDOMNode(this);

            postal.publish({
                channel: 'contextmenu',
                topic: 'state.open',
                data: {
                    id: node.dataset.reactid
                }
            });
            this.checkContextMenuPosition();
        }
    },

    checkContextMenuPosition() {
        let node = ReactDOM.findDOMNode(this);
        let nodeRect = node.getBoundingClientRect();

        let newState = {};

        if (this.state.x + nodeRect.width > window.innerWidth) {
            let delta = (this.state.x + nodeRect.width) - window.innerWidth;
            newState.x = this.state.x - (delta + this.props.containerCornersGap);
        }

        if (this.state.y + nodeRect.height > window.innerHeight) {
            let delta = (this.state.y + nodeRect.height) - window.innerHeight;
            newState.y = this.state.y - (delta + this.props.containerCornersGap)
        }

        if (!isNaN(newState.x) || !isNaN(newState.y)) {
            this.setState(newState);
        }
    },

    onContextMenuMouseOver(event) {
        this.setState({
            hover: true
        });
    },

    onContextMenuMouseLeave(event) {
        this.setState({
            hover: false
        });
    },

    getStyle() {
        let contextMenu = classNames("ros-contextmenu flex", {
            'display-hidden': !this.state.open,
            'shadow': this.props.includeShadow,
            'horizontal': this.props.layout == Layouts.HORIZONTAL,
            'vertical flex-vbox': this.props.layout == Layouts.VERTICAL
        });

        let style = {
            top: this.state.y,
            left: this.state.x
        };

        return {
            contextMenu,
            style
        }
    },

    render() {
        let classes = this.getStyle();

        return (
            <div className={classes.contextMenu} style={classes.style} onMouseEnter={this.onContextMenuMouseOver}
                 onMouseLeave={this.onContextMenuMouseLeave}>
                {this.state.open && this.props.children}
            </div>
        );
    }
});

export default ROSContextMenu;
