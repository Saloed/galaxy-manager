import React from "react";
import {convertDescription, restoreDescription} from "./converters";
import {ControlGroup, Intent, Menu, MenuItem, Position, Toaster} from "@blueprintjs/core";
import EndpointEdit from "./EndpointEdit";
import yaml from "js-yaml";

const fs = require('fs');
const path = require('path');
const lodash = require('lodash');

function countSQlParams(sql) {
    const pattern = new RegExp("%s", 'g');
    return (sql.match(pattern) || []).length
}

const FileSaveToaster = Toaster.create({
    className: "form-error-toaster",
    position: Position.TOP,
});

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
                key: null,
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
                        } else if (this.descriptionHasChanges(name)) {
                            intent = Intent.WARNING
                        } else if (!this.descriptions[name]) {
                            intent = Intent.DANGER
                        } else {
                            intent = Intent.NONE;
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
        const normalDescription = restoreDescription(description);
        const currentDescription = this.descriptions[name];
        let fileName = currentDescription && currentDescription.file_name;
        if (!fileName) {
            const basePath = this.props.repo_base_path;
            const name = normalDescription.name;
            const descriptionFileName = name + '.yaml';
            fileName = path.join(basePath, descriptionFileName)
        }
        const yamlDescription = yaml.safeDump(normalDescription);
        this.descriptions[name] = {...normalDescription, file_name: fileName};
        this.modified_descriptions[name] = null;
        this.base_descriptions[name] = null;
        fs.writeFileSync(fileName, yamlDescription, 'UTF-8');
        FileSaveToaster.show({message: "Saved to: " + fileName, intent: Intent.SUCCESS})
    }
}
