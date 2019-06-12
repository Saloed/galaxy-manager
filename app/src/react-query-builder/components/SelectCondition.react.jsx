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
        this.props.query.set('endpointSelect', e.target.value);
    };

    onEndpointSelectParamChange = (param) => (e) => {
        // this.props.query.set('endpointSelect', e.target.value);
        const value = e.target.value === '' ? null : e.target.value;
        console.log(param + ' = ' + value)
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
        const endpointName = this.props.query.endpointSelect;
        const endpoints = Object.values(this.props.allDescriptions);
        const endpoint = endpoints.find(it => it.name === endpointName);
        if (!endpoint) return null;
        const requiredParams = endpoint.sql_params.concat(endpoint.params.filter(it => it.required));
        const otherParams = endpoint.params.filter(it => !it.required);
        const sql_fields = this.props.sql.fields;
        const field_options = sql_fields.map(function (operator, index) {
            const classString = 'operator ' + operator;
            return (<option className={classString} value={operator} key={index}>{operator}</option>);
        });
        return (
            <Card>
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
                                value={this.props.query.params[param.name] || ''}
                                onChange={this.onEndpointSelectParamChange(param)}
                                required
                            >
                                <option value=""/>
                                {field_options}
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
                                value={this.props.query.params[param.name] || ''}
                                onChange={this.onEndpointSelectParamChange(param)}
                            >
                                <option value=""/>
                                {field_options}
                            </HTMLSelect>


                        </FormGroup>
                    )}
                </ControlGroup>
            </Card>
        )
    };

    render() {
        return (
            <div className="query condition">
                <ControlGroup fill={false} vertical={false}>
                    <InputGroup className="operand name" defaultValue={this.props.query.fieldName}
                                onChange={this.onFieldNameChange()} placeholder={"name"} required/>
                    <HTMLSelect className="endpoints" value={this.props.query.endpointSelect}
                                onChange={this.onEndpointSelectChange()} required>
                        {this.getEndpoints()}
                    </HTMLSelect>
                    {this.renderParams()}
                    <TextArea className="operand description" value={this.props.query.description}
                              onChange={this.onFieldDescriptionChange()} placeholder={"description"} small={true}
                              large={false}/>
                    <Button className="conditionButton removeCondition" icon={"trash"} onClick={this.onDeleteAlert()}
                            text={"Delete"}/>
                </ControlGroup>
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
