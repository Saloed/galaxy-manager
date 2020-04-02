import React from 'react'
import Freezer from 'freezer-js'
import ConditionGroup from './ConditionGroup.react';
import Condition from './Condition.react'
import SelectCondition from './SelectCondition.react'
import PropTypes from "prop-types";

/**
 * QueryBuilder react component
 */
class QueryBuilder extends React.Component {
    constructor(props) {
        super(props);
        const queryFreezerStore = new Freezer(this.props.initialQuery, {mutable: false, live: true});
        this.state = {
            queryFreezerStore: queryFreezerStore
        };

        this.getQuery = this.getQuery.bind(this)
    }

    componentDidMount() {
        this.onQueryChange(this.state.queryFreezerStore)
    }

    getQuery() {
        return this.state.queryFreezerStore.get().toJS()
    }

    onQueryChange = (query) => {
        query.on('update', function () {
            this.forceUpdate()
        }.bind(this));
    };

    updateQuery = (newQuery) => {
        const queryFreezerStore = new Freezer(newQuery);
        this.setState({queryFreezerStore: queryFreezerStore});
        this.onQueryChange(queryFreezerStore)
    };

    render() {
        let childView = null;
        const query = this.state.queryFreezerStore.get();
        if (query.type === 'ConditionGroup') {
            childView = <ConditionGroup query={query} isRoot={true} parent={null} index={0}
                                        allSql={this.props.allSql}
                                        allDescriptions={this.props.allDescriptions}
                                        sql={this.props.sql}
                                        description={this.props.description}
                                        aggregationEnabled={this.props.aggregationEnabled}
            />;
        } else if (query.type === 'Condition') {
            childView = <Condition query={query} parent={null} index={0}
                                   allSql={this.props.allSql}
                                   allDescriptions={this.props.allDescriptions}
                                   sql={this.props.sql}
                                   description={this.props.description}
            />;
        } else if (query.type === 'SelectCondition') {
            childView = <SelectCondition query={query} parent={null} index={0}
                                         allSql={this.props.allSql}
                                         allDescriptions={this.props.allDescriptions}
                                         sql={this.props.sql}
                                         description={this.props.description}
            />;
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
}

QueryBuilder.propTypes = {
    initialQuery: PropTypes.object.isRequired
};
QueryBuilder.defaultProps = {
    initialQuery: {
        type: 'ConditionGroup',
        objectKey: 'root',
        children: []
    }
};


export default QueryBuilder
