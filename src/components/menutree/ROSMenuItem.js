import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

var ROSMenuItem = React.createClass({
    getInitialState() {
        return {
            open: false,
            focus: false
        }
    },

    getDefaultProps() {
        return {
            root: false,
            title: ''
        }
    },

    propTypes: {
        root: React.PropTypes.bool,
        title: React.PropTypes.string
    },

    onTitleClick(event) {
        if(this.props.onItemClick) {
            this.props.onItemClick();
        }

        if(this.props.root) {
            var newState = {};

            if(this.props.children.length && !this.state.open) {
                newState.open = true;
            }

            if(this.state.open) {
                newState.open = false;
                newState.focus = false;
            }

            this.setState(newState);
        } else {

        }

        //if no children, close the menu
        // if(!this.props.children.lenght) {
        //     this.setState(this.getInitialState());
        // }
    },

    onItemsMouseEnter(event) {
        this.setState({
            focus: true
        });
    },

    onItemsMouseLeave(event) {

    },

    componentDidMount() {
        document.addEventListener('click', this.onDocumentClick);
    },

    onDocumentClick(event) {
        console.log(event);
        console.log(ReactDOM.findDOMNode(this));
    },

    render() {
        let menuItemClasses = classNames('ros-menuitem', {
            'root': this.props.root,
            'open': this.state.open
        });

        let titleClasses = classNames('title', {
            'display-hidden': !this.props.title
        });

        let itemsClasses = classNames('items', {
            'open': this.state.open,
            'focus': this.state.focus

        });

        return (
            <div className={menuItemClasses}>
                <div className="content">
                    <div className={titleClasses} onClick={this.onTitleClick}>{this.props.title}</div>
                    <div className={itemsClasses} onMouseEnter={this.onItemsMouseEnter} onMouseLeave={this.onItemsMouseLeave}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});

export default ROSMenuItem;
