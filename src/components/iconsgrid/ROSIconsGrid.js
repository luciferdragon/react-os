import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import ROSIcon from '../icon/ROSIcon';
import utils from '../../utils';
import draggableConnector from '../../compositions/draggableConnector';

var ROSIconsGrid = React.createClass({
    childContextTypes: {
        requestNextZIndex: React.PropTypes.func,
        requestGridPosition: React.PropTypes.func
    },

    getChildContext() {
        return {
            requestNextZIndex: this.getNextZIndex,
            requestGridPosition: this.getIconGridPosition
        }
    },

    propTypes: {
        iconSize: React.PropTypes.number,
        containerCornersGap: React.PropTypes.number,
        onIconDragEnd: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            iconSize: 96,
            containerCornersGap: 20,
            onIconDragEnd: utils.emptyFn()
        }
    },

    getInitialState() {
        return {
            cols: 0,
            rows: 0,
            width: 0,
            height: 0,
            iconsPositions: []
        }
    },

    getNextZIndex(currentZIndex) {
        if (currentZIndex == this.initialZIndex && this.initialZIndex > 1) {
            return currentZIndex;
        }
        return ++this.initialZIndex;
    },

    getIconGridPosition(position) {
        return {
            top: this.calcGridTopByRow(position[1]),
            left: this.calcGridLeftByCol(position[0])
        }
    },

    setInnerGridSize() {
        let gridNode = this.refs.grid;
        let gridNodeRect = gridNode.getBoundingClientRect();

        let cols = Math.floor(gridNodeRect.width / this.props.iconSize);
        let rows = Math.floor(gridNodeRect.height / this.props.iconSize);

        this.setState({
            cols, rows, width: gridNodeRect.width, height: gridNodeRect.height
        });
    },

    calcGridRowByTop(top) {
        let row = Math.ceil(Math.abs(this.state.height - (top + (this.props.iconSize / 2) )) / this.props.iconSize) || 1;
        if (row > this.state.rows) {
            row = this.state.rows;
        }

        return row;
    },

    calcGridColByLeft(left) {
        let col = Math.ceil((left + this.props.iconSize / 2) / this.props.iconSize) || 1;
        if (col > this.state.cols) {
            col = this.state.cols;
        }

        return col;
    },

    calcGridTopByRow(row) {
        return Math.abs(row * this.props.iconSize - this.state.height);
    },

    calcGridLeftByCol(col) {
        return Math.abs(col * this.props.iconSize - this.props.iconSize);
    },

    findNextValidCol(current) {
        if (current < 1) {
            return 1;
        } else if (current > this.state.cols) {
            return this.state.cols;
        }

        return current;
    },

    findNextValidRow(current) {
        if (current < 1) {
            return 1;
        } else if (current > this.state.rows) {
            return this.state.rows;
        }

        return current;
    },

    getIconPosition(iconElement, index) {
        let row, col, _col, _row;

        if (this.state.iconsPositions[index]) {
            _col = this.state.iconsPositions[index][0];
            _row = this.state.iconsPositions[index][1];

        } else if (iconElement && iconElement.props.position && iconElement.props.position instanceof Array) {
            _col = iconElement.props.position[0];
            _row = iconElement.props.position[1];
        }

        if (_col && _row) {
            col = _col > 0 && _col <= this.state.cols ? _col : this.findNextValidCol(_col);
            row = _row > 0 && _row <= this.state.rows ? _row : this.findNextValidRow(_row);
        }

        row = row || Math.ceil((index + 1) / this.state.cols);
        col = col || Math.ceil((index + 1) % this.state.cols) || this.state.cols;

        return [col, row];
    },

    cloneIconWithProps(child, index) {
        let position = this.getIconPosition(child, index);

        return React.cloneElement(child, {
            containerNode: this.refs.grid,
            width: this.props.iconSize,
            height: this.props.iconSize,
            position: position,
            index: index,
            handler: '.title',
            resetPositionOnDrop: true,
            onDrop: this.onIconDropComplete
        });
    },

    getWrappedIcons() {
        return React.Children.map(this.props.children, function (child, index) {
            if (child.type.displayName == 'Draggable') {
                return this.cloneIconWithProps(child, index);
            }
            return child;
        }.bind(this));
    },

    onIconDropComplete(draggable, top, left) {
        let icon = draggable.getCompositeComponent();

        let row = this.calcGridRowByTop(top);
        let col = this.calcGridColByLeft(left);

        let iconsPositions = this.state.iconsPositions.slice();
        iconsPositions[icon.props.index] = [col, row];

        this.setState({
            iconsPositions: iconsPositions
        });

        this.props.onIconDragEnd(icon, [col, row], icon.props.index);
    },

    shouldComponentUpdate(nextProps, nextState) {
        if(!this.state.iconsPositions.length) {
            return true;
        }

        for (var i = 0, len = this.state.iconsPositions.length; i < len; i++) {
            if(this.state.iconsPositions[i] && (this.state.iconsPositions[i][0] != nextState.iconsPositions[i][0] || this.state.iconsPositions[i][1] != nextState.iconsPositions[i][1])) {
                return true;
            }
        }

        return false;
    },

    arrangeIconsByName() {
        console.log(1);
    },

    arrangeIconsByIndex() {

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
                    {this.state.rows && this.state.cols && this.getWrappedIcons()}
                </div>
            </div>
        );
    }
});

export default ROSIconsGrid;