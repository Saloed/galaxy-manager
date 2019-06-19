import React from 'react'

import Condition from './Condition.react'
import SelectCondition from './SelectCondition.react'
import {
    Button,
    InputGroup,
    ControlGroup,
    Card,
    TextArea,
    Classes,
    Alert,
    Intent,
    ButtonGroup,
    FormGroup, Switch, HTMLSelect
} from "@blueprintjs/core";
import PropTypes from "prop-types";
import {fieldOptionsForSql} from "../../utils";

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
            db_name: null,
            example: '',
            description: ''
        });
    };

    addSelectCondition = () => (e) => {
        this.props.query.children.push({
            type: 'SelectCondition',
            fieldName: '',
            endpoint: {
                name: null,
                params: {}
            },
            description: ''
        });
    };

    addGroup = () => (e) => {
        this.props.query.children.push({
            type: 'ConditionGroup',
            objectKey: '',
            name: '',
            description: '',
            many: false,
            aggregate: false,
            aggregation_field: null,
            children: []
        });
    };


    removeSelf(e) {
        if (this.props.parent) {
            this.props.parent.query.children.splice(this.props.index, 1);
        }
    }


    addKey = () => (e) => {
        this.props.query.set('objectKey', e.target.value)
    };

    addObjectName = () => (e) => {
        this.props.query.set('name', e.target.value)
    };

    onFieldDescriptionChange = () => (e) => {
        this.props.query.set('description', e.target.value)
    };

    handleAggregationManyChange = () => (e) => {
        this.props.query.set('many', e.target.checked)
    };

    handleAggregationAggregateChange = () => (e) => {
        this.props.query.set('aggregate', e.target.checked)
    };

    onAggregationKeyChange = () => (e) => {
        const value = e.target.value === '' ? null : e.target.value;
        this.props.query.set('aggregation_field', value)

    };

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

    checkManyAvailable = () => {
        if (!this.props.aggregationEnabled) return false;
        let parent = this.props.parent;
        while (parent) {
            if(parent.query.aggregate) return true;
            if(parent.query.many) return false;
            parent = parent.parent
        }
        return true;
    };

    render() {
        const childrenViews = this.props.query.children.map(function (childQuery, index) {
            if (childQuery.type === 'ConditionGroup') {
                return <ConditionGroup query={childQuery} parent={this.props} index={index} key={index}
                                       allSql={this.props.allSql}
                                       allDescriptions={this.props.allDescriptions}
                                       sql={this.props.sql}
                                       description={this.props.description}
                                       aggregationEnabled={this.props.aggregationEnabled}
                />;
            } else if (childQuery.type === 'Condition') {
                return <Condition query={childQuery} parent={this.props} index={index} key={index}
                                  allSql={this.props.allSql}
                                  allDescriptions={this.props.allDescriptions}
                                  sql={this.props.sql}
                                  description={this.props.description}
                />;
            } else if (childQuery.type === 'SelectCondition') {
                return <SelectCondition query={childQuery} parent={this.props} index={index} key={index}
                                        allSql={this.props.allSql}
                                        allDescriptions={this.props.allDescriptions}
                                        sql={this.props.sql}
                                        description={this.props.description}
                />;
            } else {
                console.error('invalid type: type must be ConditionGroup or Condition');
                return null;
            }
        }.bind(this));
        const element = (
            <div className="query conditionGroup">
                {!this.props.isRoot && <ControlGroup fill={false} vertical={true}>
                    <ControlGroup vertical={false}>
                        <FormGroup
                            label={"Object key field"}
                            labelInfo={"(required)"}
                            labelFor={"obj-key"}
                            style={{marginRight: 5}}
                        >
                            <InputGroup id={"obj-key"}
                                        className="object key"
                                        placeholder={"Key name for object"}
                                        defaultValue={this.props.query.objectKey}
                                        onChange={this.addKey()}
                                        required/>
                        </FormGroup>
                        <FormGroup
                            label={"Object name"}
                            labelInfo={this.props.query.many ? "(required)" : "(optional)"}
                            labelFor={"obj-name"}
                            style={{marginRight: 5}}
                        >
                            <InputGroup id={"obj-name"}
                                        className="object name"
                                        placeholder={"Name of object"}
                                        defaultValue={this.props.query.name}
                                        onChange={this.addObjectName()}
                                        required={this.props.query.many}
                            />
                        </FormGroup>
                        {this.checkManyAvailable() && <FormGroup
                            label={"Many objects field"}
                            labelInfo={"(optional)"}
                            labelFor={"many"}
                            style={{marginRight: 5}}
                        >
                            <Switch id={'many'}
                                    checked={this.props.query.many}
                                    label="Many"
                                    onChange={this.handleAggregationManyChange()}
                            />
                        </FormGroup>}
                        {this.props.aggregationEnabled && <FormGroup
                            label={"Aggregation field"}
                            labelInfo={"(optional)"}
                            labelFor={"aggregation"}
                            helperText="Enables aggregation of this object with selected key"
                            style={{marginRight: 5}}
                        >
                            <Switch id={'aggregation'}
                                    checked={this.props.query.aggregate}
                                    label="Aggregation"
                                    onChange={this.handleAggregationAggregateChange()}
                            />
                        </FormGroup>}
                        {this.props.query.aggregate && <FormGroup
                            label={"Aggregation key"}
                            labelFor="param-selector"
                            labelInfo="(required)"
                            style={{marginRight: 5}}
                        >
                            <HTMLSelect
                                id="param-selector"
                                className="endpoints-select-param"
                                value={this.props.query.aggregation_field || ''}
                                onChange={this.onAggregationKeyChange()}
                            >
                                <option value=""/>
                                {fieldOptionsForSql(this.props.sql)}
                            </HTMLSelect>
                        </FormGroup>
                        }
                        <Button className="conditionGroupButton removeGroup"
                                icon="trash"
                                onClick={this.onDeleteAlert()}
                                text={"Delete"}
                                intent="danger"
                                minimal={true}
                        />

                    </ControlGroup>

                    <FormGroup
                        label={"Object description"}
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
                            onClick={this.addCondition()}
                            style={{marginRight: 5}}
                    />
                    <Button className="conditionGroupButton addSelectCondition" icon={"add"} text={"Select"}
                            onClick={this.addSelectCondition()}
                            style={{marginRight: 5}}
                    />
                    <Button className="conditionGroupButton addGroup" icon={"add"} onClick={this.addGroup()}
                            text={"Object"}/>
                </ButtonGroup>
            </div>
        );
        if (!this.props.isRoot) {
            return (
                <Card interactive={true}>
                    {element}
                </Card>
            )
        } else {
            return element
        }
    }


}

ConditionGroup.propTypes = {
    query: PropTypes.object.isRequired,
    parent: PropTypes.object,
    index: PropTypes.number.isRequired
};

export default ConditionGroup
