import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import ROSIconWrapper from './ROSIconWrapper';
import utils from '../../utils';
import draggableConnector from '../../compositions/draggableConnector';
import droppableConnector from '../../compositions/droppableConnector';

var ROSIconsGrid = React.createClass({
    childContextTypes: {
        requestNextZIndex: React.PropTypes.func
    },

    getChildContext() {
        return {
            requestNextZIndex: this.responseNextZIndex
        }
    },

    propTypes: {
        iconWidth: React.PropTypes.number,
        iconHeight: React.PropTypes.number,
        containerCornersGap: React.PropTypes.number,
        onIconDragEnd: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            iconWidth: 96,
            iconHeight: 96,
            containerCornersGap: 20,
            onIconDragEnd: utils.emptyFn()
        }
    },

    getInitialState() {
        return {
            mounted: false,
            cols: 0,
            rows: 0,
            width: 0,
            height: 0
        }
    },

    responseNextZIndex(currentZIndex) {
        if (currentZIndex == this.initialZIndex && this.initialZIndex > 1) {
            return currentZIndex;
        }
        return ++this.initialZIndex;
    },

    setInnerGridSize() {
        let gridNode = this.refs.grid;
        let gridNodeRect = gridNode.getBoundingClientRect();

        let cols = Math.floor(gridNodeRect.width / this.props.iconWidth);
        let rows = Math.floor(gridNodeRect.height / this.props.iconHeight);

        this.setState({
            cols, rows, width: gridNodeRect.width, height: gridNodeRect.height, mounted: true
        });
    },

    calcGridRowByTop(top) {
        let row = Math.ceil(Math.abs(this.state.height - (top + (this.props.iconHeight / 2) )) / this.props.iconHeight) || 1;
        if (row > this.state.rows) {
            row = this.state.rows;
        }

        return row;
    },

    calcGridColByLeft(left) {
        let col = Math.ceil((left + this.props.iconWidth / 2) / this.props.iconWidth) || 1;
        if (col > this.state.cols) {
            col = this.state.cols;
        }

        return col;
    },

    calcGridTopByRow(row) {
        return Math.abs(row * this.props.iconHeight - this.state.height);
    },

    calcGridLeftByCol(col) {
        return Math.abs(col * this.props.iconWidth - this.props.iconWidth);
    },

    findNextValidCol(current) {
        if(current < 1) {
            return 1;
        } else if(current > this.state.cols) {
            return this.state.cols;
        }

        return current;
    },

    findNextValidRow(current) {
        if(current < 1) {
            return 1;
        } else if(current > this.state.rows) {
            return this.state.rows;
        }

        return current;
    },

    getWrapperPositionByIndex(index, iconElement) {
        index += 1;
        let row, col;

        if (iconElement && iconElement.props.position && iconElement.props.position instanceof Array) {
            let _col = iconElement.props.position[0];
            let _row = iconElement.props.position[1];

            col = _col > 0 && _col <= this.state.cols ? _col : this.findNextValidCol(_col);
            row = _row > 0 && _row <= this.state.rows ? _row : this.findNextValidRow(_row);
        }

        row = row || Math.ceil(index / this.state.cols);
        col = col || Math.ceil(index % this.state.cols) || this.state.cols;

        return {
            top: this.calcGridTopByRow(row),
            left: this.calcGridLeftByCol(col)
        };
    },

    getWrappedIcons() {
        let children = React.Children.toArray(this.props.children);
        let wrappedChildren = [];

        children.forEach((child, idx)=> {
            if (child.type.displayName == 'ROSIcon') {

                let position = this.getWrapperPositionByIndex(idx, child);
                let options = {
                    containerNode: this.refs.grid
                };

                let Draggable = draggableConnector(ROSIconWrapper, options, {
                    index: idx,
                    width: this.props.iconWidth,
                    height: this.props.iconHeight,
                    top: position.top,
                    left: position.left,
                    children: child,
                    onDrop: this.onDropComplete
                });

                wrappedChildren.push(<Draggable key={idx+1}/>);
            }
        });

        return wrappedChildren;
    },

    onDropComplete(draggable) {

        let iconWrapper = draggable.getCompositeComponent();

        let iconWrapperNode = ReactDOM.findDOMNode(iconWrapper);

        let top = parseInt(iconWrapperNode.style.top);
        let left = parseInt(iconWrapperNode.style.left);

        let row = this.calcGridRowByTop(top);
        let col = this.calcGridColByLeft(left);

        draggable.updateProps({
            top: this.calcGridTopByRow(row),
            left: this.calcGridLeftByCol(col)
        });

        this.props.onIconDragEnd(iconWrapper.getCompositeComponent(), [col, row], iconWrapper.props.index);
    },

    componentDidMount() {
        window.addEventListener('resize', this.setInnerGridSize);

        this.setInnerGridSize();

        this.initialZIndex = 1;
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.setInnerGridSize);
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
                    {this.props.children && this.state.mounted && this.getWrappedIcons()}
                </div>
            </div>
        );
    }
});

export default ROSIconsGrid;