import React from 'react'
import Freezer from 'freezer-js'
import ConditionGroup from './ConditionGroup.react';
import Condition from './Condition.react'
import '../stylesheets/react-query-builder.scss'

/**
 * QueryBuilder react component
 */
export const QueryBuilder = React.createClass({
    propTypes: {
        initialQuery: React.PropTypes.object,
        onQueryUpdate: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            initialQuery: {
                type: 'ConditionGroup',
                objectKey: 'root',
                children: []
            },
            onQueryUpdate: function(queryBuilder) {}
        };
    },

    getInitialState: function() {
        var queryFreezerStore = new Freezer(this.props.initialQuery);
        var query = queryFreezerStore.get();

        return {
            queryFreezerStore: queryFreezerStore,
            query: query
        };
    },

    componentDidMount: function() {
        // Update state every time query changes
        var queryListener = this.state.query.getListener();
        queryListener.on('update', function(updated) {
            this.setState({
                query: updated
            });

            this.props.onQueryUpdate(this);
        }.bind(this));

        this.props.onQueryUpdate(this);
    },

    getQuery: function() {
        return this.state.query;
    },

    render: function() {
        var childView = null;
        if (this.state.query.type === 'ConditionGroup') {
            childView = <ConditionGroup query={this.state.query} isRoot={true} parent={null} index={0} />;
        }
        else if (this.state.query.type === 'Condition') {
            childView = <Condition query={this.state.query} parent={null} index={0} />;
        }
        else {
            console.error('invalid type: type must be ConditionGroup or Condition');
            return null;
        }

        return (
            <div className="queryBuilder">
                {childView}
            </div>
        );
    }
});


