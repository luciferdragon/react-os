import React from 'react';

var ROSToolBar = React.createClass({
    render() {
        return (
            <div className="ros-toolbar">
                {this.props.children}
            </div>
        );
    }
});

export default ROSToolBar;
