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

function getEndpoints() {
    const endpoints = ["a", "b", "c"]
    return endpoints.map(function (operator, index) {
        var classString = 'operator ' + operator;
        return (<option className={classString} value={operator} key={index}>{operator}</option>);
    })
}

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
    }

    onEndpointSelectChange = () => (e) => {
        this.props.query.set('endpointSelect', e.target.value);
    }

    onFieldDescriptionChange = () => (e) => {
        this.props.query.set('description', e.target.value);
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
                    <HTMLSelect className="endpoints" value={this.props.query.endpointSelect}
                                                      onChange={this.onEndpointSelectChange()} required>
                        {getEndpoints()}
                    </HTMLSelect>
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

SelectCondition.propTypes = {
    query: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default SelectCondition
