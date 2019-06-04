import React from 'react'

import Condition from './Condition.react'
import {Button, InputGroup, ControlGroup, Card} from "@blueprintjs/core";

/**
 * ConditionGroup react component
 */
const ConditionGroup = React.createClass({
    propTypes: {
        query: React.PropTypes.object.isRequired,
        parent: React.PropTypes.object,
        index: React.PropTypes.number.isRequired
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
                                                           onChange={this.addKey}/>}
                        <Button className="conditionGroupButton addCondition" icon={"add"} text={"Field"}
                                onClick={this.addCondition}/>
                        <Button className="conditionGroupButton addGroup" icon={"add"} onClick={this.addGroup}
                                text={"Object"}/>
                        {!this.props.isRoot &&
                        <Button className="conditionGroupButton removeGroup" icon="trash" onClick={this.removeSelf}
                                text={"Delete"}/>}
                    </ControlGroup>

                    <div className="childrenConditions">
                        {childrenViews}
                    </div>
                </Card>
            </div>
        );
    }
});

export default ConditionGroup
