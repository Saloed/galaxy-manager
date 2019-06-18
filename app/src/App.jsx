import React from "react";
import {convertDescription} from "./converters";
import {ControlGroup, Intent, Menu, MenuItem} from "@blueprintjs/core";
import EndpointEdit from "./EndpointEdit";

const path = require('path');
const lodash = require('lodash');

function countSQlParams(sql) {
    const pattern = new RegExp("%s", 'g');
    return (sql.match(pattern) || []).length
}

export class App extends React.Component {

    constructor(props) {
        super(props);
        this.base_descriptions = {};
        this.modified_descriptions = {};
        this.sql_files = props.sql_files;
        this.descriptions = props.descriptions;
        this.state = {
            selected_sql: null,
            selected_description: null
        };
        this.endpointEditor = React.createRef()
    }

    descriptionHasChanges = (name) => {
        const base = this.base_descriptions[name];
        const modified = this.modified_descriptions[name];
        return !lodash.isEqual(base, modified)
    };

    onSqlFileSelect = (name) => (e) => {
        const sql = this.sql_files[name];
        if (!this.base_descriptions[name]) {
            const sqlParamsCount = countSQlParams(sql.sql);
            let sql_params = [];
            if (sqlParamsCount > 0) {
                const range = [...Array(sqlParamsCount).keys()];
                sql_params = range.map(pos => ({
                    name: '',
                    type: 'string',
                    default: '',
                    description: '',
                    example: '',
                    position: pos
                }))
            }

            const description = this.descriptions[name] || {
                name: "",
                file_name: null,
                description: "",
                sql: sql.name,
                sql_params: sql_params,
                pagination_enabled: false,
                pagination_key: null,
                params: [],
                schema: {
                    type: 'object',
                    name: '',
                    description: '',
                    fields: {}
                }
            };
            this.base_descriptions[name] = convertDescription(description)
        }

        if (!this.modified_descriptions[name]) {
            this.modified_descriptions[name] = Object.assign({}, this.base_descriptions[name])
        }

        const description = this.modified_descriptions[name];
        if (this.endpointEditor.current)
            this.endpointEditor.current.endpointSave();
        this.setState({
            selected_sql: sql,
            selected_description: description
        }, () => this.endpointEditor.current.endpointChange())
    };

    render() {
        return (
            <ControlGroup>
                <Menu>
                    {Object.keys(this.sql_files).map(name => {
                        let intent;
                        const mySql = this.state.selected_sql;
                        if (mySql && mySql.name === name) {
                            intent = Intent.PRIMARY;
                        } else if (!this.descriptions[name]) {
                            intent = Intent.DANGER
                        } else if (!this.modified_descriptions[name]) {
                            intent = Intent.NONE
                        } else {
                            intent = this.descriptionHasChanges(name) ? Intent.WARNING : Intent.NONE;
                        }
                        return <MenuItem text={name} intent={intent} key={name}
                                         onClick={this.onSqlFileSelect(name)}/>
                    })}
                </Menu>
                {this.state.selected_sql && <EndpointEdit ref={this.endpointEditor}
                                                          allSql={this.sql_files}
                                                          allDescriptions={this.descriptions}
                                                          sql={this.state.selected_sql}
                                                          description={this.state.selected_description}
                                                          onSelectedDescriptionSave={this.onSelectedDescriptionSave()}
                />}
            </ControlGroup>
        );
    }

    onSelectedDescriptionSave = () => () => {
        if (!this.endpointEditor.current) return;
        this.endpointEditor.current.endpointSave();
        const name = this.state.selected_sql && this.state.selected_sql.name;
        if (!name) return;
        const description = this.modified_descriptions[name];
        if (!description) return;
        console.log(description)
    }
}
