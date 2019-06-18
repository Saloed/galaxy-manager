import React from 'react'
import {
    Button,
    InputGroup,
    FormGroup,
    HTMLSelect,
    ControlGroup,
    TextArea,
    Alert,
    Intent,
    Card,
    Label
} from "@blueprintjs/core";
import PropTypes from "prop-types";
import {fieldOptionsForSql} from "../../utils";


/**
 * Condition react component
 */
class SelectCondition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showDeleteAlert: false};
        this.removeSelf = this.removeSelf.bind(this);
    }

    onFieldNameChange = () => (e) => {
        this.props.query.set('fieldName', e.target.value);
    };

    onEndpointSelectChange = () => (e) => {
        const endpointName = e.target.value;
        const endpoints = Object.values(this.props.allDescriptions);
        const endpoint = endpoints.find(it => it.name === endpointName);
        if (!endpoint) return null;
        const requiredParams = endpoint.sql_params.concat(endpoint.params.filter(it => it.required)).map(it => it.name);
        const otherParams = endpoint.params.filter(it => !it.required).map(it => it.name);
        const paramNames = requiredParams.concat(otherParams);
        let newParams = {};
        paramNames.forEach(it => newParams[it] = null);
        const newEndpoint = {
            name: endpointName,
            params: newParams
        };
        this.props.query.set('endpoint', newEndpoint);
    };


    onEndpointSelectParamChange = (param) => (e) => {
        const value = e.target.value === '' ? null : e.target.value;
        const endpoint = this.props.query.endpoint;
        let params = {...endpoint.params};
        params[param.name] = value;
        const newEndpoint = {name: endpoint.name, params: params};
        this.props.query.set('endpoint', newEndpoint);
    };

    onFieldDescriptionChange = () => (e) => {
        this.props.query.set('description', e.target.value);
    };

    removeSelf(e) {
        if (this.props.parent) {
            this.props.parent.children.splice(this.props.index, 1);
        }
    }

    onDeleteAlert = () => (e) => {
        this.setState({showDeleteAlert: true})
    };

    handleDeleteCancel = () => (e) => {
        this.setState({showDeleteAlert: false})
    };

    handleDeleteOk = () => (e) => {
        this.setState({showDeleteAlert: false});
        this.removeSelf(e)
    };

    getEndpoints = () => {
        const endpoints = Object.values(this.props.allDescriptions);
        return endpoints.map(function (operator, index) {
            const classString = 'operator ' + operator.name;
            return (<option className={classString} value={operator.name} key={index}>{operator.name}</option>);
        })
    };

    renderParams = () => {
        const endpointName = this.props.query.endpoint.name;
        const endpoints = Object.values(this.props.allDescriptions);
        const endpoint = endpoints.find(it => it.name === endpointName);
        if (!endpoint) return null;
        const requiredParams = endpoint.sql_params.concat(endpoint.params.filter(it => it.required));
        const otherParams = endpoint.params.filter(it => !it.required);
        return (
            <ControlGroup fill={false} vertical={true}>
                {requiredParams.map((param, index) =>
                    <FormGroup
                        helperText={param.description}
                        inline={true}
                        label={param.name + ': ' + param.type}
                        labelFor="param-selector"
                        labelInfo="(required)"
                        key={index}
                    >
                        <HTMLSelect
                            id="param-selector"
                            className="endpoints-select-param"
                            value={this.props.query.endpoint.params[param.name] || ''}
                            onChange={this.onEndpointSelectParamChange(param)}
                            required
                        >
                            <option value=""/>
                            {fieldOptionsForSql(this.props.sql)}
                        </HTMLSelect>


                    </FormGroup>
                )}
                {otherParams.map((param, index) =>
                    <FormGroup
                        helperText={param.description}
                        inline={true}
                        label={param.name + ': ' + param.type}
                        labelFor="param-selector"
                        labelInfo="(optional)"
                        key={index}
                    >
                        <HTMLSelect
                            id="param-selector"
                            className="endpoints-select-param"
                            value={this.props.query.endpoint.params[param.name] || ''}
                            onChange={this.onEndpointSelectParamChange(param)}
                        >
                            <option value=""/>
                            {fieldOptionsForSql(this.props.sql)}
                        </HTMLSelect>


                    </FormGroup>
                )}
            </ControlGroup>
        )
    };

    render() {
        return (
            <div className="query condition">
                <Card>
                    <ControlGroup fill={false} vertical={true}>
                        <ControlGroup vertical={false}>
                            <FormGroup label={"Field name"}
                                       labelInfo={"(required)"}
                                       labelFor={"field-name"}
                                       style={{marginRight: 5}}
                            >
                                <InputGroup id={"field-name"}
                                            className="operand name"
                                            defaultValue={this.props.query.fieldName}
                                            onChange={this.onFieldNameChange()}
                                            placeholder={"name"}
                                            required/>
                            </FormGroup>
                            <FormGroup label={"Endpoint"}
                                       labelInfo={"(required)"}
                                       labelFor={"endpoint"}
                                       style={{marginRight: 5}}>
                                <HTMLSelect id={"endpoint"}
                                            className="endpoints"
                                            value={this.props.query.endpoint.name}
                                            onChange={this.onEndpointSelectChange()}
                                            required>
                                    {this.getEndpoints()}
                                </HTMLSelect>
                            </FormGroup>
                            <Button className="conditionButton removeCondition" icon={"trash"}
                                    onClick={this.onDeleteAlert()}
                                    text={"Delete"}
                                    intent="danger"
                                    minimal={true}
                            />
                        </ControlGroup>
                        {this.renderParams()}
                        <FormGroup
                            label={"Field description"}
                            labelInfo={"(optional)"}
                            labelFor={"obj-desc"}
                        >
                            <TextArea id={"obj-desc"}
                                      className="operand description"
                                      value={this.props.query.description}
                                      onChange={this.onFieldDescriptionChange()}
                                      placeholder={"description"}
                                      small={true}
                                      large={false}/>
                        </FormGroup>
                    </ControlGroup>
                </Card>
                <Alert
                    className={"Delete alert"}
                    cancelButtonText="Cancel"
                    confirmButtonText="Delete"
                    icon="trash"
                    intent={Intent.DANGER}
                    isOpen={this.state.showDeleteAlert}
                    onCancel={this.handleDeleteCancel()}
                    onConfirm={this.handleDeleteOk()}
                >
                    <p>
                        Are you sure you want to delete this field?
                    </p>
                </Alert>
            </div>
        );
    }
}

SelectCondition.propTypes = {
    query: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

export default SelectCondition
