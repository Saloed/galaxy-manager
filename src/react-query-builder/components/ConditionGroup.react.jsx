import React from 'react'

import Condition from './Condition.react'
import SelectCondition from './SelectCondition.react'
import {Button, InputGroup, ControlGroup, Card, TextArea, Classes, Alert, Intent, ButtonGroup} from "@blueprintjs/core";
import PropTypes from "prop-types";

/**
 * ConditionGroup react component
 */
class ConditionGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showDeleteAlert: false};
        this.removeSelf = this.removeSelf.bind(this)
    }

    addCondition = () => (e) => {
        this.props.query.children.push({
            type: 'Condition',
            fieldType: 'string',
            fieldName: '',
            example: '',
            description: ''
        });
    }

    addSelectCondition = () => (e) => {
        this.props.query.children.push({
            type: 'SelectCondition',
            fieldName: '',
            endpointSelect: '',
            params: [],
            description: ''
        });
    }

    addGroup = () => (e) => {
        this.props.query.children.push({
            type: 'ConditionGroup',
            objectKey: '',
            description: '',
            children: []
        });
    }


    removeSelf(e) {
        if (this.props.parent) {
            this.props.parent.children.splice(this.props.index, 1);
        }
    }


    addKey = () => (e) => {
        this.props.query.set('objectKey', e.target.value)
    }

    onFieldDescriptionChange = () => (e) => {
        this.props.query.set('description', e.target.value)
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
        var childrenViews = this.props.query.children.map(function (childQuery, index) {
            if (childQuery.type === 'ConditionGroup') {
                return <ConditionGroup query={childQuery} parent={this.props.query} index={index} key={index}/>;
            } else if (childQuery.type === 'Condition') {
                return <Condition query={childQuery} parent={this.props.query} index={index} key={index}/>;
            } else if (childQuery.type === 'SelectCondition') {
                return <SelectCondition query={childQuery} parent={this.props.query} index={index} key={index}/>;
            } else {
                console.error('invalid type: type must be ConditionGroup or Condition');
                return null;
            }
        }.bind(this));

        return (
            <div className="query conditionGroup">
                <Card interactive={true}>
                    {!this.props.isRoot && <ControlGroup fill={false} vertical={false}>
                        <InputGroup className="object key" placeholder={"Key name for object"}
                                    defaultValue={this.props.query.objectKey}
                                    onChange={this.addKey()} required/>
                        <TextArea className="operand description" value={this.props.query.description}
                                  onChange={this.onFieldDescriptionChange()} placeholder={"description"} small={true}
                                  large={false}/>
                        <Button className="conditionGroupButton removeGroup" icon="trash" onClick={this.onDeleteAlert()}
                                text={"Delete"}/>
                    </ControlGroup>
                    }

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
                            Are you sure you want to delete object?
                        </p>
                    </Alert>


                    <div className="childrenConditions">
                        {childrenViews}
                    </div>
                    <ButtonGroup>
                        <Button className="conditionGroupButton addCondition" icon={"add"} text={"Field"}
                                onClick={this.addCondition()}/>
                        <Button className="conditionGroupButton addSelectCondition" icon={"add"} text={"Select"}
                                onClick={this.addSelectCondition()}/>
                        <Button className="conditionGroupButton addGroup" icon={"add"} onClick={this.addGroup()}
                                text={"Object"}/>
                    </ButtonGroup>
                </Card>
            </div>
        );
    }
};

ConditionGroup.propTypes = {
    query: PropTypes.object.isRequired,
    parent: PropTypes.object,
    index: PropTypes.number.isRequired
}

export default ConditionGroup
