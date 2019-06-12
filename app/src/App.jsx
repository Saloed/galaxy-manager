import React from "react";
import {convertDescription} from "./converters";
import {ControlGroup, Intent, Menu, MenuItem} from "@blueprintjs/core";
import EndpointEdit from "./EndpointEdit";

const path = require('path')

export class App extends React.Component {

    constructor(props) {
        super(props);
        this.modified_descriptions = {}
        this.state = {
            sql_files: props.sql_files,
            descriptions: props.descriptions,
            selected_sql: null,
            selected_description: null
        }
        this.endpointEditor = React.createRef()
    }

    onSqlFileSelect = (name) => (e) => {
        const sql = this.state.sql_files[name]
        if (!this.modified_descriptions[name]) {
            const description = this.state.descriptions[name] || {
                name: "",
                file_name: null,
                description: "",
                sql: sql.name,
                sql_params: [],
                pagination_enabled: false,
                pagination_key: null,
                params: [],
                schema: {
                    type: 'object',
                    name: '',
                    description: '',
                    fields: {}
                }
            }
            this.modified_descriptions[name] = convertDescription(description)
        }
        const description = this.modified_descriptions[name]
        if (this.endpointEditor.current)
            this.endpointEditor.current.endpointSave()
        this.setState({
            selected_sql: sql,
            selected_description: description
        }, () => this.endpointEditor.current.endpointChange())
    };

    render() {
        return (
            <ControlGroup>
                <Menu>
                    {Object.keys(this.state.sql_files).map(name => {
                        let intent;
                        if (this.state.selected_sql === name) {
                            intent = Intent.PRIMARY;
                        } else if(!this.state.descriptions[name]) {
                            intent = Intent.DANGER
                        } else {
                            intent = this.modified_descriptions[name] ? Intent.WARNING : Intent.NONE;
                        }
                        return <MenuItem text={name} intent={intent} key={name}
                                         onClick={this.onSqlFileSelect(name)}/>
                    })}
                </Menu>
                {this.state.selected_sql && <EndpointEdit ref={this.endpointEditor}
                                                          allSql={this.state.sql_files}
                                                          allDescriptions={this.state.descriptions}
                                                          sql={this.state.selected_sql}
                                                          description={this.state.selected_description}/>}
            </ControlGroup>
        );
    }
}