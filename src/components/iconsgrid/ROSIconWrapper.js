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
        requestInitialPositionFromGrid: React.PropTypes.func,
        requestNextZIndex: React.PropTypes.func,
        draggableMouseDown: React.PropTypes.bool
    },

    propTypes: {
        index: React.PropTypes.number,
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },

    getInitialState() {
        return {
            zIndex: 1,
            x: 0,
            y: 0
        }
    },

    getDefaultProps() {
        return {
            index: 0,
            width: 96,
            height: 96
        }
    },

    componentDidMount() {
        utils.nextTick(this.setPosition);
        window.addEventListener('resize', this.setPosition);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.setPosition);
    },

    setPosition() {
        var position = this.context.requestInitialPositionFromGrid(this.props.index);

        this.setState(position);
    },

    updateZIndex(event) {
        this.setState({
            zIndex: this.context.requestNextZIndex()
        });
    },

    getStyle() {
        let style = {
            width: this.props.width,
            height: this.props.height,
            top: this.state.y,
            left: this.state.x,
            zIndex: this.state.zIndex
        };

        let iconWrapper = classNames("ros-icon-wrapper flex flex-align-start flex-pack-center", {
            "animated": !this.context.draggableMouseDown
        });

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
