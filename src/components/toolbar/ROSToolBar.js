import React from 'react';
import classNames from 'classnames';

var ROSToolBar = React.createClass({
    propTypes: {
        includeShadow: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            includeShadow: true
        }
    },

    getStyle() {
        let toolbar = classNames('ros-toolbar', {
            'shadow': this.props.includeShadow
        });

        return {
            toolbar
        }
    },

    render() {
        var classes = this.getStyle();

        return (
            <div className={classes.toolbar}>
                {this.props.children}
            </div>
        );
    }
});

export default ROSToolBar;
