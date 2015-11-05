import React from 'react';

export default (WrappedComponent, props) => {
    const Droppable = React.createClass({

        componentDidMount() {

        },

        componentWillUnmount() {

        },

        render() {
            return <WrappedComponent {...props} />;
        }
    });

    return Droppable;
};