import React from 'react';
import ReactDOM from 'react-dom';
import {ControlGroup, Intent, Menu, MenuItem} from '@blueprintjs/core'
import yaml from 'js-yaml'
import getQueryFieldNames from './sql-lexer'
import EndpointEdit from "./EndpointEdit";
import {convertDescription} from './converters'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.modified_descriptions = {}
        this.state = {
            sql_files: null,
            descriptions: null,
            selected_sql: null,
            selected_description: null
        }
        this.endpointEditor = React.createRef()
    }

    onFileChange = () => (e) => {
        e.preventDefault();
        const files = document.getElementById("files").files;
        let sql_files = {};
        let descriptions = {};
        for (let fileIdx = 0; fileIdx < files.length; fileIdx++) {
            const fileName = files[fileIdx].name;
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                if (fileName.endsWith('.sql')) {
                    const fieldNames = getQueryFieldNames(data);
                    sql_files[fileName] = {
                        name: fileName,
                        sql: data,
                        fields: fieldNames
                    }
                } else if (fileName.endsWith('.yaml')) {
                    let description = yaml.load(data);
                    if (!Array.isArray(description)) {
                        description = [description]
                    }
                    description.forEach(it => descriptions[it.sql] = it)
                } else {
                    // skip
                }
                this.setState({sql_files: sql_files, descriptions: descriptions})

            };
            reader.readAsText(files[fileIdx], 'UTF-8');
        }
    };

    onSqlFileSelect = (name) => (e) => {
        const sql = this.state.sql_files[name]
        if (!this.modified_descriptions[name]) {
            const description = this.state.descriptions[name] || {
                name: "",
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
        if (this.state.sql_files) {
            return (
                <ControlGroup>
                    <Menu>
                        {Object.keys(this.state.sql_files).map(name => {
                            let intent;
                            if (this.state.selected_sql === name) {
                                intent = Intent.PRIMARY;
                            } else {
                                intent = this.state.descriptions[name] ? Intent.NONE : Intent.WARNING;
                            }
                            return <MenuItem text={name} intent={intent} key={name}
                                             onClick={this.onSqlFileSelect(name)}/>
                        })}
                    </Menu>
                    {this.state.selected_sql && <EndpointEdit ref={this.endpointEditor} allSql={this.state.sql_files}
                                                              allDescriptions={this.state.descriptions}
                                                              sql={this.state.selected_sql}
                                                              description={this.state.selected_description}/>}
                </ControlGroup>
            );
        } else return (<form onSubmit={this.onFileChange()}>
                <input type="file" name="files" webkitdirectory="" directory="" multiple="" id="files"/>
                <input type="submit"/>
            </form>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
