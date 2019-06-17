import React from 'react'
import classNames from 'classnames'
import {
    Button,
    Card,
    Classes,
    ControlGroup,
    FormGroup,
    H3,
    HTMLSelect,
    InputGroup,
    Intent,
    Overlay,
    Checkbox,
    Switch,
    Tab,
    Tabs, TextArea
} from '@blueprintjs/core'
import QueryBuilder from './react-query-builder'
import {knownTypesOptions} from "./utils";


class EndpointSchema extends React.Component {
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
        />
    }
}

class EndpointGeneral extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            pagination_enabled: false,
            aggregation_enabled: false,
            key: null
        }
    }

    addName = () => (e) => {
        this.setState({name: e.target.value})
    };

    handlePaginationEnabledChange = () => (e) => {
        this.setState({pagination_enabled: e.target.checked})
    };

    handleAggregationEnabledChange = () => (e) => {
        this.setState({aggregation_enabled: e.target.checked})
    };


    generalChange = () => {
        this.setState(this.props.description.general)
    };

    generalSave = () => {
        this.props.description.general = this.state
    };

    getSqlFields = () => {
        const sql_fields = this.props.sql.fields;
        return sql_fields.map(function (operator, index) {
            const classString = 'operator ' + operator;
            return (<option className={classString} value={operator} key={index}>{operator}</option>);
        });
    };


    onKeySelectChange = () => (e) => {
        const value = e.target.value === '' ? null : e.target.value;
        this.setState({key: value})
    };

    render() {
        return (
            <ControlGroup vertical={true}>
                <FormGroup label="Endpoint name"
                           labelFor="text-input"
                           labelInfo="(required)"
                >
                    <InputGroup id="text-input"
                                className="endpoint name"
                                placeholder={"Endpoint name"}
                                defaultValue={this.state.name}
                                onChange={this.addName()}
                                required/>
                </FormGroup>
                <FormGroup label="Select key field"
                           labelFor="key-field"
                           labelInfo="(optional)">
                    <HTMLSelect id={"key-select"}
                                className="endpoints"
                                value={this.state.key || ''}
                                onChange={this.onKeySelectChange()}>
                        <option value=""/>
                        {this.getSqlFields()}
                    </HTMLSelect>
                </FormGroup>
                <Switch checked={this.state.pagination_enabled}
                        disabled={!this.state.key}
                        label="Pagination"
                        onChange={this.handlePaginationEnabledChange()}
                />
                <Switch checked={this.state.aggregation_enabled}
                        label="Aggregation"
                        onChange={this.handleAggregationEnabledChange()}
                />
            </ControlGroup>
        )
    }
}

class EndpointParameters extends React.Component {

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
            const newPosition = Math.max(...positions) + 1;
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
            const newPosition = Math.max(...positions) + 1;
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
        console.log(this.state);
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


class EndpointEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasErrors: false,
            error: null
        };
        this.schemaBuilder = React.createRef();
        this.parametersBuilder = React.createRef();
        this.generalBuilder = React.createRef()
    }

    handleErrorOverlayClose = () => (e) => {
        this.setState({hasErrors: false})
    };

    validateState = () => {
        console.log(this.state);
        const isValid = true;
        const validationError = 'message';
        if (isValid) {
            this.setState({error: null, hasErrors: false});
            return true
        } else {
            this.setState({error: validationError, hasErrors: true});
            return false
        }
    };

    submitForm = () => (e) => {
        e.preventDefault();
        if (!this.validateState()) {

        }

    };

    endpointChange = () => {
        this.schemaBuilder.current.schemaChange();
        this.generalBuilder.current.generalChange();
        this.parametersBuilder.current.parametersChange()
    };

    endpointSave = () => {
        this.schemaBuilder.current.schemaSave();
        this.generalBuilder.current.generalSave();
        this.parametersBuilder.current.parametersSave()
    };

    render() {
        return <form onSubmit={this.submitForm()}>
            <Card interactive={false}>
                <Tabs id={"EndpointEditTabs"}>
                    <Tab id={"eq"} title={"General"}
                         panel={<EndpointGeneral ref={this.generalBuilder} {...this.props}/>}/>
                    <Tab id={"es"} title={"Schema"}
                         panel={<EndpointSchema ref={this.schemaBuilder} {...this.props} />}/>
                    <Tab id={"ep"} title={"Parameters"}
                         panel={<EndpointParameters ref={this.parametersBuilder} {...this.props}/>}/>
                    <Button type="submit" className="formButton submit" icon={"floppy-disk"} text={"Save"}/>
                </Tabs>
            </Card>
            <Overlay onClose={this.handleErrorOverlayClose()}
                     className={Classes.OVERLAY_SCROLL_CONTAINER}
                     isOpen={this.state.hasErrors} autoFocus={true} enforceFocus={true} canEscapeKeyClose={true}
                     canOutsideClickClose={true} hasBackdrop={true} usePortal={true}>
                <div className={classNames(Classes.CARD, Classes.ELEVATION_4)}>
                    <H3>Descriptions contains errors!</H3>
                    {this.state.error}
                    <br/>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button intent={Intent.DANGER} onClick={this.handleErrorOverlayClose()}
                                style={{margin: ""}}>
                            Close
                        </Button>

                    </div>
                </div>
            </Overlay>
        </form>


    }
}

export default EndpointEdit
