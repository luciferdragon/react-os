import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Layouts from '../../constants/layouts';

var ROSMenuTree = React.createClass({
    childContextTypes: {
        parentNode: React.PropTypes.object,
        parentRoot: React.PropTypes.bool
    },

    getChildContext: function() {
        return {
            parentNode: this,
            parentRoot: true
        }
    },

    getDefaultProps() {
        return {
            layout: Layouts.HORIZONTAL
        }
    },

    propTypes: {
        layout: React.PropTypes.string
    },

    getStyle() {
        let menuTree = classNames("ros-menutree flex", {
            'horizontal': this.props.layout == Layouts.HORIZONTAL,
            'vertical flex-vbox': this.props.layout == Layouts.VERTICAL
        });

        return {
            menuTree
        }
    },

    render() {
        var classes = this.getStyle();

        return (
            <div className={classes.menuTree}>
                {this.props.children}
            </div>
        );
    }
});

export default ROSMenuTree;
