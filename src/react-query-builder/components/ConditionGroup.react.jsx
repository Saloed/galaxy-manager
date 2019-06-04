import React from 'react'

import Condition from './Condition.react'
import {Button, InputGroup, ControlGroup, Card, TextArea, Classes, Alert, Intent} from "@blueprintjs/core";

/**
 * ConditionGroup react component
 */
const ConditionGroup = React.createClass({
    propTypes: {
        query: React.PropTypes.object.isRequired,
        parent: React.PropTypes.object,
        index: React.PropTypes.number.isRequired
    },
    getInitialState() {
        return {showDeleteAlert: false};
    },
    addCondition: function (e) {
        this.props.query.children.push({
            type: 'Condition',
            fieldType: 'string',
            fieldName: '',
            endpointSelect: '',
            example: '',
            description: ''
        });
    },

    addGroup: function (e) {
        this.props.query.children.push({
            type: 'ConditionGroup',
            objectKey: '',
            description: '',
            children: []
        });
    },

    removeSelf: function (e) {
        if (this.props.parent) {
            this.props.parent.children.splice(this.props.index, 1);
        }
    },

    addKey: function (e) {
        this.props.query.set('objectKey', e.target.value)
    },

    onFieldDescriptionChange: function (e) {
        this.props.query.set('description', e.target.value)
    },

    onDeleteAlert: function (e) {
        this.setState({showDeleteAlert: true})
    },

    handleDeleteCancel: function (e) {
        this.setState({showDeleteAlert: false})
    },

    handleDeleteOk: function (e) {
        this.setState({showDeleteAlert: false})
        this.removeSelf(e)
    },


    render: function () {
        var childrenViews = this.props.query.children.map(function (childQuery, index) {
            if (childQuery.type === 'ConditionGroup') {
                return <ConditionGroup query={childQuery} parent={this.props.query} index={index} key={index}/>;
            } else if (childQuery.type === 'Condition') {
                return <Condition query={childQuery} parent={this.props.query} index={index} key={index}/>;
            } else {
                console.error('invalid type: type must be ConditionGroup or Condition');
                return null;
            }
        }.bind(this));

        return (
            <div className="query conditionGroup">
                <Card interactive={true}>
                    <ControlGroup fill={false} vertical={false}>
                        {!this.props.isRoot && <InputGroup className="object key" placeholder={"Key name for object"}
                                                           defaultValue={this.props.query.objectKey}
                                                           onChange={this.addKey} required/>}
                        <Button className="conditionGroupButton addCondition" icon={"add"} text={"Field"}
                                onClick={this.addCondition}/>
                        <Button className="conditionGroupButton addGroup" icon={"add"} onClick={this.addGroup}
                                text={"Object"}/>
                        <TextArea className="operand description" value={this.props.query.description}
                                  onChange={this.onFieldDescriptionChange} placeholder={"description"} small={true}
                                  large={false}/>
                        {!this.props.isRoot &&
                        <Button className="conditionGroupButton removeGroup" icon="trash" onClick={this.onDeleteAlert}
                                text={"Delete"}/>}
                    </ControlGroup>

                    <Alert
                        className={"Delete alert"}
                        cancelButtonText="Cancel"
                        confirmButtonText="Delete"
                        icon="trash"
                        intent={Intent.DANGER}
                        isOpen={this.state.showDeleteAlert}
                        onCancel={this.handleDeleteCancel}
                        onConfirm={this.handleDeleteOk}
                    >
                        <p>
                            Are you sure you want to delete object?
                        </p>
                    </Alert>


                    <div className="childrenConditions">
                        {childrenViews}
                    </div>
                </Card>
            </div>
        );
    }
});

export default ConditionGroup
