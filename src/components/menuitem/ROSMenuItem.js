import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

var ROSMenuItem = React.createClass({
    contextTypes: {
        parentNode: React.PropTypes.object,
        parentRoot: React.PropTypes.bool
    },

    childContextTypes: {
        parentNode: React.PropTypes.object,
        parentRoot: React.PropTypes.bool
    },

    getChildContext: function() {
        return {
            parentNode: this,
            parentRoot: false
        }
    },

    getInitialState() {
        return {
            open: false,
            hover: false,
            position: ''
        }
    },

    getDefaultProps() {
        return {
            title: '',
            iconClass: '',
            disabled: false,
            action: null
        }
    },

    propTypes: {
        title: React.PropTypes.string,
        iconClass: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        action: React.PropTypes.func
    },

    closeTree() {
        this.setState({
            open: false,
            hover: false,
            position: ''
        });

        if(!this.context.parentRoot) {
            this.context.parentNode.closeTree();
        }
    },

    close() {
        if(!this.state.hover && this.isMounted()) {
            this.setState({
                open: false,
                hover: false,
                position: ''
            });
        }
    },

    onTitleClick(event) {
        var fn = this.props.action;

        if(fn && !this.props.disabled) {
            fn();
            this.closeTree();
        }
    },

    onContentMouseEnter(event) {
        if(!this.props.disabled) {
            this.setState({
                open: true,
                hover: true
            });
        }
    },

    onContentMouseLeave(event) {
        if(!this.props.disabled) {
            this.setState({
                hover: false
            });

            setTimeout(this.close, 180);
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if(!prevState.open && this.state.open) {
            this.setPosition();
        }
    },

    setPosition() {
        if(this.context.parentRoot || !this.props.children) {
            return;
        }

        let node = this.refs.items;
        let nodeRect = node.getBoundingClientRect();

        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        //set horizontal position
        let rightSpace = windowWidth - (nodeRect.left + nodeRect.width);
        let leftSpace = nodeRect.left;
        let xPosition = rightSpace >= leftSpace || nodeRect.width < rightSpace ? 'right' : 'left';

        //set vertical position
        let bottomSpace = windowHeight - (nodeRect.top + nodeRect.height);
        let topSpace = nodeRect.top;
        let yPosition = bottomSpace >= topSpace || nodeRect.height < bottomSpace ? 'top' : 'bottom';

        this.setState({
            position: `${xPosition} ${yPosition}`
        });
    },

    getStyle() {
        let menuItem = classNames('ros-menuitem', {
            'root': this.context.parentRoot,
            'open': this.state.open
        });

        let title = classNames('title flex flex-align-center', {
            'display-hidden': !this.props.title,
            'disabled': this.props.disabled
        });

        let items = classNames('items', this.state.position, {
            'open': this.state.open,
            'fade-in': this.state.hover,
            'fade-out': !this.state.hover
        });

        let icon = classNames(this.props.iconClass, {
            'display-hidden': !this.props.iconClass
        });

        let expendIcon = classNames('expend-icon fa fa-caret-right margin-left-10', {
            'display-hidden': this.context.parentRoot || !this.props.children
        });

        return {
            menuItem,
            title,
            items,
            icon,
            expendIcon
        }
    },

    render() {
        let classes = this.getStyle();

        return (
            <div className={classes.menuItem}>
                <div className="content" onMouseEnter={this.onContentMouseEnter} onMouseLeave={this.onContentMouseLeave}>
                    <div className={classes.title} onClick={this.onTitleClick}>
                        <div className="icon">
                            <i className={classes.icon}></i>
                        </div>
                        <div className="flex-1 text-truncate">{this.props.title}</div>
                        <div>
                            <i className={classes.expendIcon}></i>
                        </div>
                    </div>
                    <div className={classes.items} ref="items">
                        {this.state.open && this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});

export default ROSMenuItem;
