import React from 'react';

var ROSDesktop = React.createClass({
    render() {
        return (
            <div className="ros-desktop flex-1">
                {this.props.children}
            </div>
        );
    }
});

export default ROSDesktop;
