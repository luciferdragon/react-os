import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import ROSIconWrapper from './ROSIconWrapper';
import draggableConnector from '../../compositions/draggableConnector';
import droppableConnector from '../../compositions/droppableConnector';

var ROSIconsGrid = React.createClass({
    childContextTypes: {
        requestInitialPositionFromGrid: React.PropTypes.func,
        requestNextZIndex: React.PropTypes.func
    },

    getChildContext() {
        return {
            requestInitialPositionFromGrid: this.responseInitialPosition,
            requestNextZIndex: this.responseNextZIndex
        }
    },

    propTypes: {
        iconWidth: React.PropTypes.number,
        iconHeight: React.PropTypes.number,
        containerCornersGap: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            iconWidth: 96,
            iconHeight: 96,
            containerCornersGap: 20
        }
    },

    responseInitialPosition(index) {
        index += 1;
        let size = this.getInnerGridSize();
        let row, col;

        row = Math.ceil(index / size.cols);
        col = Math.ceil(index % size.cols) || size.cols;

        return {
            y: Math.abs(row * this.props.iconHeight - size.height),
            x: Math.abs(col * this.props.iconWidth - this.props.iconWidth)
        };
    },

    responseNextZIndex() {
        return ++this.initialZIndex;
    },

    getInnerGridSize() {
        let gridNode = this.refs.grid;
        let gridNodeRect = gridNode.getBoundingClientRect();

        let cols = Math.floor(gridNodeRect.width / this.props.iconWidth);
        let rows = Math.floor(gridNodeRect.height / this.props.iconHeight);

        return {
            cols, rows, width: gridNodeRect.width, height: gridNodeRect.height
        }
    },

    getWrappedIcons() {
        let children = React.Children.toArray(this.props.children);
        let wrappedChildren = [];

        children.forEach((child, idx)=> {
            if (child.type.displayName == 'ROSIcon') {

                let Draggable = draggableConnector(ROSIconWrapper, this.refs.grid, {
                    index: idx,
                    width: this.props.iconWidth,
                    height: this.props.iconHeight,
                    children: child
                });

                wrappedChildren.push(<Draggable key={idx+1}/>);
            }
        });

        return wrappedChildren;
    },

    componentDidMount() {
        this.initialZIndex = 1;
    },

    getStyle() {
        let gridStyle = {
            padding: this.props.containerCornersGap
        };

        return {
            gridStyle
        };
    },

    render() {
        let classes = this.getStyle();

        return (
            <div className="ros-icons-grid" style={classes.gridStyle}>
                <div className="grid-holder" ref="grid">
                    {this.props.children && this.getWrappedIcons()}
                </div>
            </div>
        );
    }
});

export default ROSIconsGrid;