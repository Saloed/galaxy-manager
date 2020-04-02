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
    Card, ButtonGroup
} from "@blueprintjs/core";
import PropTypes from "prop-types";

import {fieldOptionsForSql, knownTypesOptions} from '../../utils'

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
        const value = e.target.value;
        this.props.query.set('fieldType', value);
    };

    onFieldDbFieldChange = () => (e) => {
        const value = e.target.value;
        const realValue = value === '' ? null : value;
        this.props.query.set('db_name', realValue);
    };

    onFieldNameChange = () => (e) => {
        this.props.query.set('fieldName', e.target.value);
    };


    onFieldDescriptionChange = () => (e) => {
        this.props.query.set('description', e.target.value);
    };

    onFieldExampleChange = () => (e) => {
        this.props.query.set('example', e.target.value);
    };

    removeSelf(e) {
        if (this.props.parent) {
            this.props.parent.query.children.splice(this.props.index, 1);
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

    getRootNodeQuery = () => {
        let parent = this.props.parent;
        let query = this.props.query;
        while (parent) {
            query = parent.query;
            parent = parent.parent
        }
        return query;
    };

    render() {
        return (
            <div className="query condition">
                <Card style={{marginBottom: 10}}>
                    <ControlGroup vertical={true}>
                        <ControlGroup vertical={false}>
                            <FormGroup
                                label={"Field name"}
                                labelInfo={"(required)"}
                                labelFor={"name"}
                                style={{marginRight: 5}}

                            >
                                <InputGroup
                                    id={"name"}
                                    className="operand name" value={this.props.query.fieldName}
                                    onChange={this.onFieldNameChange()} placeholder={"name"} required/>

                            </FormGroup>
                            <FormGroup
                                label={"Field type"}
                                labelInfo={"(required)"}
                                labelFor={"type"}
                                style={{marginRight: 10}}

                            >
                                <HTMLSelect id={"type"}
                                            className="operators" value={this.props.query.fieldType}
                                            onChange={this.onFieldTypeChange()} required>
                                    {knownTypesOptions}
                                </HTMLSelect>

                            </FormGroup>
                            <FormGroup
                                label={"SQL field"}
                                labelInfo={"(required)"}
                                labelFor={"db-field"}
                                style={{marginRight: 5}}
                            >
                                <HTMLSelect id={"db-field"}
                                            className="operators" value={this.props.query.db_name || ''}
                                            onChange={this.onFieldDbFieldChange()} required>
                                    <option value=""/>
                                    { fieldOptionsForSql(this.props.sql, this.getRootNodeQuery()) }
                                </HTMLSelect>

                            </FormGroup>
                            <Button className="conditionButton removeCondition"
                                    icon={"trash"}
                                    onClick={this.onDeleteAlert()}
                                    text={"Delete"}
                                    intent="danger"
                                    minimal={true}
                            />

                        </ControlGroup>
                        <ControlGroup vertical={false}>
                            <FormGroup
                                label={"Field example"}
                                labelInfo={"(optional)"}
                                labelFor={"example"}
                                style={{marginRight: 5}}
                            >
                                <InputGroup id={"example"}
                                            className="operand example" value={this.props.query.example}
                                            onChange={this.onFieldExampleChange()} placeholder={"example"}/>
                            </FormGroup>
                            <FormGroup
                                label={"Field description"}
                                labelInfo={"(optional)"}
                                labelFor={"description"}
                            >
                                <TextArea id={"description"}
                                          className="operand description" value={this.props.query.description}
                                          onChange={this.onFieldDescriptionChange()} placeholder={"description"}
                                          small={true}
                                          large={false}/>
                            </FormGroup>

                        </ControlGroup>

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

Condition.propTypes = {
    query: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

export default Condition
