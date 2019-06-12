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
    Card
} from "@blueprintjs/core";
import PropTypes from "prop-types";

// Comparison operators
var operators = [
    {value: 'string', display: 'string', className: 'type-str'},
    {value: 'integer', display: 'integer', className: 'type-int'},
    {value: 'boolean', display: 'boolean', className: 'type-bool'},
    {value: 'datetime', display: 'datetime', className: 'type-datetime'}
    ];

// Array of options for operator select
var operatorOptions = operators.map(function (operator, index) {
    var classString = 'operator ' + operator.className;
    return (<option className={classString} value={operator.value} key={index}>{operator.display}</option>);
});


/**
 * Condition react component
 */
class Condition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showDeleteAlert: false};
        this.removeSelf = this.removeSelf.bind(this);
    }

    onFieldTypeChange = () => (e) => {
        const value = e.target.value
        this.props.query.set('fieldType', value);
    }

    onFieldNameChange = () => (e) => {
        this.props.query.set('fieldName', e.target.value);
    }


    onFieldDescriptionChange = () => (e) => {
        this.props.query.set('description', e.target.value);
    }

    onFieldExampleChange = () => (e) => {
        this.props.query.set('example', e.target.value);
    }

    removeSelf(e) {
        if (this.props.parent) {
            this.props.parent.children.splice(this.props.index, 1);
        }
    }

    onDeleteAlert = () => (e) => {
        this.setState({showDeleteAlert: true})
    }

    handleDeleteCancel = () => (e) => {
        this.setState({showDeleteAlert: false})
    }

    handleDeleteOk = () => (e) => {
        this.setState({showDeleteAlert: false})
        this.removeSelf(e)
    }

    render() {
        return (
            <div className="query condition">
                <ControlGroup fill={false} vertical={false}>
                    <InputGroup className="operand name" defaultValue={this.props.query.fieldName}
                                onChange={this.onFieldNameChange()} placeholder={"name"} required/>
                    <HTMLSelect className="operators" value={this.props.query.fieldType}
                                onChange={this.onFieldTypeChange()} required>
                        {operatorOptions}
                    </HTMLSelect>
                    <InputGroup className="operand example" value={this.props.query.example}
                                onChange={this.onFieldExampleChange()} placeholder={"example"}/>
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
};

Condition.propTypes = {
    query: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default Condition
