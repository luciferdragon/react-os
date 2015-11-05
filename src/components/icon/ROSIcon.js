import React from 'react';
import ReactDOM from 'react-dom';
import utils from '../../utils';
import postal from 'postal';
import classNames from 'classnames';
import ROSContextMenu from '../contextmenu/ROSContextMenu';
import ROSMenuItem from '../menuitem/ROSMenuItem';

var ROSIcon = React.createClass({
    contextTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },

    propTypes: {
        iconClass: React.PropTypes.string,
        title: React.PropTypes.string,
        action: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func,
        onNameChanged: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            iconClass: 'fa fa-file',
            title: 'New',
            onDelete: null,
            onNameChanged: null
        }
    },

    getInitialState() {
        return {
            focus: false,
            rename: false
        }
    },

    getContextMenu() {
        if (this.props.onDelete || this.props.onNameChanged) {
            return (
                <ROSContextMenu>
                    {this.props.onDelete && <ROSMenuItem action={this.props.onDelete} title={'Delete'}/>}
                    {this.props.onNameChanged && <ROSMenuItem action={this.props.onNameChanged} title={'Rename...'}/>}
                </ROSContextMenu>
            );
        }
    },

    onDocumentClick() {
        let node = ReactDOM.findDOMNode(this);

        let found = utils.findElementInEventPath(event.path, node);

        if (!found) {
            this.setState(this.getInitialState());
        }
    },

    onIconFocusBusEvent(event){
        let node = ReactDOM.findDOMNode(this);
        if(event.id != node.dataset.reactid) {
            this.setState(this.getInitialState());
        }
    },

    subscribeBusEvents() {
        this.subscription = postal.subscribe({
            channel: 'icon',
            topic: 'state.focus',
            callback: this.onIconFocusBusEvent
        });
    },

    unsubscribeBusEvents() {
        this.subscription.unsubscribe();
    },

    componentDidMount() {
        this.subscribeBusEvents();
        document.addEventListener('click', this.onDocumentClick);
    },

    componentWillUnmount() {
        this.unsubscribeBusEvents();
        document.removeEventListener('click', this.onDocumentClick);
    },

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.focus && this.state.focus) {
            let node = ReactDOM.findDOMNode(this);

            postal.publish({
                channel: 'icon',
                topic: 'state.focus',
                data: {
                    id: node.dataset.reactid
                }
            });
        }
    },

    onIconDoubleClick(event) {
        this.props.action();
    },

    onIconClick(event) {
        this.setState({
            focus: true
        });
    },

    getStyle() {
        let icon = classNames('ros-icon text-center flex flex-vbox flex-align-center', {
            'focus': this.state.focus
        });

        let element = classNames('element margin-bottom-5');

        let title = classNames('title');

        let elementStyle = {
            fontSize: this.context.width / 2
        };

        let titleStyle = {
            width: this.state.focus ? 'auto' : this.context.width
        };

        return {
            icon,
            element,
            title,
            elementStyle,
            titleStyle
        }
    },

    render() {
        let classes = this.getStyle();

        return (
            <div className={classes.icon} onClick={this.onIconClick} onDoubleClick={this.onIconDoubleClick}>
                {this.getContextMenu()}
                <div className={classes.element} style={classes.elementStyle}>
                    <i className={this.props.iconClass}></i>
                </div>
                <div className={classes.title} style={classes.titleStyle}>
                    {this.props.title}
                </div>
            </div>
        );
    }
});

export default ROSIcon;