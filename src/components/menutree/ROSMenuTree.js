import React from 'react';
import classNames from 'classnames';
import Layouts from '../../constants/layouts';

var ROSMenuTree = React.createClass({
    getDefaultProps() {
        return {
            layout: Layouts.HORIZONTAL
        }
    },

    propTypes: {
        layout: React.PropTypes.string
    },

    render() {
        var classes = classNames('ros-menutree', {
            'horizontal flex': this.props.layout == Layouts.HORIZONTAL,
            'vertical flex flex-vbox': this.props.layout == Layouts.VERTICAL
        });

        return (
            <div className={classes}>
                {this.props.children}
            </div>
        );
    }
});

export default ROSMenuTree;
