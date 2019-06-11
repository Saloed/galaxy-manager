import React from 'react'
import Freezer from 'freezer-js'
import ConditionGroup from './ConditionGroup.react';
import Condition from './Condition.react'
import SelectCondition from './SelectCondition.react'
// import '../stylesheets/react-query-builder.scss'
import PropTypes from "prop-types";

/**
 * QueryBuilder react component
 */
class QueryBuilder extends React.Component {
    constructor(props) {
        super(props);
        const queryFreezerStore = new Freezer(this.props.initialQuery);
        const query = queryFreezerStore.get();
        this.state = {
            queryFreezerStore: queryFreezerStore,
            query: query
        }

        this.getQuery = this.getQuery.bind(this)
    }

    componentDidMount() {
        this.onQueryChange(this.state.query)
    }

    getQuery() {
        return this.state.query;
    }

    onQueryChange = (query) => {
        const queryListener = query.getListener();
        queryListener.on('update', function (updated) {
            this.setState({
                query: updated
            });

            this.props.onQueryUpdate(this);
        }.bind(this));

        this.props.onQueryUpdate(this);
    }

    updateQuery = (newQuery) => {
        const queryFreezerStore = new Freezer(newQuery);
        const query = queryFreezerStore.get();
        this.setState({
            queryFreezerStore: queryFreezerStore,
            query: query
        })
        this.onQueryChange(query)
    }

    render() {
        let childView = null;
        if (this.state.query.type === 'ConditionGroup') {
            childView = <ConditionGroup query={this.state.query} isRoot={true} parent={null} index={0}/>;
        } else if (this.state.query.type === 'Condition') {
            childView = <Condition query={this.state.query} parent={null} index={0}/>;
        } else if (this.state.query.type === 'SelectCondition') {
            childView = <SelectCondition query={this.state.query} parent={null} index={0}/>;
        } else {
            console.error('invalid type: type must be ConditionGroup or Condition');
            return null;
        }

        return (
            <div className="queryBuilder">
                {childView}
            </div>
        );
    }
};
QueryBuilder.propTypes = {
    initialQuery: PropTypes.object.isRequired,
    onQueryUpdate: PropTypes.func
};
QueryBuilder.defaultProps = {
    initialQuery: {
        type: 'ConditionGroup',
        objectKey: 'root',
        children: []
    },
    onQueryUpdate: function (queryBuilder) {
    }
};


export default QueryBuilder
