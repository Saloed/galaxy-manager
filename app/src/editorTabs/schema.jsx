import React from "react";
import QueryBuilder from "../react-query-builder";

export class EndpointSchema extends React.Component {
    constructor(props) {
        super(props);
        this.queryBuilder = React.createRef()
    }

    schemaChange = () => {
        this.queryBuilder.current.updateQuery(this.props.description.schema)

    };

    schemaSave = () => {
        this.props.description.schema = this.queryBuilder.current.getQuery()
    };

    render() {
        return <QueryBuilder ref={this.queryBuilder}
                             initialQuery={this.props.description.schema}
                             allSql={this.props.allSql}
                             allDescriptions={this.props.allDescriptions}
                             sql={this.props.sql}
                             description={this.props.description}
                             aggregationEnabled={this.props.aggregationEnabled}
        />
    }
}
