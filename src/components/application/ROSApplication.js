import React from 'react';

var ROSApplication = React.createClass({
    contextTypes: {
        rosTheme: React.PropTypes.object
    },

    childContextTypes: {
        rosTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            rosTheme: this.context.rosTheme || {}
        };
    },

    render() {
        return (
            <div className="ros-application flex flex-vbox">
                {this.props.children}
            </div>
        );
    }
});

export default ROSApplication;
