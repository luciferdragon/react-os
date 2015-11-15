import React from 'react';
import ReactDOM from 'react-dom';
import utils from '../../utils';
import postal from 'postal';
import classNames from 'classnames';
import ROSContextMenu from '../contextmenu/ROSContextMenu';
import ROSMenuItem from '../menuitem/ROSMenuItem';
import draggableConnector from '../../compositions/draggableConnector';

var ROSIcon = React.createClass({
    contextTypes: {
        requestNextZIndex: React.PropTypes.func,
        requestGridPosition: React.PropTypes.func
    },

    propTypes: {
        iconClass: React.PropTypes.string,
        title: React.PropTypes.string,
        action: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func,
        onNameChanged: React.PropTypes.func,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        index: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            iconClass: 'fa fa-file',
            title: 'New',
            onDelete: null,
            onNameChanged: null,
            width: 96,
            height: 96,
            index: 0
        }
    },

    getInitialState() {
        return {
            focus: false,
            rename: false,
            zIndex: 1
        }
    },

    getContextMenu() {
        if (this.props.onDelete || this.props.onNameChanged) {
            return (
                <ROSContextMenu>
                    {this.props.onDelete && <ROSMenuItem action={this.props.onDelete} title={'Delete'}/>}
                    {this.props.onNameChanged && <ROSMenuItem action={this.onRenameClick} title={'Rename...'}/>}
                </ROSContextMenu>
            );
        }
    },

    onRenameClick() {
        this.setState({
            rename: true
        });
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
        if (event.id != node.dataset.reactid) {
            this.setState(this.getInitialState());
        }
    },

    subscribeBusEvents() {
        this.focusBusHandler = postal.subscribe({
            channel: 'icon',
            topic: 'state.focus',
            callback: this.onIconFocusBusEvent
        });
    },

    unsubscribeBusEvents() {
        this.focusBusHandler.unsubscribe();
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

    updateZIndex() {
        this.setState({
            zIndex: this.context.requestNextZIndex(this.state.zIndex)
        });
    },

    onRenameInputClick(event) {
        event.preventDefault();
        event.stopPropagation();
    },

    getStyle() {
        let icon = classNames('ros-icon text-center flex flex-vbox flex-align-center', {
            'focus': this.state.focus
        });

        let element = classNames('element margin-bottom-5');

        let title = classNames('title', {
            'rename': this.state.rename
        });

        let elementStyle = {
            fontSize: this.props.width / 2
        };

        let position = this.context.requestGridPosition(this.props.position);

        let wrapperStyle = {
            width: this.props.width,
            height: this.props.height,
            top: position.top,
            left: position.left,
            zIndex: this.state.zIndex
        };

        let titleTextStyle = {
            width: this.state.focus ? 'auto' : this.props.width
        };

        let titleRenameStyle = {
            display: this.state.rename ? 'block' : 'none'
        };

        return {
            icon,
            element,
            title,
            elementStyle,
            wrapperStyle,
            titleTextStyle,
            titleRenameStyle
        }
    },

    render() {
        let classes = this.getStyle();

        return (
            <div className="ros-icon-wrapper flex flex-align-start flex-pack-center"
                 style={classes.wrapperStyle}
                 onMouseDown={this.updateZIndex}
                 onContextMenu={this.updateZIndex}>
                <div className={classes.icon} onClick={this.onIconClick} onDoubleClick={this.onIconDoubleClick}>
                    {this.getContextMenu()}
                    <div className={classes.element} style={classes.elementStyle}>
                        <i className={this.props.iconClass}></i>
                    </div>
                    <div className={classes.title}>
                        <div className="title-text" style={classes.titleTextStyle}>
                            {this.props.title}
                        </div>
                        <div className="title-rename" style={classes.titleRenameStyle}>
                            <input type="text" defaultValue={this.props.title} onClick={this.onRenameInputClick}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default draggableConnector(ROSIcon);