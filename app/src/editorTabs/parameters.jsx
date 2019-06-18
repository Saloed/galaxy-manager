import React from "react";
import {Button, Card, Checkbox, ControlGroup, FormGroup, HTMLSelect, InputGroup, TextArea} from "@blueprintjs/core";
import {knownTypesOptions} from "../utils";

export class EndpointParameters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            params: {},
            sql_params: {}
        }
    }

    parametersChange = () => {
        this.setState(this.props.description.parameters)
    };

    parametersSave = () => {
        this.props.description.parameters = this.state
    };


    handleParamsChange(i, field, event) {
        let params = {...this.state.params};
        params[i][field] = event.target.value;
        this.setState({params});
    }


    handleParamsCheckedChange(i, field, event) {
        let params = {...this.state.params};
        params[i][field] = event.target.checked;
        this.setState({params});
    }

    addParamsClick() {
        this.setState(prevState => {
            const positions = Object.keys(prevState.params).map(it => Number(it));
            const newPosition = positions.length === 0 ? 0 : Math.max(...positions) + 1;
            const newStateParams = {...prevState.params};
            newStateParams[newPosition] = {
                name: '',
                operation: 'custom',
                required: false,
                type: 'string',
                condition: '',
                default: '',
                description: '',
                example: '',
                position: newPosition
            };
            return ({params: newStateParams});
        });
    }

    removeParamsClick(i) {
        let params = {...this.state.params};
        delete params[i];
        this.setState({params});
    }

    handleSQLParamsChange(i, field, event) {
        let params = {...this.state.sql_params};
        params[i][field] = event.target.value;
        this.setState({sql_params: params});
    }

    addSQLParamsClick() {
        this.setState(prevState => {
            const positions = Object.keys(prevState.sql_params).map(it => Number(it));
            const newPosition = positions.length === 0 ? 0 : Math.max(...positions) + 1;
            const newStateParams = {...prevState.sql_params};
            newStateParams[newPosition] = {
                name: '',
                type: 'string',
                default: '',
                description: '',
                example: '',
                position: newPosition
            };
            return ({sql_params: newStateParams});
        });
    }

    removeSQLParamsClick(i) {
        let params = {...this.state.sql_params};
        delete params[i];
        this.setState({sql_params: params});
    }


    render() {
        return (<ControlGroup vertical={true}>
                <FormGroup
                    label="Parameters"
                    labelFor="param-control"
                >
                    <ControlGroup id={"param-control"}
                                  vertical={true}
                    >
                        {Object.keys(this.state.params).map(key => {
                            const it = this.state.params[key]
                            return (
                                <Card key={key}
                                      style={{marginBottom: 10}}
                                >
                                    <ControlGroup vertical={true}>
                                        <ControlGroup vertical={false}>
                                            <FormGroup label="Parameter name"
                                                       labelFor="param-name"
                                                       labelInfo="(required)"
                                                       style={{marginRight: 5}}
                                            >
                                                <InputGroup
                                                    id={"param-name"}
                                                    className="operand name"
                                                    defaultValue={it.name}
                                                    placeholder={"parameter name"}
                                                    onChange={this.handleParamsChange.bind(this, key, 'name')}
                                                    required/>
                                            </FormGroup>
                                            <FormGroup label="Parameter type"
                                                       labelFor="param-type"
                                                       labelInfo="(required)"
                                                       style={{marginRight: 5}}
                                            >
                                                <HTMLSelect id={"param-type"}
                                                            className="type-selection"
                                                            value={it.type}
                                                            onChange={this.handleParamsChange.bind(this, key, 'type')}
                                                            required>
                                                    {knownTypesOptions}
                                                </HTMLSelect>
                                            </FormGroup>

                                            <FormGroup label="Parameter is required"
                                                       labelFor="param-req"
                                            >
                                                <Checkbox id={"param-req"}
                                                          checked={it.required}
                                                          label="Required"
                                                          onChange={this.handleParamsCheckedChange.bind(this, key, 'required')}
                                                />
                                            </FormGroup>

                                        </ControlGroup>


                                        <FormGroup label="Parameter SQL condition"
                                                   labelFor="param-cond"
                                                   labelInfo="(required)"
                                        >
                                            <TextArea
                                                id={"param-cond"}
                                                className="param-cond"
                                                defaultValue={it.condition}
                                                placeholder={"parameter condition"}
                                                onChange={this.handleParamsChange.bind(this, key, 'condition')}
                                                fill={true}
                                                growVertically={true}
                                                required/>
                                        </FormGroup>
                                        <ControlGroup vertical={false}>
                                            <FormGroup label="Parameter example"
                                                       labelFor="param-example"
                                                       labelInfo="(optional)"
                                                       style={{marginRight: 5}}
                                            >
                                                <InputGroup
                                                    id={"param-example"}
                                                    className="param-example"
                                                    defaultValue={it.example}
                                                    placeholder={"parameter example"}
                                                    onChange={this.handleParamsChange.bind(this, key, 'example')}
                                                />
                                            </FormGroup>
                                            <FormGroup label="Parameter default value"
                                                       labelFor="param-default"
                                                       labelInfo="(optional)"
                                            >
                                                <InputGroup
                                                    id={"param-default"}
                                                    className="param-default"
                                                    defaultValue={it.default}
                                                    placeholder={"default value"}
                                                    onChange={this.handleParamsChange.bind(this, key, 'default')}
                                                />
                                            </FormGroup>
                                        </ControlGroup>

                                        <FormGroup label="Parameter description"
                                                   labelFor="param-description"
                                                   labelInfo="(optional)"
                                        >
                                            <TextArea
                                                id={"param-description"}
                                                className="param-description"
                                                defaultValue={it.description}
                                                placeholder={"parameter description"}
                                                onChange={this.handleParamsChange.bind(this, key, 'description')}
                                                fill={true}
                                                growVertically={true}
                                            />
                                        </FormGroup>

                                        <Button className="param-remove-button"
                                                icon={"trash"}
                                                text={"Delete"}
                                                intent="danger"
                                                minimal={true}
                                                onClick={this.removeParamsClick.bind(this, key)}
                                        />
                                    </ControlGroup>
                                </Card>

                            );
                        })}
                        <Button
                            className="parameterButton addParameter"
                            icon={"add"}
                            text={"Parameter"}
                            onClick={() => this.addParamsClick()}/>
                    </ControlGroup>
                </FormGroup>
                <FormGroup
                    label="SQL Parameters"
                    labelFor="param-control"
                >
                    <ControlGroup id={"param-control"} vertical={true}>
                        {Object.keys(this.state.sql_params).map(key => {
                            const it = this.state.sql_params[key]
                            return (
                                <Card key={key}
                                      style={{marginBottom: 10}}
                                >
                                    <ControlGroup vertical={true}>
                                        <ControlGroup vertical={false}>
                                            <FormGroup label="Parameter name"
                                                       labelFor="param-name"
                                                       labelInfo="(required)"
                                                       style={{marginRight: 5}}

                                            >
                                                <InputGroup
                                                    id={"param-name"}
                                                    className="operand name"
                                                    defaultValue={it.name}
                                                    placeholder={"parameter name"}
                                                    onChange={this.handleSQLParamsChange.bind(this, key, 'name')}
                                                    required/>
                                            </FormGroup>
                                            <FormGroup label="Parameter type"
                                                       labelFor="param-type"
                                                       labelInfo="(required)"
                                            >
                                                <HTMLSelect id={"param-type"}
                                                            className="type-selection"
                                                            value={it.type}
                                                            onChange={this.handleSQLParamsChange.bind(this, key, 'type')}
                                                            required>
                                                    {knownTypesOptions}
                                                </HTMLSelect>
                                            </FormGroup>
                                        </ControlGroup>
                                        <ControlGroup vertical={false}>
                                            <FormGroup label="Parameter example"
                                                       labelFor="param-example"
                                                       labelInfo="(optional)"
                                                       style={{marginRight: 5}}

                                            >
                                                <InputGroup
                                                    id={"param-example"}
                                                    className="param-example"
                                                    defaultValue={it.example}
                                                    placeholder={"parameter example"}
                                                    onChange={this.handleSQLParamsChange.bind(this, key, 'example')}
                                                />
                                            </FormGroup>
                                            <FormGroup label="Parameter default value"
                                                       labelFor="param-default"
                                                       labelInfo="(optional)"
                                            >
                                                <InputGroup
                                                    id={"param-default"}
                                                    className="param-default"
                                                    defaultValue={it.default}
                                                    placeholder={"default value"}
                                                    onChange={this.handleSQLParamsChange.bind(this, key, 'default')}
                                                />
                                            </FormGroup>

                                        </ControlGroup>

                                        <FormGroup label="Parameter description"
                                                   labelFor="param-description"
                                                   labelInfo="(optional)"
                                        >
                                            <TextArea
                                                id={"param-description"}
                                                className="param-description"
                                                defaultValue={it.description}
                                                placeholder={"parameter description"}
                                                onChange={this.handleSQLParamsChange.bind(this, key, 'description')}
                                                fill={true}
                                                growVertically={true}
                                            />
                                        </FormGroup>

                                        <Button className="param-remove-button"
                                                icon={"trash"}
                                                text={"Delete"}
                                                intent="danger"
                                                minimal={true}
                                                onClick={this.removeSQLParamsClick.bind(this, key)}
                                        />
                                    </ControlGroup>
                                </Card>

                            );
                        })}
                        <Button
                            className="parameterButton addParameter"
                            icon={"add"}
                            text={"SQL Parameter"}
                            onClick={() => this.addSQLParamsClick()}/>
                    </ControlGroup>
                </FormGroup>

            </ControlGroup>
        )
    }
}
