import React from 'react';
import utils from '../../utils';
import classNames from 'classnames';

var ROSIconWrapper = React.createClass({
    childContextTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },

    getChildContext: function () {
        return {
            width: this.props.width,
            height: this.props.height
        }
    },

    contextTypes: {
        requestNextZIndex: React.PropTypes.func,
        draggableMouseDown: React.PropTypes.bool
    },

    propTypes: {
        index: React.PropTypes.number,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        top: React.PropTypes.number,
        left: React.PropTypes.number
    },

    getInitialState() {
        return {
            zIndex: 1
        }
    },

    getDefaultProps() {
        return {
            index: 0,
            width: 96,
            height: 96,
            top: 0,
            left: 0
        }
    },

    updateZIndex(event) {
        this.setState({
            zIndex: this.context.requestNextZIndex(this.state.zIndex)
        });
    },

    getCompositeComponent() {
        return this.props.children;
    },

    getStyle() {
        let style = {
            width: this.props.width,
            height: this.props.height,
            top: this.props.top,
            left: this.props.left,
            zIndex: this.state.zIndex
        };

        let iconWrapper = classNames("ros-icon-wrapper flex flex-align-start flex-pack-center");

        return {
            iconWrapper,
            style
        }
    },

    render() {
        let classes = this.getStyle();

        return (
            <div className={classes.iconWrapper}
                 onMouseDown={this.updateZIndex}
                 onContextMenu={this.updateZIndex}
                 style={classes.style}>{this.props.children}</div>
        );
    }
});

export default ROSIconWrapper;
