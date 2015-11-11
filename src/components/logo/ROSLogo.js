import React from 'react';
import classNames from 'classnames';

var ROSLogo = React.createClass({
    propTypes: {
        top: React.PropTypes.number,
        left: React.PropTypes.number,
        fontSize: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            top: 20,
            left: 20,
            fontSize: 36
        }
    },

    getStyle() {
        let style = {
            top: this.props.top,
            left: this.props.left,
            fontSize: this.props.fontSize
        };

        return {
            style
        }
    },

    render() {
        let classes = this.getStyle();

        return (
            <div className="ros-logo" style={classes.style}>
                {this.props.children}
            </div>
        );
    }
});

export default ROSLogo;